/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import ToolPanel from './ToolPanel';
import { useEntitySelectionResource, useSelection } from "../../../utils/hooks";
import { MediaItem } from "../../../models/Search";
import { createStyles } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SearchBar from '../../../components/SearchBar';
import { useDispatch, useSelector } from "react-redux";
import GlobalState, { PagedEntityState } from "../../../models/GlobalState";
import TablePagination from "@material-ui/core/TablePagination";
import { Subject } from "rxjs";
import LoadingState from "../../../components/SystemStatus/LoadingState";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { DRAWER_WIDTH, getHostToGuestBus } from "../previewContext";
import { ASSET_DRAG_ENDED, ASSET_DRAG_STARTED, fetchAssetsPanelItems } from "../../../state/actions/preview";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import MediaCard from '../../../components/MediaCard';
import DragIndicatorRounded from '@material-ui/icons/DragIndicatorRounded';
import EmptyState from "../../../components/SystemStatus/EmptyState";

const translations = defineMessages({
  assetsPanel: {
    id: 'craftercms.ice.assets.title',
    defaultMessage: 'Assets'
  },
  itemsPerPage: {
    id: 'craftercms.ice.assets.itemsPerPage',
    defaultMessage: 'Items per page:'
  },
  noResults: {
    id: 'craftercms.ice.assets.noResults',
    defaultMessage: ' No results found.'
  },
  retrieveAssets: {
    id: 'craftercms.ice.assets.retrieveAssets',
    defaultMessage: 'Retrieving Site Assets'
  },
  previousPage: {
    id: 'craftercms.ice.assets.previousPage',
    defaultMessage: 'previous page'
  },
  nextPage: {
    id: 'craftercms.ice.assets.nextPage',
    defaultMessage: 'next page'
  },
  loading: {
    id: 'craftercms.ice.assets.loading',
    defaultMessage: 'Loading'
  }
});

const assetsPanelStyles = makeStyles(() => createStyles({
  assetsPanelWrapper: {
    padding: '15px 15px 55px 15px'
  },
  search: {
    padding: '15px 15px 0px 15px',
  },
  card: {
    cursor: 'move',
    marginBottom: '16px',
  },
  pagination: {
    marginLeft: 'auto',
    position: 'fixed',
    zIndex: 1,
    bottom: 0,
    background: 'white',
    color: 'black',
    width: `calc(${DRAWER_WIDTH}px - 1px)`,
    left: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    '& p': {
      padding: 0
    },
    '& svg': {
      top: 'inherit'
    },
    '& .hidden': {
      display: 'none'
    }
  },
  toolbar: {
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    '& .MuiTablePagination-spacer': {
      display: 'none'
    },
    '& .MuiTablePagination-spacer + p': {
      display: 'none'
    }
  },
  noResultsImage: {
    width: '150px'
  },
  noResultsTitle: {
    fontSize: 'inherit',
    marginTop: '10px'
  }
}));

export default function AssetsPanel() {
  const classes = assetsPanelStyles({});
  const onSearch$ = useMemo(() => new Subject<string>(), []);
  const initialKeyword = useSelection(state => state.preview.assets.query.keywords);
  const [keyword, setKeyword] = useState(initialKeyword);
  const hostToGuest$ = getHostToGuestBus();
  const dispatch = useDispatch();
  const resource = useEntitySelectionResource(state => state.preview.assets, state => state);
  const { formatMessage } = useIntl();

  const onDragStart = (mediaItem: MediaItem) => hostToGuest$.next({
    type: ASSET_DRAG_STARTED,
    payload: mediaItem
  });

  const onDragEnd = () => hostToGuest$.next({
    type: ASSET_DRAG_ENDED
  });

  useEffect(() => {
    const subscription = onSearch$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((keywords: string) => {
      dispatch(fetchAssetsPanelItems({ keywords }));
    });
    return () => subscription.unsubscribe();
  }, [dispatch, onSearch$]);

  function onPageChanged(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) {
    dispatch(fetchAssetsPanelItems({ offset: newPage }));
  }

  function handleSearchKeyword(keyword: string) {
    setKeyword(keyword);
    onSearch$.next(keyword);
  }

  return (
    <ToolPanel title={translations.assetsPanel}>
      <ErrorBoundary>
        <div className={classes.search}>
          <SearchBar
            onChange={handleSearchKeyword}
            keyword={keyword}
          />
        </div>
        <React.Suspense
          fallback={
            <LoadingState
              title={formatMessage(translations.loading)}
              graphicProps={{ width: 150 }}
            />
          }
        >
          <AssetsPanelUI
            classes={classes}
            assetsResource={resource}
            onPageChanged={onPageChanged}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </React.Suspense>
      </ErrorBoundary>
    </ToolPanel>
  );
}


export function AssetsPanelUI(props) {
  const {
    classes,
    assetsResource,
    onPageChanged,
    onDragStart,
    onDragEnd
  } = props;
  const { GUEST_BASE } = useSelector<GlobalState, GlobalState['env']>(state => state.env);
  const assets: PagedEntityState<MediaItem> = assetsResource.read();
  const { byId, count: total, query, page } = assets;
  const pageNumber = Math.ceil(query.offset / query.limit);
  const items = page[pageNumber];
  const { formatMessage } = useIntl();

  return (
    <div className={classes.assetsPanelWrapper}>
      <TablePagination
        className={classes.pagination}
        classes={{ root: classes.pagination, selectRoot: 'hidden', toolbar: classes.toolbar }}
        component="div"
        labelRowsPerPage=""
        count={total}
        rowsPerPage={query.limit}
        page={pageNumber}
        backIconButtonProps={{
          'aria-label': formatMessage(translations.previousPage),
        }}
        nextIconButtonProps={{
          'aria-label': formatMessage(translations.nextPage),
        }}
        onChangePage={(e: React.MouseEvent<HTMLButtonElement>, page: number) => onPageChanged(e, page * query.limit)}
      />
      {
        items.map((id: string) => {
            let item = byId[id];
            return (
              <MediaCard
                key={item.path}
                item={item}
                previewAppBaseUri={GUEST_BASE}
                hasSubheader={false}
                avatar={DragIndicatorRounded}
                classes={{ root: classes.card }}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            )
          }
        )
      }
      {
        total === 0 &&
        <EmptyState
          title={formatMessage(translations.noResults)}
          classes={{ image: classes.noResultsImage, title: classes.noResultsTitle }}
        />
      }
    </div>
  )
}

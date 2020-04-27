/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useCallback, useReducer, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TablePagination from '@material-ui/core/TablePagination';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PublicRounded';
import FlagRoundedIcon from '@material-ui/icons/FlagRounded';
import PlaceRoundedIcon from '@material-ui/icons/PlaceRounded';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import NavigateNextIcon from '@material-ui/icons/NavigateNextRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { copyItem, cutItem, getChildrenByPath, getPages, pasteItem } from '../services/content';
import { getTargetLocales } from '../services/translation';
import { LegacyItem, SandboxItem } from '../models/Item';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import { LookupTable } from '../models/LookupTable';
import ContextMenu, { SectionItem } from './ContextMenu';
import SearchBar from './Controls/SearchBar';
import { useActiveSiteId, useOnMount, useSpreadState, useStateResource } from '../utils/hooks';
import CopyItemsDialog from './CopyItemsDialog';
import ContentLocalizationDialog from './ContentLocalizationDialog';
import { palette } from '../styles/theme';
import { useDispatch } from 'react-redux';
import { showErrorDialog } from '../state/reducers/dialogs/error';
import { showHistoryDialog } from '../state/reducers/dialogs/history';
import { Resource } from '../models/Resource';
import { SuspenseWithEmptyState } from './SystemStatus/Suspencified';
import StandardAction from '../models/StandardAction';
import { createAction } from '@reduxjs/toolkit';
import { createLookupTable, nou } from '../utils/object';
import LeafIcon from '@material-ui/icons/EcoRounded';
import FolderIcon from '@material-ui/icons/FolderOpenRounded';
import PageIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { GetChildrenResponse } from '../models/GetChildrenResponse';
import { withIndex, withoutIndex } from '../utils/path';

const flagColor = 'rgba(255, 59, 48, 0.5)';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '&.collapsed': {
        paddingBottom: 5
      }
    },
    widgetSection: {
      padding: `0 10px`,
      '& .MuiSvgIcon-root': {
        fontSize: '1.1rem'
      }
    },
    flag: {
      color: flagColor,
      fontSize: '1rem',
      marginLeft: '5px'
    },
    optionsWrapper: {
      marginLeft: 'auto',
      display: 'flex',
      visibility: 'hidden'
    },
    optionsWrapperOver: {
      visibility: 'visible'
    },
    // region Header
    headerRoot: {
      display: 'flex',
      padding: '5px 10px 0',
      alignItems: 'center',
      '& .MuiSvgIcon-root': {
        fontSize: '1.1rem'
      }
    },
    headerTitle: {
      marginLeft: '6px',
      flexGrow: 1
    },
    // endregion
    pagesIcon: {
      fontSize: '1.1rem'
    },
    iconButton: {
      padding: '6px'
    },
    itemIconButton: {
      padding: '2px 3px'
    },
    searchRoot: {},
    // region Breadcrumbs
    breadcrumbs: {
      display: 'flex',
      alignItems: 'center'
    },
    breadcrumbsList: {
      display: 'flex',
      alignItems: 'center',
      padding: '9px 0',
      '& li': {
        lineHeight: 1
      }
    },
    breadcrumbsSeparator: {
      margin: '0 2px'
    },
    breadcrumbsTypography: {
      fontWeight: 'bold',
      color: palette.gray.medium4
    },
    breadcrumbLast: {
      color: palette.teal.shade,
      textDecoration: 'underline'
    },
    // endregion
    // region Pagination
    pagination: {
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
    paginationToolbar: {
      display: 'flex',
      minHeight: '30px',
      justifyContent: 'space-between',
      '& .MuiTablePagination-spacer': {
        display: 'none'
      },
      '& .MuiTablePagination-spacer + p': {
        display: 'none'
      },
      '& .MuiButtonBase-root': {
        padding: 0
      }
    },
    // endregion
    menuPaper: {
      width: '182px'
    },
    menuList: {
      padding: 0
    },
    menuItemRoot: {
      whiteSpace: 'initial'
    },
    helperText: {
      padding: '10px 16px 10px 16px',
      color: '#8E8E93'
    },
    // region Nav Styles
    stateGraphics: {
      width: 100
    },
    // endregion
    // region Nav Item Styles
    icon: {
      fontSize: '1.2rem'
    },
    typeIcon: {
      marginRight: 5,
      fontSize: '1.2rem',
      color: palette.gray.medium4
    },
    navItem: {
      justifyContent: 'space-between',
      padding: '0 0 0 10px',
      '&.noLeftPadding': {
        paddingLeft: 0
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      }
    },
    navItemText: {
      color: palette.teal.shade,
      padding: 0,
      marginRight: 'auto',
      '&.opacity': {
        opacity: '0.7'
      },
      '&.select-mode': {
        color: palette.black
      },
      '&.non-navigable': {
        color: palette.gray.medium7
      }
    },
    navItemCheckbox: {
      padding: '6px',
      color: theme.palette.primary.main
    },
    // endregion
  })
);

const translations = defineMessages({
  previousPage: {
    id: 'pagination.previousPage',
    defaultMessage: 'Previous page'
  },
  nextPage: {
    id: 'pagination.nextPage',
    defaultMessage: 'Next page'
  },
  itemsSelected: {
    id: 'craftercms.pages.widget.itemsSelected',
    defaultMessage: '{count, plural, one {{count} Item selected} other {{count} Items selected}}'
  },
  copyDialogTitle: {
    id: 'craftercms.copy.dialog.title',
    defaultMessage: 'Copy'
  },
  copyDialogSubtitle: {
    id: 'craftercms.copy.dialog.subtitle',
    defaultMessage:
      'Please select any of the sub-pages you would like to batch copy. When pasting, any selected sub-pages and their positional heirarchy will be retained.'
  },
  edit: {
    id: 'words.edit',
    defaultMessage: 'Edit'
  },
  view: {
    id: 'words.view',
    defaultMessage: 'View'
  },
  newContent: {
    id: 'craftercms.pages.option.newContent',
    defaultMessage: 'New Content'
  },
  newFolder: {
    id: 'craftercms.pages.option.newFolder',
    defaultMessage: 'New Folder'
  },
  changeTemplate: {
    id: 'craftercms.pages.option.changeTemplate',
    defaultMessage: 'Change Template'
  },
  cut: {
    id: 'words.cut',
    defaultMessage: 'Cut'
  },
  copy: {
    id: 'words.copy',
    defaultMessage: 'Copy'
  },
  paste: {
    id: 'words.paste',
    defaultMessage: 'Paste'
  },
  duplicate: {
    id: 'words.duplicate',
    defaultMessage: 'Duplicate'
  },
  delete: {
    id: 'words.delete',
    defaultMessage: 'Delete'
  },
  dependencies: {
    id: 'words.dependencies',
    defaultMessage: 'Dependencies'
  },
  history: {
    id: 'words.history',
    defaultMessage: 'History'
  },
  translation: {
    id: 'words.translation',
    defaultMessage: 'Translation'
  },
  select: {
    id: 'words.select',
    defaultMessage: 'Select'
  },
  terminateSelection: {
    id: 'craftercms.pages.option.terminateSelection',
    defaultMessage: 'Terminate Selection'
  }
});

const menuOptions = {
  edit: {
    id: 'edit',
    label: translations.edit
  },
  view: {
    id: 'view',
    label: translations.view
  },
  newContent: {
    id: 'newcontent',
    label: translations.newContent
  },
  newFolder: {
    id: 'newfolder',
    label: translations.newFolder
  },
  changeTemplate: {
    id: 'changeTemplate',
    label: translations.changeTemplate
  },
  cut: {
    id: 'cut',
    label: translations.cut
  },
  copy: {
    id: 'copy',
    label: translations.copy
  },
  paste: {
    id: 'paste',
    label: translations.paste
  },
  duplicate: {
    id: 'duplicate',
    label: translations.duplicate
  },
  delete: {
    id: 'delete',
    label: translations.delete
  },
  dependencies: {
    id: 'dependencies',
    label: translations.dependencies
  },
  history: {
    id: 'history',
    label: translations.history
  },
  translation: {
    id: 'translation',
    label: translations.translation
  },
  select: {
    id: 'select',
    label: translations.select
  },
  itemsSelected: {
    id: 'itemsSelected',
    label: translations.itemsSelected,
    type: 'text',
    values: {
      count: 0
    }
  },
  terminateSelection: {
    id: 'terminateSelection',
    label: translations.terminateSelection
  }
};

function generateMenuSections(item: SandboxItem, menuState: MenuState, count?: number) {
  let sections = [];
  if (menuState.selectMode && !item) {
    if (count > 0) {
      let selectedMenuItems = menuOptions.itemsSelected;
      selectedMenuItems.values.count = count;
      sections.push([selectedMenuItems, menuOptions.terminateSelection]);
    } else {
      sections.push([menuOptions.terminateSelection]);
    }
    sections.push(
      menuState.hasClipboard
        ? [
          menuOptions.cut,
          menuOptions.copy,
          menuOptions.paste,
          menuOptions.duplicate,
          menuOptions.delete
        ]
        : [menuOptions.cut, menuOptions.copy, menuOptions.duplicate, menuOptions.delete]
    );
    sections.push([menuOptions.translation]);
  } else {
    sections.push(
      [menuOptions.edit, menuOptions.view, menuOptions.newContent, menuOptions.newFolder],
      [menuOptions.delete, menuOptions.changeTemplate]
    );
    sections.push(
      menuState.hasClipboard
        ? [menuOptions.cut, menuOptions.copy, menuOptions.paste, menuOptions.duplicate]
        : [menuOptions.cut, menuOptions.copy, menuOptions.duplicate]
    );
    sections.push([menuOptions.dependencies], [menuOptions.history, menuOptions.translation]);
    if (!item) {
      sections.push([menuOptions.select]);
    }
  }

  return sections;
}

interface HeaderProps {
  locale: string;
  title: string;
  icon: React.ElementType | string;
  onClick?(): void;
  onLanguageMenu?(anchor: Element): void;
  onContextMenu?(anchor: Element): void;
}

interface BreadcrumbsProps {
  keyword: string;
  breadcrumb: SandboxItem[];
  onMenu(element: Element): void;
  onSearch(keyword: string): void;
  onCrumbSelected(breadcrumb: SandboxItem): void;
}

interface NavItemProps {
  item: SandboxItem;
  locale: string;
  isLeaf: boolean;
  isSelectMode: boolean;
  onItemClicked?(item: SandboxItem, event: React.MouseEvent): void;
  onChangeParent?(item: SandboxItem): void;
  onItemChecked?(item: SandboxItem, unselect: boolean): void;
  onOpenItemMenu(element: Element, item: SandboxItem): void;
}

interface NavProps {
  locale: string;
  resource: Resource<SandboxItem[]>;
  isSelectMode: boolean;
  leafs: string[];
  onItemClicked(item: SandboxItem): void;
  onSelectItem(item: SandboxItem, unselect: boolean): void;
  onPathSelected(item: SandboxItem): void;
  onOpenItemMenu(element: Element, item: SandboxItem): void;
}

interface WidgetProps {
  path: string;
  icon?: string | React.ElementType;
  title?: string;
  locale: string;
  classes?: {
    root?: string;
  }
}

interface MenuState {
  selectMode: boolean;
  hasClipboard: boolean;
}

// PathNavigatorHeader
function Header(props: HeaderProps) {
  const classes = useStyles({});
  const { title, icon: Icon, locale, onLanguageMenu, onContextMenu, onClick } = props;
  const currentFlag = (locale: string) => {
    switch (locale) {
      case 'en': {
        return <PhotoSizeSelectActualIcon />;
      }
      case 'es': {
        return <PlaceRoundedIcon />;
      }
      default: {
        return <PhotoSizeSelectActualIcon />;
      }
    }
  };
  return (
    <header className={clsx(classes.headerRoot)} onClick={onClick}>
      {typeof Icon === 'string' ? (
        <span className={`fa ${Icon}`} />
      ) : (
        <Icon className={classes.pagesIcon} />
      )}
      <Typography
        variant="body1"
        component="h6"
        className={classes.headerTitle}
        children={title}
      />
      <IconButton
        aria-label="language select"
        className={classes.iconButton}
        onClick={(e) => {
          e.stopPropagation();
          onLanguageMenu(e.currentTarget)
        }}
      >
        {currentFlag(locale)}
      </IconButton>
      <IconButton
        aria-label="options"
        className={classes.iconButton}
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </header>
  );
}

// PathBreadcrumbs + PathOptions + (Path)Search
function Breadcrumbs(props: BreadcrumbsProps) {
  const classes = useStyles({});
  const { breadcrumb, onCrumbSelected, onMenu, keyword, onSearch } = props;
  const [showSearch, setShowSearch] = useState(false);

  const onChange = (keyword: string) => {
    if (keyword === '') {
      setShowSearch(false);
    }
    onSearch(keyword);
  };

  const maxIndex = breadcrumb.length - 1;

  return (
    <section className={clsx(classes.breadcrumbs, classes.widgetSection)}>
      {showSearch ? (
        <SearchBar
          autoFocus
          onChange={onChange}
          keyword={keyword}
          showActionButton={true}
          onActionButtonClick={() => onChange('')}
          classes={{ root: classes.searchRoot }}
        />
      ) : (
        <>
          <MuiBreadcrumbs
            maxItems={2}
            aria-label="Breadcrumbs"
            separator={<NavigateNextIcon fontSize="small" />}
            classes={{
              ol: classes.breadcrumbsList,
              separator: classes.breadcrumbsSeparator
            }}
          >
            {breadcrumb.map((item: SandboxItem, i: number) =>
              maxIndex !== i || (maxIndex === i && isNavigable(item)) ? (
                <Link
                  key={item.id}
                  color="inherit"
                  component="button"
                  variant="subtitle2"
                  underline="always"
                  TypographyClasses={{
                    root: clsx(
                      classes.breadcrumbsTypography,
                      maxIndex === i && classes.breadcrumbLast
                    )
                  }}
                  onClick={() => onCrumbSelected(item)}
                  children={item.label}
                />
              ) : (
                <Typography
                  key={item.id}
                  variant="subtitle2"
                  className={classes.breadcrumbsTypography}
                  children={item.label}
                />
              )
            )}
          </MuiBreadcrumbs>
          <div className={clsx(classes.optionsWrapper, classes.optionsWrapperOver)}>
            <IconButton
              aria-label="options"
              className={clsx(classes.iconButton)}
              onClick={(event) => onMenu(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <IconButton
              aria-label="search"
              className={clsx(classes.iconButton)}
              onClick={() => setShowSearch(true)}
            >
              <SearchRoundedIcon />
            </IconButton>
          </div>
        </>
      )}
    </section>
  );
}

// PathListing
function Nav(props: NavProps) {
  const {
    resource,
    onPathSelected,
    locale,
    isSelectMode,
    onSelectItem,
    onOpenItemMenu,
    onItemClicked,
    leafs
  } = props;
  const items = resource.read();
  return (
    <List component="nav" disablePadding={true}>
      {items.map((item: SandboxItem) => (
        <NavItem
          item={item}
          key={item.id}
          isLeaf={leafs.includes(item.id)}
          locale={locale}
          onChangeParent={onPathSelected}
          isSelectMode={isSelectMode}
          onItemChecked={onSelectItem}
          onOpenItemMenu={onOpenItemMenu}
          onItemClicked={onItemClicked}
        />
      ))}
    </List>
  );
}

// PathListItem
function NavItem(props: NavItemProps) {
  const classes = useStyles(props);
  const {
    item,
    onItemClicked,
    onChangeParent,
    locale,
    isSelectMode,
    onItemChecked,
    onOpenItemMenu,
    isLeaf
  } = props;
  const [over, setOver] = useState(false);
  const onMouseOver = isSelectMode ? null : () => setOver(true);
  const onMouseLeave = isSelectMode ? null : () => setOver(false);
  const onClick = (e) => onItemClicked?.(item, e);
  const navigable = isNavigable(item);
  return (
    <ListItem
      button={!isSelectMode as true}
      className={clsx(classes.navItem, isSelectMode && 'noLeftPadding')}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={navigable ? onClick : () => onChangeParent?.(item)}
    >
      {isSelectMode ? (
        <Checkbox
          color="default"
          className={classes.navItemCheckbox}
          onChange={(e) => {
            onItemChecked(item, e.currentTarget.checked);
          }}
          value="primary"
        />
      ) : navigable ? (
        isLeaf ? (
          <LeafIcon className={classes.typeIcon} />
        ) : (
          <PageIcon className={classes.typeIcon} />
        )
      ) : (
        <FolderIcon className={classes.typeIcon} />
      )}
      <Typography
        variant="body2"
        className={clsx(
          classes.navItemText,
          !isSelectMode && locale !== item.localeCode && 'opacity',
          isSelectMode && 'select-mode',
          !navigable && 'non-navigable'
        )}
      >
        {item.label}
        {locale !== item.localeCode && <FlagRoundedIcon className={classes.flag} />}
      </Typography>
      <div className={clsx(classes.optionsWrapper, over && classes.optionsWrapperOver)}>
        <IconButton
          aria-label="Options"
          className={classes.itemIconButton}
          onClick={(event) => {
            event.stopPropagation();
            onOpenItemMenu(event.currentTarget, item);
          }}
        >
          <MoreVertIcon className={classes.icon} />
        </IconButton>
        <IconButton
          disabled={isLeaf}
          aria-label="Options"
          className={classes.itemIconButton}
          onClick={(event) => {
            event.stopPropagation();
            onChangeParent(item);
          }}
        >
          <ChevronRightRoundedIcon className={classes.icon} />
        </IconButton>
      </div>
    </ListItem>
  );
}

interface WidgetState {
  rootPath: string;
  currentPath: string;
  localeCode: string;
  keyword: '';
  isSelectMode: boolean;
  hasClipboard: boolean;
  itemsInPath: string[];
  items: LookupTable<SandboxItem>;
  breadcrumb: SandboxItem[];
  selectedItems: string[];
  leafs: string[];
  count: number; // Number of items in the current path
  limit: number;
  offset: number;
}

// TODO: an initial path with trailing `/` breaks
function itemsFromPath(path: string, root: string, items: LookupTable<SandboxItem>): SandboxItem[] {
  const rootWithIndex = withIndex(root);
  const rootWithoutIndex = withoutIndex(root);
  const rootItem = items[rootWithIndex] ?? items[root];
  if (path === rootWithIndex || path === root) {
    return [rootItem];
  }
  const regExp = new RegExp(`${rootWithIndex}|${rootWithoutIndex}|\\/index\\.xml|/$`, 'g');
  const pathWithoutRoot = path.replace(regExp, '');
  let accum = rootWithoutIndex;
  return [
    rootItem,
    ...pathWithoutRoot
      .split('/')
      .slice(1)
      .map((folder) => {
        accum += `/${folder}`;
        return items[accum] ?? items[withIndex(accum)];
      })
  ];
}

function isNavigable(item: SandboxItem): boolean {
  return Boolean(item.previewUrl);
}

const init: (props: WidgetProps) => WidgetState = (props: WidgetProps) => ({
  rootPath: props.path,
  currentPath: props.path,
  localeCode: props.locale,
  keyword: '',
  isSelectMode: false,
  hasClipboard: false,
  itemsInPath: null,
  items: {},
  breadcrumb: [],
  selectedItems: [],
  leafs: [],
  limit: 10,
  offset: 0,
  count: 0
});

type WidgetReducer = React.Reducer<WidgetState, StandardAction>;

const reducer: WidgetReducer = (state, { type, payload }) => {
  switch (type) {
    case fetchPath.type:
      return state;
    case fetchPathComplete.type: {
      const path = state.currentPath;
      // Check and handle if the item has no children
      if (
        payload.length === 0 &&
        // If it is the root path, we want to show the empty state,
        // vs child paths, want to show the previous path and inform
        // that there aren't any items at that path
        withoutIndex(path) !== withoutIndex(state.rootPath)
      ) {
        let pieces = path.split('/').slice(0);
        pieces.pop();
        if (path.includes('index.xml')) {
          pieces.pop();
        }
        let nextPath = pieces.join('/');
        if (nou(state.items[nextPath])) {
          nextPath = withIndex(nextPath);
        }
        return {
          ...state,
          // Revert path to previous (parent) path
          currentPath: nextPath,
          leafs: state.leafs.concat(path)
        };
      } else {
        const nextItems = {
          ...state.items,
          [payload.parent.id]: payload.parent,
          ...createLookupTable(payload)
        };
        return {
          ...state,
          breadcrumb: itemsFromPath(path, state.rootPath, nextItems),
          itemsInPath: payload.map((item) => item.id),
          items: nextItems,
          count: payload.length
        };
      }
    }
    case setCurrentPath.type:
      return {
        ...state,
        keyword: '',
        currentPath: payload
      };
    case setKeyword.type:
      return {
        ...state,
        keyword: payload
      };
    case itemUnchecked.type:
    case setLocaleCode.type:
    case itemChecked.type:
    case clearChecked.type:
      return state;
    default:
      throw new Error(`Unknown action "${type}"`);
  }
};

const setLocaleCode = createAction<string>('SET_LOCALE_CODE');
const setCurrentPath = createAction<string>('SET_CURRENT_PATH');
const itemChecked = createAction<SandboxItem>('ITEM_CHECKED');
const itemUnchecked = createAction<SandboxItem>('ITEM_UNCHECKED');
const clearChecked = createAction('CLEAR_CHECKED');
const fetchPath = createAction<string>('FETCH_PATH');
const fetchPathComplete = createAction<GetChildrenResponse>('FETCH_PATH_COMPLETE');
const setKeyword = createAction<string>('SET_KEYWORD');

// function useReducerMiddleware(reducer, initialArg, init, middleware) {
//   const [state, _dispatch] = useReducer(reducer, initialArg, init);
//   return [
//     state,
//     useCallback(
//       (action) => {
//         _dispatch(action);
//         middleware(action, _dispatch);
//       },
//       [middleware]
//     )
//   ];
// }

// PathNavigator
export default function(props: WidgetProps) {
  const { title, icon, path } = props;
  const [state, _dispatch] = useReducer(reducer, props, init);

  const classes = useStyles({});
  const site = useActiveSiteId();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const exec = useCallback(
    (action) => {
      _dispatch(action);
      const { type, payload } = action;
      switch (type) {
        case fetchPath.type:
        case setCurrentPath.type:
          getChildrenByPath(site, fetchPath.type === type ? state.currentPath : payload).subscribe(
            (response) => exec(fetchPathComplete(response)),
            (response) => dispatch(showErrorDialog({ error: response }))
          );
          break;
      }
    },
    [dispatch, site, state]
  );

  const [collapsed, setCollapsed] = useState(false);
  const [menuState, setMenuState] = useSpreadState<MenuState>({
    selectMode: false,
    hasClipboard: false
  });
  const [menu, setMenu] = useSpreadState({
    sections: [],
    anchorEl: null,
    activeItem: null
  });
  const [copyDialog, setCopyDialog] = useState(null);
  const [translationDialog, setTranslationDialog] = useState(null);

  useOnMount(() => {
    exec(fetchPath(path));
  });

  const itemsResource: Resource<SandboxItem[]> = useStateResource(state.itemsInPath, {
    shouldResolve: (items) => Boolean(items),
    shouldRenew: (items, resource) => resource.complete,
    shouldReject: () => false,
    resultSelector: (items) => items.map((path) => state.items[path]),
    errorSelector: null
  });

  const onPathSelected = (item: SandboxItem) => exec(setCurrentPath(item.path));

  const onPageChanged = (page: number) => void 0;

  const onSelectItem = (item: SandboxItem, checked: boolean) =>
    exec(checked ? itemChecked(item) : itemUnchecked(item));

  const onMenuItemClicked = (section: SectionItem) => {
    switch (section.id) {
      case 'select': {
        setMenuState({ selectMode: true });
        setMenu({
          activeItem: null,
          anchorEl: null
        });
        break;
      }
      case 'terminateSelection': {
        setMenuState({ selectMode: false });
        exec(clearChecked());
        setMenu({
          activeItem: null,
          anchorEl: null
        });
        break;
      }
      case 'copy': {
        getPages(site, menu.activeItem).subscribe(
          (legacyItem: LegacyItem) => {
            if (legacyItem.children.length) {
              setMenu({
                activeItem: null,
                anchorEl: null
              });
              setCopyDialog(legacyItem);
            } else {
              copyItem(site, menu.activeItem).subscribe(
                (response) => {
                  if (response.success) {
                    setMenu({
                      activeItem: null,
                      anchorEl: null
                    });
                    setMenuState({ hasClipboard: true });
                  }
                },
                (response) => {
                  dispatch(
                    showErrorDialog({
                      error: response
                    })
                  );
                }
              );
            }
          },
          (response) => {
            dispatch(
              showErrorDialog({
                error: response
              })
            );
          }
        );
        break;
      }
      case 'paste': {
        pasteItem(site, menu.activeItem).subscribe(
          () => {
            setMenu({
              activeItem: null,
              anchorEl: null
            });
            setMenuState({ hasClipboard: false });
          },
          (response) => {
            dispatch(
              showErrorDialog({
                error: response
              })
            );
          }
        );
        break;
      }
      case 'duplicate': {
        break;
      }
      case 'cut': {
        cutItem(site, menu.activeItem).subscribe(
          (response) => {
            if (response.success) {
              setMenu({
                activeItem: null,
                anchorEl: null
              });
              setMenuState({ hasClipboard: true });
            }
          },
          (response) => {
            dispatch(
              showErrorDialog({
                error: response
              })
            );
          }
        );
        break;
      }
      case 'translation': {
        getTargetLocales(site, menu.activeItem.path).subscribe(
          (response) => {
            setTranslationDialog(response.items);
          },
          (response) => {
            dispatch(
              showErrorDialog({
                error: response
              })
            );
          }
        );
        setMenu({
          activeItem: null,
          anchorEl: null
        });
        break;
      }
      case 'history': {
        dispatch(showHistoryDialog({ path: menu.activeItem.path }));
        setMenu({
          activeItem: null,
          anchorEl: null
        });
        break;
      }
      default: {
        if (section.id.includes('locale')) {
          setMenu({
            ...menu,
            anchorEl: null
          });
          exec(setLocaleCode(section.id.split('.')[1]));
        }
        break;
      }
    }
  };

  const onCurrentParentMenu = (element: Element) => {
    const count = state.selectedItems.length;
    setMenu({
      sections: generateMenuSections(null, menuState, count),
      anchorEl: element,
      activeItem: state.currentPath
    });
  };

  const onOpenItemMenu = (element: Element, item: SandboxItem) =>
    setMenu({
      sections: generateMenuSections(item, menuState),
      anchorEl: element,
      activeItem: item
    });

  const onHeaderButtonClick = (anchorEl: Element, type: string) => {
    if (type === 'language') {
      setMenu({
        sections: [
          [
            {
              id: 'locale.en',
              label: { id: 'locale.en', defaultMessage: 'English, US (en)' }
            },
            {
              id: 'locale.es',
              label: { id: 'locale.es', defaultMessage: 'Spanish, Spain (es)' }
            }
          ]
        ],
        anchorEl,
        activeItem: null
      });
    } else {
      setMenu({
        sections: [
          [
            {
              id: 'option1',
              label: { id: 'option1', defaultMessage: 'Option 1' }
            }
          ]
        ],
        anchorEl,
        activeItem: null
      });
    }
  };

  const onCloseCustomMenu = () => setMenu({ ...menu, anchorEl: null, activeItem: null });

  const onCopyDialogClose = () => setCopyDialog(null);

  const onCopyDialogOk = (item: Partial<LegacyItem>) => {
    setCopyDialog(null);
    copyItem(site, item).subscribe(
      (response) => {
        if (response.success) {
          setMenu({
            activeItem: null,
            anchorEl: null
          });
          setMenuState({ hasClipboard: true });
        }
      },
      (response) => {
        dispatch(
          showErrorDialog({
            error: response
          })
        );
      }
    );
  };

  const onTranslationDialogClose = () => setTranslationDialog(null);

  const onItemClicked = (item: SandboxItem) => {
    window.location.href = `/studio/preview#/?page=${item.previewUrl}&site=${site}`;
  };

  const onBreadcrumbSelected = (item: SandboxItem) => {
    if (withoutIndex(item.path) === withoutIndex(state.currentPath)) {
      onItemClicked(item);
    } else {
      exec(setCurrentPath(item.path));
    }
  };

  return (
    <section className={clsx(classes.root, props.classes?.root, collapsed && 'collapsed')}>
      <Header
        icon={icon}
        title={title}
        locale={state.localeCode}
        onClick={() => setCollapsed(!collapsed)}
        onContextMenu={(anchor) => onHeaderButtonClick(anchor, 'options')}
        onLanguageMenu={(anchor) => onHeaderButtonClick(anchor, 'language')}
      />
      <div {...collapsed ? { hidden: true } : {}}>
        <SuspenseWithEmptyState
          resource={itemsResource}
          loadingStateProps={{
            graphicProps: { className: classes.stateGraphics }
          }}
          errorBoundaryProps={{
            errorStateProps: { classes: { graphic: classes.stateGraphics } }
          }}
          withEmptyStateProps={{
            emptyStateProps: {
              title: 'No items at this location',
              classes: { image: classes.stateGraphics }
            }
          }}
        >
          <Breadcrumbs
            keyword={state.keyword}
            breadcrumb={state.breadcrumb}
            onMenu={onCurrentParentMenu}
            onSearch={(q) => exec(setKeyword(q))}
            onCrumbSelected={onBreadcrumbSelected}
          />
          <Nav
            leafs={state.leafs}
            locale={state.localeCode}
            resource={itemsResource}
            isSelectMode={menuState.selectMode}
            onSelectItem={onSelectItem}
            onPathSelected={onPathSelected}
            onOpenItemMenu={onOpenItemMenu}
            onItemClicked={onItemClicked}
          />
          <TablePagination
            className={classes.pagination}
            classes={{
              root: classes.pagination,
              selectRoot: 'hidden',
              toolbar: clsx(classes.paginationToolbar, classes.widgetSection)
            }}
            component="div"
            labelRowsPerPage=""
            count={state.count}
            rowsPerPage={state.limit}
            page={Math.ceil(state.offset / state.limit)}
            backIconButtonProps={{ 'aria-label': formatMessage(translations.previousPage) }}
            nextIconButtonProps={{ 'aria-label': formatMessage(translations.nextPage) }}
            onChangePage={(e, page: number) => onPageChanged(page)}
          />
        </SuspenseWithEmptyState>
      </div>
      <ContextMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        classes={{
          paper: classes.menuPaper,
          helperText: classes.helperText,
          itemRoot: classes.menuItemRoot,
          menuList: classes.menuList
        }}
        onClose={onCloseCustomMenu}
        sections={menu.sections}
        onMenuItemClicked={onMenuItemClicked}
      />
      {copyDialog && (
        <CopyItemsDialog
          title={formatMessage(translations.copyDialogTitle)}
          subtitle={formatMessage(translations.copyDialogSubtitle)}
          onClose={onCopyDialogClose}
          open={true}
          onOk={onCopyDialogOk}
          item={copyDialog}
        />
      )}
      {translationDialog && (
        <ContentLocalizationDialog
          locales={translationDialog}
          open={true}
          onClose={onTranslationDialogClose}
          site={site}
        />
      )}
    </section>
  );
}

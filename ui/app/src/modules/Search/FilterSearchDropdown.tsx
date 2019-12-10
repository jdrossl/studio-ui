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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from "@material-ui/core/Button";
import React, { useEffect, useRef, useState } from "react";
import Popover from '@material-ui/core/Popover';
import { defineMessages, useIntl } from "react-intl";
import { Theme } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/KeyboardArrowDown';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import { camelize, formatBytes } from '../../utils/string';
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormGroup from "@material-ui/core/FormGroup";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import { Facet, Filter as FilterType, QueryParams } from '../../models/Search';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    borderRadius: '0',
    marginRight: '50px',
    minWidth: '300px'
  },
  header: {
    width: '100%',
    padding: '10px 10px 10px 22px',
    borderTop: '1px solid #dedede',
    //borderBottom: '1px solid #dedede',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&.open': {
      borderBottom: '1px solid #dedede',
    }
  },
  body: {
    padding: '10px'
  },
  filterChecked: {
    marginLeft: '10px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  listPadding: {
    padding: '0'
  },
  Select: {
    width: '100%',
    '&.last': {
      marginTop: '10px'
    }
  },
  singleFilter: {
    '& .filterActions': {
      textAlign: 'right'
    }
  },
  button: {
    margin: theme.spacing(1),
  },
  checkboxLabel: {
    width: '100%',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  checkboxRoot: {
    marginRight: '5px'
  },
  rangePicker: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px'
  },
  space: {
    margin: '0 5px'
  },
  rangeTextField: {
    width: '60px',
    margin: '0',
    flexGrow: 1
  },
  rangeButton: {
    marginLeft: '10px'
  }
}));

const messages: any = defineMessages({
  sortBy: {
    id: 'searchFilter.sortBy',
    defaultMessage: 'Sort By'
  },
  revelance: {
    id: 'searchFilter.revelance',
    defaultMessage: 'Revelance'
  },
  internalName: {
    id: 'searchFilter.internalName',
    defaultMessage: 'Name'
  },
  width: {
    id: 'searchFilter.width',
    defaultMessage: 'Width'
  },
  contentType: {
    id: 'searchFilter.contentType',
    defaultMessage: 'Content Type'
  },
  mimeType: {
    id: 'searchFilter.mimeType',
    defaultMessage: 'MIME Type'
  },
  size: {
    id: 'searchFilter.size',
    defaultMessage: 'Content Size'
  },
  lastEditDate: {
    id: 'searchFilter.lastEditDate',
    defaultMessage: 'Last Edit Date'
  },
  height: {
    id: 'searchFilter.height',
    defaultMessage: 'Height'
  },
  asc: {
    id: 'searchFilter.asc',
    defaultMessage: 'Ascending'
  },
  desc: {
    id: 'searchFilter.desc',
    defaultMessage: 'Descending'
  },
  apply: {
    id: 'searchFilter.apply',
    defaultMessage: 'Apply'
  },
  clean: {
    id: 'searchFilter.clean',
    defaultMessage: 'Clean'
  },
  go: {
    id: 'searchFilter.go',
    defaultMessage: 'Go'
  },
  under: {
    id: 'searchFilter.under',
    defaultMessage: 'Under'
  },
  above: {
    id: 'searchFilter.above',
    defaultMessage: 'Above'
  },
  min: {
    id: 'searchFilter.min',
    defaultMessage: 'Min'
  },
  max: {
    id: 'searchFilter.max',
    defaultMessage: 'Max'
  },
});

interface FilterSearchDropdownProps {
  text: string;
  className: any;
  facets: [Facet];

  handleFilterChange(filter: FilterType, isFilter: boolean): any;

  queryParams: QueryParams;
}

function Filter(props: any) {
  const classes = useStyles({});
  const {formatMessage} = useIntl();
  const {facet, handleFilterChange, queryParams, facetsLookupTable, checkedFilters, setCheckedFilters} = props;

  const handleCheckboxClick = (key: string, checked: boolean, facet: string) => {
    const facetFilter = checkedFilters[facet] || {};
    facetFilter[key] = checked;
    setCheckedFilters({...checkedFilters, [facet]: facetFilter});
  };

  const handleRadioClick = (value: string, facet: string) => {
    if (value === '') {
      value = undefined;
    }
    handleFilterChange({name: facet, value: value}, true)
  };

  const handleApplyClick = (facet: string) => {
    if (checkedFilters[facet]) {
      let values = Object.keys(checkedFilters[facet]).filter((name) => checkedFilters[facet][name]);
      if (values.length === 0) {
        values = undefined;
      }
      handleFilterChange({name: facet, value: values}, true)
    }
  };

  const handleClearClick = (facet: string) => {
    if (checkedFilters[facet]) {
      if (typeof checkedFilters[facet] === 'string') {
        setCheckedFilters({...checkedFilters, [facet]: ''});
      } else {
        let emptyFilter = {...checkedFilters[facet]};
        Object.keys(emptyFilter).forEach((name) => {
          emptyFilter[name] = false;
        });
        setCheckedFilters({...checkedFilters, [facet]: emptyFilter});
      }
    }
    handleFilterChange({name: facet, value: undefined}, true)
  };

  return (
    <div className={classes.singleFilter}>
      <div className={'filterActions'}>
        <Button variant="outlined"
                className={classes.button}
                onClick={() => handleClearClick(facet)}
        >
          {formatMessage(messages.clean)}
        </Button>
        {
          facetsLookupTable[facet].multiple &&
          <Button
            variant="contained"
            color='primary'
            className={classes.button}
            onClick={() => handleApplyClick(facet)}
          >
            {formatMessage(messages.apply)}
          </Button>
        }
      </div>
      <div className={'filterBody'}>
        {
          (facetsLookupTable[facet].multiple) ? (
            <FilterCheckboxes
              facetData={facetsLookupTable[facet]}
              facet={facet}
              handleCheckboxClick={handleCheckboxClick}
              checkedFilters={checkedFilters}
            />
          ) : (
            <>
              <FilterRadios
                facetData={facetsLookupTable[facet]}
                facet={facet}
                handleRadioClick={handleRadioClick}
                checkedFilters={checkedFilters}
              />
              {
                (facetsLookupTable[facet].range && !facetsLookupTable[facet].date) &&
                <RangeSelector
                  facet={facet}
                  handleFilterChange={handleFilterChange}
                  checkedFilters={checkedFilters}
                  queryParams={queryParams}
                />
              }
            </>
          )
        }
      </div>
    </div>
  )
}

function FilterRadios(props: any) {
  const {facetData, facet, handleRadioClick, checkedFilters} = props;
  const items = facetData.values;
  const classes = useStyles({});
  const {formatMessage} = useIntl();

  const formatValue = (facet: string, key: string, value: any) => {
    if (facetData.date) {
      return `${value.from}TODATE${value.to}ID${facet}${key}`;
    } else if (facetData.range) {
      return `${(value.from !== '-Infinity') ? value.from : ''}TO${(value.to !== 'Infinity') ? value.to : ''}`;
    } else {
      return key;
    }
  };

  const formatLabel = (facet: string, key: string, value: any) => {
    if (facet === 'size') {
      if (value.from === '-Infinity') {
        return `${formatMessage(messages.under)} ${formatBytes(value.to)}`
      } else if (value.to === 'Infinity') {
        return `${formatMessage(messages.above)} ${formatBytes(value.from)}`
      } else {
        return `${formatBytes(value.from)} - ${formatBytes(value.to)}`
      }
    } else if (facet === 'width' || facet === 'height') {
      if (value.from === '-Infinity') {
        return `${formatMessage(messages.under)} ${value.to}px`
      } else if (value.to === 'Infinity') {
        return `${formatMessage(messages.above)} ${value.from}px`
      } else {
        return `${value.from}px - ${value.to}px`
      }
    }
    return key;
  };

  return (
    <RadioGroup>
      {
        Object.keys(items).map((key) => {
          let count = (items[key].count != undefined) ? items[key].count : items[key];
          let label = formatLabel(facet, key, items[key]);
          let value = formatValue(facet, key, items[key]);
          return (
            <FormControlLabel
              key={key}
              name={key}
              onChange={(e: any) => handleRadioClick(e.target.value, facet)}
              control={
                <Radio
                  checked={(checkedFilters && checkedFilters[facet] === value)}
                  color="primary"
                  value={value}
                />
              }
              label={`${label} (${count})`}
              labelPlacement="start"
              classes={{root: classes.checkboxRoot, label: classes.checkboxLabel}}
            />
          )
        })
      }
    </RadioGroup>
  )
}

function FilterCheckboxes(props: any) {
  const {facetData, facet, handleCheckboxClick, checkedFilters} = props;
  const items = facetData.values;
  const classes = useStyles({});

  return (
    <FormGroup>
      {
        Object.keys(items).map((key) => {
          return (
            <FormControlLabel
              key={key}
              name={key}
              control={
                <Checkbox
                  color="primary"

                  checked={(checkedFilters && checkedFilters[facet] && checkedFilters[facet][key]) || false}

                  value={key}
                  onChange={(e) => handleCheckboxClick(key, e.target.checked, facet)}
                />
              }
              label={`${key} (${items[key]})`}
              labelPlacement="start"
              classes={{root: classes.checkboxRoot, label: classes.checkboxLabel}}
            />
          )
        })
      }
    </FormGroup>
  )
}

function RangeSelector(props: any) {
  const classes = useStyles({});
  const {formatMessage} = useIntl();
  const {facet, handleFilterChange, checkedFilters} = props;

  const getMinMax = () => {
    if (checkedFilters && checkedFilters[facet]) {
      let range = checkedFilters[facet].split('TO');
      return {
        min: range[0],
        max: range[1]
      }
    } else {
      return {
        min: '',
        max: ''
      };
    }
  };

  const [range, setRange] = useState({
    min: '',
    max: ''
  });

  useEffect(function () {
    setRange(getMinMax());
  }, [checkedFilters]);

  const handleRangeSelector = (facet: string) => {
    let value = `${range.min}TO${range.max}`;
    if (range.min === '' && range.max === '') {
      value = undefined;
    }
    handleFilterChange({name: facet, value: value}, true)
  };

  const handleOnChange = (value: string, type: string) => {
    setRange({...range, [type]: value});
  };

  return (
    <div className={classes.rangePicker}>
      <TextField
        id={`${facet}min`}
        name={`${facet}min`}
        value={range.min}
        onChange={(e) => handleOnChange(e.target.value, 'min')}
        placeholder={formatMessage(messages.min)}
        margin="normal"
        className={classes.rangeTextField}
      />
      <span className={classes.space}>-</span>
      <TextField
        id={`${facet}max`}
        name={`${facet}max`}
        value={range.max}
        onChange={(e) => handleOnChange(e.target.value, 'max')}
        placeholder={formatMessage(messages.max)}
        margin="normal"
        className={classes.rangeTextField}
      />
      <Button
        variant="contained"
        color='primary'
        className={classes.rangeButton}
        onClick={() => handleRangeSelector(facet)}
      >
        {formatMessage(messages.go)}
      </Button>
    </div>
  )
}

function SortBy(props: any) {
  const classes = useStyles({});
  const {formatMessage} = useIntl();
  const {queryParams, handleFilterChange, filterKeys} = props;
  return (
    <Select
      id="sortBy"
      value={queryParams['sortBy'] || "_score"}
      className={classes.Select}
      onChange={(event) => handleFilterChange({name: 'sortBy', value: event.target.value})}
    >
      <MenuItem value='_score'>{formatMessage(messages.revelance)}</MenuItem>
      <MenuItem value='internalName'>{formatMessage(messages.internalName)}</MenuItem>
      {
        filterKeys.map((name: string, i: number) => {
          return <MenuItem value={name} key={i}>{formatMessage(messages[camelize(name)])}</MenuItem>
        })
      }
    </Select>
  )
}

function SortOrder(props: any) {
  const classes = useStyles({});
  const {formatMessage} = useIntl();
  const {queryParams, handleFilterChange} = props;
  return (
    <Select
      id="sortOrder"
      value={queryParams['sortOrder'] || "asc"}
      className={clsx(classes.Select, 'last')}
      onChange={(event) => handleFilterChange({name: 'sortOrder', value: event.target.value})}
    >
      <MenuItem value="asc">{formatMessage(messages.asc)}</MenuItem>
      <MenuItem value="desc">{formatMessage(messages.desc)}</MenuItem>
    </Select>
  )
}

export default function FilterSearchDropdown(props: FilterSearchDropdownProps) {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {text, className, facets, handleFilterChange, queryParams} = props;
  const {formatMessage} = useIntl();
  const [expanded, setExpanded] = useState({
    sortBy: false
  });
  const [checkedFilters, setCheckedFilters] = React.useState({});

  useEffect(function () {
    setCheckedFilters(setCheckedParameterFromURL(queryParams));
  }, [queryParams]);

  const setCheckedParameterFromURL = (queryParams: QueryParams) => {
    if (queryParams['filters']) {
      let checked: any = {};
      let parseQP = JSON.parse(queryParams['filters']);
      Object.keys(parseQP).forEach((facet) => {
        if (Array.isArray(parseQP[facet])) {
          checked[facet] = {};
          parseQP[facet].forEach((name: string) => {
            checked[facet][name] = true;
          });
        } else {
          checked[facet] = parseQP[facet];
        }
      });
      return checked;
    } else {
      return {};
    }
  };

  const popoverAction = useRef(null);
  const popover = useRef(null);

  let filterKeys: any[] = [];
  let facetsLookupTable: any = {};

  facets.forEach((facet) => {
    filterKeys.push(facet.name);
    facetsLookupTable[facet.name] = facet;
  });

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = (item: string) => {
    setExpanded({...expanded, [item]: !expanded[item]})
  };

  const renderFilters = () => {
    return (
      filterKeys.map((key: string, i: number) => {
        let name = camelize(key);
        return (
          <div key={i}>
            <ListItem button classes={{root: classes.listPadding}} onClick={() => handleExpandClick(name)}>
              <header className={clsx(classes.header, !!(expanded && expanded[name]) && 'open')}>
                <Typography variant="body1">
                  <strong>{formatMessage(messages[name])}</strong>
                </Typography>
                {
                  checkedFilters[key] &&
                  <CheckIcon className={classes.filterChecked}/>
                }
                <ExpandMoreIcon
                  className={clsx(classes.expand, !!(expanded && expanded[name]) && classes.expandOpen)}/>
              </header>
            </ListItem>
            <Collapse in={!!(expanded && expanded[name])} timeout={300} onEntered={refreshPopover}>
              <div className={classes.body}>
                <Filter
                  facet={key}
                  handleFilterChange={handleFilterChange}
                  checkedFilters={checkedFilters}
                  setCheckedFilters={setCheckedFilters}
                  facetsLookupTable={facetsLookupTable}
                />
              </div>
            </Collapse>
          </div>
        )
      })
    )
  };

  const refreshPopover = () => {
    if (popover.current.offsetHeight < popover.current.scrollHeight) {
      popoverAction.current.updatePosition();
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClick} className={className}>
        {text} <ArrowDropDownIcon/>
      </Button>
      <Popover
        id="simple-menu"
        action={popoverAction}
        ref={popover}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        classes={{paper: classes.paper}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List classes={{padding: classes.listPadding}}>
          <div>
            <ListItem button classes={{root: classes.listPadding}} onClick={() => handleExpandClick('sortBy')}>
              <header className={classes.header}>
                <Typography variant="body1">
                  <strong>{formatMessage(messages.sortBy)}</strong>
                </Typography>
                <ExpandMoreIcon
                  className={clsx(classes.expand, (expanded && expanded['sortBy']) && classes.expandOpen)}/>
              </header>
            </ListItem>
            <Collapse in={(expanded && expanded['sortBy'])} timeout={300} onEntered={refreshPopover}>
              <div className={classes.body}>
                <SortBy queryParams={queryParams} filterKeys={filterKeys} handleFilterChange={handleFilterChange}/>
                <SortOrder queryParams={queryParams} handleFilterChange={handleFilterChange}/>
              </div>
            </Collapse>
          </div>
          {renderFilters()}
        </List>
      </Popover>
    </div>
  )
}

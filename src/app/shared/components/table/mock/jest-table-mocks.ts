import {
    DEFAULT_TABLE_OPTIONS,
    TableColumn,
    TableOptions,
    TableRowAction,
    TablePagination,
    FilterOption
  } from '../models';
  
  const DEFAULT_OPTIONS: TableOptions = Object.assign({}, DEFAULT_TABLE_OPTIONS);
  
  export const COLUMNS: TableColumn[] = [
    {
      key: 'position',
      displayName: 'No.'
    },
    {
      key: 'name',
      displayName: 'Name',
      filterable: true
    },
    {
      key: 'weight',
      displayName: 'Weight',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      displayName: 'Sample Status',
      sortable: true,
      filterable: true,
      showFilterOptions: true
    },
    {
      key: 'symbol',
      displayName: 'Symbol'
    },
    {
      key: 'actions',
      displayName: 'Actions'
    }
  ];
  
  export const PAGINATION: TablePagination = {
    sticky: true,
    pageSizeOptions: [5, 10, 15]
  };
  
  export const ROW_ACTIONS: TableRowAction[] = [
    {
      id: 'download-row-action',
      name: 'DOWNLOAD',
      buttonType: 'icon',
      icon: 'download',
      tooltip: {
        label: 'Download'
      }
    },
    {
      id: 'edit-row-action',
      name: 'EDIT',
      buttonType: 'icon',
      icon: 'edit'
    },
    {
      id: 'more-row-action',
      name: 'MORE ACTIONS',
      buttonType: 'primary'
    }
  ];
  
  export const TABLE_OPTIONS: TableOptions = {
    columns: COLUMNS,
    rowActions: ROW_ACTIONS,
    pagination: PAGINATION,
    stickyHeaders: true
  };
  
  export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    status: string;
  }
  
  export const TABLE_DATA: PeriodicElement[] = [
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      status: 'Open'
    },
    {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      status: 'Open'
    },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      status: 'Rejected'
    },
    {
      position: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
      status: 'Open'
    },
    {
      position: 5,
      name: 'Boron',
      weight: 10.811,
      symbol: 'B',
      status: 'Reported'
    },
    {
      position: 6,
      name: 'Carbon',
      weight: 12.0107,
      symbol: 'C',
      status: 'Reported'
    },
    {
      position: 7,
      name: 'Nitrogen',
      weight: 14.0067,
      symbol: 'N',
      status: 'Open'
    },
    {
      position: 8,
      name: 'Oxygen',
      weight: 15.9994,
      symbol: 'O',
      status: 'Under Review'
    },
    {
      position: 9,
      name: 'Fluorine',
      weight: 18.9984,
      symbol: 'F',
      status: 'Rejected'
    },
    {
      position: 10,
      name: 'Neon',
      weight: 20.1797,
      symbol: 'Ne',
      status: 'Open'
    },
    {
      position: 11,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Open'
    },
    {
      position: 12,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Open'
    },
    {
      position: 13,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Rejected'
    },
    {
      position: 14,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Open'
    },
    {
      position: 15,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Reported'
    },
    {
      position: 16,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Reported'
    },
    {
      position: 17,
      name: '',
      weight: 0,
      symbol: '',
      status: ''
    },
    {
      position: 18,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Under Review'
    },
    {
      position: 19,
      name: '',
      weight: 0,
      symbol: '',
      status: 'Rejected'
    },
    {
      position: 20,
      name: '',
      weight: 0,
      symbol: '',
      status: ''
    }
  ];
  
  export const mockFilterOptions: FilterOption[] = [
    { name: 'open', value: 'Open', checked: false },
    { name: 'rejected', value: 'Rejected', checked: false },
    { name: 'reported', value: 'Reported', checked: false },
    { name: 'under review', value: 'Under Review', checked: false },
    { name: '', value: '', checked: false }
  ];
  
  export const mockTable = () => {
    return {
      defaultOptions: DEFAULT_OPTIONS,
      columns: COLUMNS,
      rowActions: ROW_ACTIONS,
      options: TABLE_OPTIONS,
      data: TABLE_DATA,
      filterOptions: mockFilterOptions
    };
  };
  
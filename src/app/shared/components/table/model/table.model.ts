// Material
import { MatCheckboxChange } from '@angular/material/checkbox';

// Shared

export interface FilterOption {
  name?: string;
  value: string | number;
  checked?: boolean;
}

export interface TableColumn {
  key: string;
  displayName?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterValue?: string;
  filterOptions?: FilterOption[];
  showFilterOptions?: boolean;
  menuOpened?: boolean;
  hasCellTemplate?: boolean;
  hasEditableCells?: boolean;
  cellValueType?: string;
  cellTemplateClassName?: string;
}

export interface TableRowAction {
  id: string;
  name: string;
  buttonType: 'icon' | any; // this is simply because I haven't defined icon as a legit ButtonType yet
  icon?: string;
  tooltip?: {
    label: string;
    position?: string;
  };
}

export interface SelectedTableRowActionEvent {
  index: number;
  data: any[];
  rowAction: TableRowAction;
}

export interface SelectedTableRowEvent {
  changeEvent: MatCheckboxChange;
  allSelectedRows?: any[];
}

export interface TablePagination {
  sticky?: boolean;
  pageSizeOptions: number[];
}

export type RowHeightStyle = 'normal' | 'condensed' | 'highly-condensed';

export interface TableOptions {
  columns: TableColumn[];
  rowActions?: TableRowAction[];
  pagination?: TablePagination;
  elevatedTable?: boolean;
  stickyHeaders?: boolean;
  flexColumns?: boolean;
  rowHeightStyle?: RowHeightStyle;
  zebraStripedTable?: boolean;
  hasMasterDetailRows?: boolean;
}

export const DEFAULT_TABLE_OPTIONS: TableOptions = {
  columns: [],
  pagination: {
    sticky: true,
    pageSizeOptions: [10, 50, 100]
  },
  elevatedTable: true,
  flexColumns: true,
  rowHeightStyle: 'normal'
};

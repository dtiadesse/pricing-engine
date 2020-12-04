import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import * as _ from "lodash";

// Material
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatCheckboxChange } from "@angular/material/checkbox";

// Shared
import { expansionHeight } from "../../../../multifamily/shared/components/animate-animation";

// Models
import {
  DEFAULT_TABLE_OPTIONS,
  FilterOption,
  SelectedTableRowActionEvent,
  SelectedTableRowEvent,
  TableColumn,
  TableOptions,
  TableRowAction,
} from "../model/table.model";

@Component({
  selector: "mf-pe-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  animations: [expansionHeight],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() id: string;

  dataSource: MatTableDataSource<any>;
  private _tableData: any[] = [];
  @Input()
  set tableData(data: any[]) {
    this._tableData = data;
    this.dataSource = new MatTableDataSource(this._tableData);
  }
  get tableData(): any[] {
    return this._tableData;
  }

  // Expand All rows
  @Input() expandAllRows = false;

  // Custom Cells
  @ContentChild("cellTemplate", { static: false })
  cellTemplateRef: TemplateRef<any>;

  // Expanded Rows
  @ContentChild("masterDetailTemplate", { static: false })
  masterDetailTemplateRef: TemplateRef<any>;
  expandedRow: any | null;

  private _tableOptions: TableOptions = _.clone(DEFAULT_TABLE_OPTIONS);
  @Input()
  set tableOptions(options: TableOptions) {
    this._tableOptions = options;
  }
  get tableOptions(): TableOptions {
    return this._tableOptions;
  }

  // Columns
  private _columnsToDisplay: string[] = [];
  displayedColumns: string[] = [];

  // Actions
  @Output()
  tableRowAction: EventEmitter<SelectedTableRowActionEvent> = new EventEmitter<SelectedTableRowActionEvent>();

  // Sort
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // Filter
  currentColFilter = "";

  // Selection
  selection: SelectionModel<any>;
  @Input() disabledRowIndices: number[] = [];

  private _allowRowSelection = false;
  @Input()
  set allowRowSelection(toggle: boolean) {
    this._allowRowSelection = toggle;

    // reset the selectionModel
    this.selection = new SelectionModel<any>(this._allowRowSelection, []);
    _.forEach(this.disabledRowIndices, (value: number) => {
      this.selection.select(this.dataSource.data[value]);
    });

    // add the 'select' column, if enabled
    if (this._allowRowSelection) {
      this._columnsToDisplay.unshift("select");
      this.displayedColumns = this._columnsToDisplay.slice();
    }
  }
  get allowRowSelection(): boolean {
    return this._allowRowSelection;
  }

  private _defaultSelected: any[] = [];
  @Input()
  set defaultSelected(selected: any[]) {
    this._defaultSelected = _.map(selected);

    if (this.allowRowSelection && this.selection) {
      // if enabled, programmatically select the specified rows
      _.forEach(selected, (row: any, index: number) => {
        if (!this.isSelectionDisabled(index)) this.selection.select(row);
      });
    }
  }
  get defaultSelected(): any[] {
    return this._defaultSelected;
  }

  @Output()
  rowSelectionChange: EventEmitter<SelectedTableRowEvent> = new EventEmitter<SelectedTableRowEvent>();

  // Paginator
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // ------------------------------ Init ------------------------------

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);

    // init columns
    this.updateColumns();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // need to add MatSort and MatPaginator when using MatTableDataSource
    this.dataSource.sort = this.sort;

    // overriding default table filter function
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      let matched = false;

      // allow bulk column filtering with semi-colon, delimited string; takes care of every case
      // compact() removes any falsey values (i.e. - '')
      const bulkColFilterValues = _.compact(filter.split(";"));

      const val = data[this.currentColFilter];
      const formattedVal = val.toString().trim().toLowerCase();

      matched = bulkColFilterValues.some((v) => formattedVal.includes(v));

      return !filter || matched;
    };
  }

  // ------------------------------ Handle Columns ------------------------------

  // Update all references to columns
  updateColumns() {
    const updColumns: string[] = this.allowRowSelection ? ["select"] : [];

    _.forEach(this.tableOptions.columns, (column: TableColumn) => {
      updColumns.push(column.key);

      if (column.showFilterOptions) {
        column.filterOptions = this.getFilterOptions(column.key);
      }
    });

    // update the original and the public column references
    this._columnsToDisplay = _.map(updColumns);
    this.displayedColumns = this._columnsToDisplay.slice();
  }

  // This will handle toggling the display of an individual column
  toggleColumnDisplay(columnKey: string) {
    const found = this.displayedColumns.includes(columnKey);

    if (found) {
      // if the column is currently showing, hide it
      this.displayedColumns = this._columnsToDisplay.filter(
        (colKey: string) => colKey !== columnKey
      );
    } else {
      // otherwise, find and insert it at the original index
      const columnIndex: number = this._columnsToDisplay.findIndex(
        (colKey: string) => colKey === columnKey
      );
      this.displayedColumns.splice(columnIndex, 0, columnKey);
    }
  }

  // ------------------------------ Handle Sorting ------------------------------

  // Sort the data based on the specified column
  sortColumn(columnKey: string, sortOrder?: "asc" | "desc") {
    const matSort = this.dataSource.sort;
    const disableClear = false;

    matSort.sort({ id: null, start: sortOrder, disableClear: disableClear });
    matSort.sort({
      id: columnKey,
      start: sortOrder,
      disableClear: disableClear,
    });

    this.dataSource.sort = matSort;
  }

  // ------------------------------ Handle Filtering ------------------------------

  // Get all column filter options by default if showing
  getFilterOptions(columnKey: string) {
    const allColValues = _.map(this.dataSource.data, (row) => {
      const cellVal =
        !row[columnKey] && row[columnKey] !== 0 ? "" : row[columnKey];
      return cellVal;
    });

    const uniqueColValues = allColValues.filter(
      (val, i, arr) => arr.indexOf(val) === i
    );

    const filterOptions = _.map(uniqueColValues, (val) => {
      return {
        name:
          typeof val === "number" ? val.toString() : val.trim().toLowerCase(),
        value: val,
        checked: false,
      };
    });

    return filterOptions;
  }

  // Handle bulk column filter options
  onFilterOptionChange($event: MatCheckboxChange, columnKey: string) {
    const checked = $event.checked;
    const value = $event.source.value;

    const foundCol = this.tableOptions.columns.find(
      (column: TableColumn) => column.key === columnKey
    );

    const foundOption = foundCol.filterOptions.find(
      (option) => option.value === value
    );

    foundOption.checked = checked;
    this.applyColumnFilter(null, columnKey, foundCol.filterOptions);
  }

  // Filter the data based on the specified column
  applyColumnFilter(
    $event?,
    columnKey?: string,
    bulkColFilterValues: { value: string | number; checked?: boolean }[] = []
  ) {
    this.clearAllOtherColumnFilterValues(columnKey);

    this.currentColFilter = columnKey || "";
    let filterValue = "";

    // prepare the bulk filter values
    if (bulkColFilterValues.length > 0) {
      let updVals = _.map(bulkColFilterValues, (filterVal) => {
        if (filterVal.checked) {
          return filterVal.value.toString().trim().toLowerCase();
        }
      });
      updVals = updVals.filter((val) => val && val !== "");
      filterValue = _.join(updVals, ";");
    } else {
      // continue with filter input value
      const updVal = $event ? ($event.target as HTMLInputElement).value : "";
      filterValue = updVal.toString().trim().toLowerCase();
    }

    this.dataSource.filter = filterValue;
  }

  // Clear the filter input value and reset the data
  clearColumnFilter($event) {
    // change the input value to null
    $event.value = null;

    // reset the filtered data
    this.applyColumnFilter();
  }

  // Clear all other filters
  clearAllOtherColumnFilterValues(columnKey: string) {
    _.forEach(this.tableOptions.columns, (column: TableColumn) => {
      if (column.key !== columnKey) {
        column.filterValue = "";

        if (column.showFilterOptions) {
          _.forEach(column.filterOptions, (option: FilterOption) => {
            option.checked = false;
          });
        }
      }
    });
  }

  // ------------------------------ Handle Selection ------------------------------

  // Whether the number of selected elements matches the total number of rows
  isAllSelected(): boolean {
    const nothingToSelect: boolean =
      _.isEmpty(this.dataSource.data) ||
      _.isEmpty(this.dataSource.filteredData);
    const numOfSelected = this.selection.selected.length;
    const numOfRows = this.dataSource.filteredData.length;

    return !nothingToSelect && numOfSelected === numOfRows;
  }

  // This will select all rows if they are not already selected; otherwise it will clear all selections
  masterToggle($event: MatCheckboxChange) {
    if (this.isAllSelected()) {
      if (!_.isEmpty(this.disabledRowIndices)) {
        _.forEach(this.dataSource.filteredData, (row: any, index: number) => {
          // check to make sure we don't deselect any checked & disabled checkboxes
          if (!this.isSelectionDisabled(index)) this.selection.deselect(row);
        });
      } else {
        this.selection.clear();
      }
    } else {
      _.forEach(this.dataSource.filteredData, (row) =>
        this.selection.select(row)
      );
    }

    // This will emit the selection change event and all currently selected rows
    this.rowSelectionChange.emit({
      changeEvent: $event,
      allSelectedRows: this.selection.selected,
    });
  }

  // This will select an individual row if it is not already selected; otherwise it will clear the selection
  rowToggle($event: MatCheckboxChange, row: any) {
    this.selection.toggle(row);

    // This will emit the selection change event and all currently selected rows
    this.rowSelectionChange.emit({
      changeEvent: $event,
      allSelectedRows: this.selection.selected,
    });
  }

  // This checks whether the specified row index has been marked as disabled
  isSelectionDisabled(rowIndex: number): boolean {
    return this.disabledRowIndices.includes(rowIndex);
  }

  // ------------------------------ Handle Row Actions ------------------------------

  // Emit the action clicked and the corresponding data to the parent component for further use
  onTableRowAction(rowIndex, row, action: TableRowAction) {
    this.tableRowAction.emit({
      index: rowIndex,
      data: row,
      rowAction: action,
    });
  }

  // ------------------------------------------------------------

  // This should ensure that data isn't being checked too many times in the template
  identify(index: number, item: any): number {
    return index;
  }
}

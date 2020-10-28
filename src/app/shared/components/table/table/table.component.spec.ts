import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement, Component, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs'; // avoids logging 'console.warn: ...longpress...'

// Lodash
import * as _ from 'lodash';

// Material
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DirectivesModule } from '../../../directives/directives.module';

import { TableComponent } from './table.component';
import { mockTable } from '../mock/jest-table-mocks';
import { TableColumn, FilterOption } from '../models';

// Using this component as an override for MatIcon
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-icon',
  template: '<span></span>'
})
class MockMatIconComponent {
  @Input() svgIcon: any;
  @Input() fontSet: any;
  @Input() fontIcon: any;
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let debugElement: DebugElement;
  let hostElement: HTMLElement;

  let mocks;

  // Helper functions to avoid duplicating code
  let setup: (includeData?: boolean) => void;
  let filterHelper: (fieldType: string, empty?: boolean) => void;

  // override MatIcon to avoid errors with icons not registering/being found
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NoopAnimationsModule,
        MatCheckboxModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        DirectivesModule
      ],
      declarations: [TableComponent]
    })
      .overrideModule(MatIconModule, {
        remove: {
          declarations: [MatIcon],
          exports: [MatIcon]
        },
        add: {
          declarations: [MockMatIconComponent],
          exports: [MockMatIconComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    hostElement = fixture.nativeElement;

    fixture.detectChanges();

    mocks = mockTable();

    // avoid duplicating this code everywhere
    setup = (includeData: boolean = false) => {
      component.tableOptions = _.cloneDeep(mocks.options);

      if (includeData) {
        component.tableData = _.clone(mocks.data);
      }

      component.ngOnInit();
    };

    // avoid duplicating this code everywhere
    filterHelper = (fieldType: string, empty: boolean = false) => {
      // get the column header icon wrapper span and open the filter menu to provide access to cdk-overlay
      const statusColHdrIconWrppr = debugElement.nativeElement.querySelector(
        '.mat-column-status .column-header-icon-wrapper'
      );
      statusColHdrIconWrppr.click();
      fixture.detectChanges();

      if (fieldType === 'textfield') {
        // get the filter menu input and update the value
        const filterMenuInput: HTMLInputElement = hostElement.parentNode.querySelector(
          '#status-filter-menu-input'
        );

        filterMenuInput.focus();
        filterMenuInput.value = empty ? '' : '  HyD ';
        filterMenuInput.dispatchEvent(new Event('change'));
        fixture.detectChanges();
      } else if (fieldType === 'checkbox') {
        // get the filter menu option (but make sure to get the inner input element for mat-checkbox)
        const filterMenuOption: HTMLInputElement = hostElement.parentNode.querySelector(
          '#status-filter-option0-input'
        );
        filterMenuOption.click();
        fixture.detectChanges();
      }
    };
  });

  /**
   * This should be boilerplate.
   * This is necessary whenever you have multiple mocks of the same function/object that could be used and
   * manipulated throughout the test suite.
   */
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ------------------------------ Default Inputs ------------------------------

  it('id should default to: undefined', () => {
    expect(component.id).toBeUndefined();
  });

  it('tableOptions should default to: DEFAULT_TABLE_OPTIONS', () => {
    expect(component.tableOptions).toEqual(mocks.defaultOptions);
  });

  it('tableData should default to: []', () => {
    expect(component.tableData).toEqual([]);
  });

  // ------------------------------ Methods ------------------------------

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const updColSpy = jest.spyOn(component, 'updateColumns');

      component.ngOnInit();

      expect(updColSpy).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('paginator should be null if not found', () => {
      component.tableOptions.pagination = null;

      component.ngAfterViewInit();

      expect(component.dataSource.paginator).toBeNull();
    });
  });

  describe('updateColumns', () => {
    let cols;

    beforeEach(() => {
      setup();
      cols = mocks.options.columns;
    });

    it('should update columnsToDisplay', () => {
      const actual = _.map(cols, (o: TableColumn) => o.key);

      expect(component.columnsToDisplay).toEqual(actual);
    });

    it('should call getFilterOptions() for specified column', () => {
      const filterOpsSpy = jest.spyOn(component, 'getFilterOptions');

      component.updateColumns();

      expect(filterOpsSpy).toHaveBeenCalled();
    });

    it('should NOT call getFilterOptions() for specified column', () => {
      _.forEach(component.tableOptions.columns, (o: TableColumn) => {
        o.showFilterOptions = false;
      });

      const filterOpsSpy = jest.spyOn(component, 'getFilterOptions');

      component.updateColumns();

      expect(filterOpsSpy).not.toHaveBeenCalled();
    });
  });

  describe('sortColumn', () => {
    let matSortSpy;
    let dataSourceSortSpy;

    let actual;
    let sortObj;

    beforeEach(() => {
      setup();

      actual = component.dataSource.sort;
      sortObj = { id: 'status', start: '', disableClear: false };

      matSortSpy = jest.spyOn(component.dataSource.sort, 'sort');
      dataSourceSortSpy = jest.spyOn(component.dataSource, 'sort', 'get');
    });

    it('should apply column sorting in ascending order', () => {
      sortObj.start = 'asc';
      actual.sort(sortObj);

      component.sortColumn('status', 'asc');

      expect(matSortSpy).toHaveBeenCalled();
      expect(dataSourceSortSpy.mock.results[0].value).toEqual(actual);
    });

    it('should apply column sorting in descending order', () => {
      sortObj.start = 'desc';
      actual.sort(sortObj);

      component.sortColumn('status', 'desc');

      expect(dataSourceSortSpy.mock.results[0].value).toEqual(actual);
    });
  });

  describe('getFilterOptions', () => {
    it('should return an array of FilterOptions for the specified column', () => {
      setup(true);
      const actual = mocks.filterOptions;

      const statusFilterOptions = component.getFilterOptions('status');

      expect(statusFilterOptions).not.toBeUndefined();
      expect(statusFilterOptions).not.toBeNull();
      expect(statusFilterOptions.length).toBeGreaterThan(0);
      expect(statusFilterOptions).toEqual(actual);
    });
  });

  describe('onFilterOptionChange', () => {
    it('should make the call to applyColumnFilter()', () => {
      setup(true);
      fixture.detectChanges();

      const filterOptChngSpy = jest.spyOn(component, 'onFilterOptionChange');
      const applyColFltrSpy = jest.spyOn(component, 'applyColumnFilter');
      const actual: FilterOption[] = mocks.filterOptions;
      actual[0].checked = true;

      filterHelper('checkbox');

      expect(filterOptChngSpy).toHaveBeenCalled();
      expect(applyColFltrSpy).toHaveBeenCalled();

      // check the parameter values
      expect(filterOptChngSpy.mock.calls[0][0]).toBeInstanceOf(MatCheckboxChange);
      expect(filterOptChngSpy.mock.calls[0][1]).toMatch('status');
      expect(applyColFltrSpy.mock.calls[0][0]).toBeNull();
      expect(applyColFltrSpy.mock.calls[0][1]).toMatch('status');
      expect(applyColFltrSpy.mock.calls[0][2]).toEqual(actual);
    });
  });

  describe('applyColumnFilter', () => {
    beforeEach(() => {
      setup();
      fixture.detectChanges();
    });

    it('should format and apply the filter input (textfield) value for the specified column', () => {
      const applyColFilterSpy = jest.spyOn(component, 'applyColumnFilter');
      const clearOtherFiltersSpy = jest.spyOn(component, 'clearAllOtherColumnFilterValues');
      const actual = 'hyd';

      filterHelper('textfield');

      expect(applyColFilterSpy).toHaveBeenCalled();
      expect(applyColFilterSpy.mock.calls[0][0]).toBeInstanceOf(Event);
      expect(applyColFilterSpy.mock.calls[0][1]).toMatch('status');
      expect(applyColFilterSpy.mock.calls[0][2]).toBeUndefined();
      expect(clearOtherFiltersSpy).toHaveBeenCalled();
      expect(component.currentColFilter).toMatch('status');
      expect(component.dataSource.filter).toMatch(actual);
    });

    it('should format and apply the checked filter option (checkboxes) value for the specified column', () => {
      const statusFilterOps = mocks.filterOptions;
      statusFilterOps[0].checked = true;
      const actual = 'open';

      component.applyColumnFilter(null, 'status', statusFilterOps);

      expect(component.currentColFilter).toMatch('status');
      expect(component.dataSource.filter).toMatch(actual);
    });

    it('should format and apply the checked filter options (multiple checkboxes) values for the specified column', () => {
      const statusFilterOps = mocks.filterOptions;
      statusFilterOps[0].checked = true;
      statusFilterOps[1].checked = true;
      const actual = 'open;rejected';

      component.applyColumnFilter(null, 'status', statusFilterOps);

      expect(component.currentColFilter).toMatch('status');
      expect(component.dataSource.filter).toMatch(actual);
    });
  });

  describe('clearColumnFilter', () => {
    it('should make the call to reset the column filter', () => {
      const applyColFltrSpy = jest.spyOn(component, 'applyColumnFilter');
      const mockEvent = {
        value: 'open'
      };

      component.clearColumnFilter(mockEvent);

      expect(applyColFltrSpy).toHaveBeenCalled();
    });
  });

  describe('clearAllOtherColumnFilterValues', () => {
    let statusKey: string;
    beforeEach(() => {
      statusKey = 'status';

      setup(true);
      fixture.detectChanges();
    });

    it('should reset the filterValue and filterOptions.checked, if applicable, for each column other than that which is specified', () => {
      _.forEach(component.tableOptions.columns, (o: TableColumn) => {
        o.filterValue = 'hello world';
      });

      component.clearAllOtherColumnFilterValues('name');
      const filteredCols = component.tableOptions.columns.filter((o: TableColumn) => o.filterValue);
      const statusCol: TableColumn = component.tableOptions.columns.find(
        (o: TableColumn) => o.key === statusKey
      );
      const allUnchecked = statusCol.filterOptions.every((option: FilterOption) => !option.checked);

      expect(filteredCols.length).toBe(1);
      expect(allUnchecked).toBeTruthy();
    });

    it('should NOT reset the filterOptions.checked, if applicable, for the column which is specified', () => {
      _.forEach(component.tableOptions.columns, (o: TableColumn) => {
        o.filterValue = 'hello world';

        if (o.key === statusKey) {
          o.filterOptions[0].checked = true;
        }
      });

      component.clearAllOtherColumnFilterValues(statusKey);
      const statusCol: TableColumn = component.tableOptions.columns.find(
        (o: TableColumn) => o.key === statusKey
      );
      const allUnchecked = statusCol.filterOptions.every((option: FilterOption) => !option.checked);

      expect(allUnchecked).toBeFalsy();
    });
  });

  describe('onTableRowAction', () => {
    it('should emit the row action that was clicked', () => {
      const rowActionSpy = jest.spyOn(component.tableRowAction, 'emit');
      const actual = {
        index: 0,
        data: mocks.data[0],
        rowAction: mocks.rowActions[0]
      };

      component.onTableRowAction(0, mocks.data[0], mocks.rowActions[0]);

      expect(rowActionSpy).toHaveBeenCalledWith(actual);
    });
  });
});

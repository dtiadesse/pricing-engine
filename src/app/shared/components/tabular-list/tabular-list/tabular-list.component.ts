import { Component, ViewEncapsulation, Input, ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';

// Material
import { MatMenuTrigger } from '@angular/material/menu';

// Models
import { TabularListItem } from '../../tabular-list/models/tabular-list-item-model';

@Component({
  selector: 'mf-pe-tabular-list',
  templateUrl: './tabular-list.component.html',
  styleUrls: ['./tabular-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabularListComponent1 {
  @Input() id: string;

  @Input() rowsPerColumn: number;

  private _tabularData: TabularListItem[] = [];
  @Input()
  set tabularData(data: TabularListItem[]) {
    if (data) {
      this._tabularData = data;
      this.groupData();
    }
  }
  get tabularData(): TabularListItem[] {
    return this._tabularData;
  }
  groupedData: TabularListItem[][] = [];

  // ------------------------------ Init ------------------------------

  constructor() { }

  // ------------------------------ Handle Data ------------------------------

  // This takes care of grouping the data to make it easier to iterate through during rendering
  groupData() {
    this.groupedData = _.chunk(this.tabularData, this.rowsPerColumn);
  }

  getDecimalForPercent(value: string | number): number {
    const splitVal: number = +value.toString().split('%')[0];
    return splitVal / 100;
  }
}

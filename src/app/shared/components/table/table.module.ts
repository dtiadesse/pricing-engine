import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
//import { MatMenuModule } from '../../../tabular-list/tabular-list/node_modules/@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared
// import { ButtonModule } from '@Multifamily/shared/components';

// Directives
import { DirectivesModule } from '../../directives/directive.module'

// Component
import { TableComponent } from './table/table.component';
// import { TabularListComponent } from '../tabular-list/tabular-list/tabular-list.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // ButtonModule,
    DirectivesModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule
  ],
  declarations: [TableComponent
  ],
  exports: [TableComponent]
})
export class TableModule { }

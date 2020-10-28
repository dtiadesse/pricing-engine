import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

// Shared

import { PipesModule } from '../../pipes/pipes.module';

// Component
import { TabularListComponent1 } from './tabular-list/tabular-list.component';

@NgModule({
  declarations: [TabularListComponent1],
  imports: [CommonModule, MatListModule, MatMenuModule, PipesModule],
  exports: [TabularListComponent1]
})
export class TabularListModule { }

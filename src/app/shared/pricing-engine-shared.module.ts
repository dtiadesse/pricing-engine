import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { DirectivesModule } from './directives/directive.module'
import { PipesModule } from './pipes/pipes.module';
// import { QuoteSearchModule } from './components/quote-search/quote-search.module';
import { TableModule } from './components/table/table.module'
import { TabularListModule } from './components/tabular-list/tabular-list.module'

@NgModule({
  imports: [CommonModule],
  exports: [DirectivesModule, PipesModule,
    // QuoteSearchModule, 
    TableModule, TabularListModule]
})
export class PricingEngineSharedModule { }

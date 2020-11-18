import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Modules
import { DirectivesModule } from "./directives/directive.module";
import { PipesModule } from "./pipes/pipes.module";

import { TableModule } from "./components/table/table.module";
import { TabularListModule } from "./components/tabular-list/tabular-list.module";

import { StatusDialogModule } from "./components/status-modal/status-modal.module";
import { CustomTooltipModule } from "./components/custom-tooltip/custom-tooltip.module";
import { QuoteSearchModule } from "./components/quote-search/quote-search.module";
@NgModule({
  imports: [CommonModule],
  exports: [
    DirectivesModule,
    PipesModule,

    TableModule,
    TabularListModule,
    StatusDialogModule,
    CustomTooltipModule,
    QuoteSearchModule,
  ],
})
export class PricingEngineSharedModule {}

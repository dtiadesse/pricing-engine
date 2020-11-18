import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Pipes
import { DisplayCommaDelimitedValuesPipe } from "./display-comma-delimited-values/display-comma-delimited-values.pipe";
import { DisplayPositiveNegativePipe } from "./display-positive-negitive/display-positive-negitive";
import { EmptyValuePipe } from "./empty-value/empty-value.pipe";
import { CurrencySuffixPipe } from "./currency-suffix/currency-suffix.pipe";
@NgModule({
  imports: [CommonModule],
  declarations: [
    DisplayCommaDelimitedValuesPipe,
    DisplayPositiveNegativePipe,
    EmptyValuePipe,
    CurrencySuffixPipe,
  ],
  exports: [
    DisplayCommaDelimitedValuesPipe,
    DisplayPositiveNegativePipe,
    EmptyValuePipe,
    CurrencySuffixPipe,
  ],
})
export class PipesModule {}

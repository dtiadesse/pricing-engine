import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencySuffixPipe } from './currency-suffix/currency-suffix.pipe';

// Pipes
import { DisplayPositiveNegativePipe } from '../pipes/display-positive-negitive/display-positive-negitive'

import { EmptyValuePipe } from './empty-value/empty-value.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [DisplayPositiveNegativePipe, EmptyValuePipe, CurrencySuffixPipe],
  exports: [DisplayPositiveNegativePipe, EmptyValuePipe, CurrencySuffixPipe]
})
export class PipesModule { }

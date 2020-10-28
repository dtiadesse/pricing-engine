import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteSearchComponent } from '../quote-search/component/quote-search-bar/quote-search-bar.component'

import { ReactiveFormsModule } from '@angular/forms';
// import { MatIconModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { SearchResultComponent } from './component/search-result/search-result.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [QuoteSearchComponent, SearchResultComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [QuoteSearchComponent]
})
export class QuoteSearchModule { }

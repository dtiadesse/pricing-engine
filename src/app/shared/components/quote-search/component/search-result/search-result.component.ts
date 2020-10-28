import { Component, OnInit, Input } from '@angular/core';
import { Quote, SearchType, Opportunity } from '../../models/quote-search.model';

@Component({
  selector: 'mf-pe-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @Input() opportunityId: string;
  @Input() loanId: string;
  @Input() quote: Quote;
  @Input() propertyName: string;
  @Input() resultType: SearchType;

  constructor() { }

  ngOnInit() { }
}

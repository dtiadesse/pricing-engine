import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultComponent } from './search-result.component';
import { mockQuoteSearchResults } from '../../quote-search.mock';

describe('QuoteSearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let mocks: { [key: string]: any };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    mocks = mockQuoteSearchResults();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    component.opportunityId = mocks.opportunityId;
    component.quote = mocks.populatedQuoteResult;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

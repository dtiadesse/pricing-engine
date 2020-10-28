import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSearchComponent } from './quote-search.component';

import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteSearchQueryResults } from '../../models';
import { Observable, of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuoteSearchService } from '../../quote-search.service';
import { mockQuoteSearchResults } from '../../quote-search.mock';

describe('QuoteSearchComponent', () => {
  let component: QuoteSearchComponent;
  let fixture: ComponentFixture<QuoteSearchComponent>;
  let service: QuoteSearchService;
  let mocks: { [key: string]: any };
  let mockWindow: Partial<Window>;

  beforeEach(async(() => {
    mocks = mockQuoteSearchResults();

    const quoteSearchServiceStub: Partial<QuoteSearchService> = {
      getQueryResults: jest.fn(
        (): Observable<QuoteSearchQueryResults> => of(mocks.populatedQueryResults)
      )
    };

    const routerStub = {
      navigate: jest.fn(() => true)
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [QuoteSearchComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: QuoteSearchService, useValue: quoteSearchServiceStub },
        { provide: Window, useValue: window }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSearchComponent);
    component = fixture.componentInstance;

    service = TestBed.get(QuoteSearchService);
    mocks = mockQuoteSearchResults();

    mockWindow = { open: jest.fn() };

    fixture.detectChanges();
  });

  /**
   * This should be boilerplate.
   * This is necessary whenever you have multiple mocks of the same function/object that could be used and
   * manipulated throughout the test suite.
   */
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  // ------------------------------ Init ------------------------------

  describe('ngOnIt', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  // ---------------------------- Methods -----------------------------
  describe('Testing shouldBeFiltered', () => {
    it('empty query should be filtered', () => {
      expect(component.shouldBeFiltered('')).toBeTruthy();
    });

    it('short quote query should be filtered', () => {
      expect(component.shouldBeFiltered(mocks.invalidQuoteQuery)).toBeTruthy();
    });

    it('short opportunity query should be filtered', () => {
      expect(component.shouldBeFiltered(mocks.invalidOpportunityQuery)).toBeTruthy();
    });

    it('short property name query should be filtered', () => {
      expect(component.shouldBeFiltered(mocks.invalidPropertyNameQuery)).toBeTruthy();
    });

    it('quote query should set quote search type', () => {
      component.shouldBeFiltered(mocks.validQuoteQuery);

      expect(component.searchType).toEqual('quote');
    });

    it('opportunity query should set opportunity search type', () => {
      component.shouldBeFiltered(mocks.validOpportunityQuery);

      expect(component.searchType).toEqual('opportunity');
    });

    it('loan query should set loan search type', () => {
      component.shouldBeFiltered(mocks.validLoanQuery);

      expect(component.searchType).toEqual('loan');
    });

    it('property name query should set property search type', () => {
      component.shouldBeFiltered(mocks.validPropertyNameQuery);

      expect(component.searchType).toEqual('property');
    });
  });

  describe('Testing acceptResults', () => {
    it('proper quote query should return results', () => {
      component.acceptResults(mocks.populatedQueryResults);
      expect(component.opportunities).toEqual(mocks.populatedQueryResults.searchResults);
    });
  });

  describe('goToQuote', () => {
    it('should navigate to new url', () => {
      // const actual = `/pe/quote/${mocks.quoteId}`;
      component.openInNewWindow = false;

      const router = TestBed.get(Router);
      const routerSpy = spyOn(router, 'navigate').and.callThrough();
      component.navigate(mocks.quoteId);
      expect(routerSpy).toHaveBeenCalled();
    });

    it('should open url in a new tab', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation(mockWindow.open);

      component.navigate(mocks.quoteId);

      expect(windowSpy).toHaveBeenCalled();
    });
  });
});

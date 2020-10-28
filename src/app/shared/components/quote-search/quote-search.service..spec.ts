import { TestBed } from '@angular/core/testing';

import { QuoteSearchService } from './quote-search.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { mockQuoteSearchResults } from './quote-search.mock';
import { APP_CONFIG } from '@Multifamily/core';
import { QuoteSearchQueryResults } from '.';
import { HttpErrorResponse } from '@angular/common/http';

describe('QuoteSearchService', () => {
  let service: QuoteSearchService;
  let httpMockController: HttpTestingController;
  let mocks: { [key: string]: any };

  beforeEach(() => {
    mocks = mockQuoteSearchResults();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuoteSearchService, { provide: APP_CONFIG, useValue: mocks.appConfig }]
    });

    service = TestBed.get(QuoteSearchService);

    httpMockController = TestBed.get(HttpTestingController);
  });

  /**
   * This should be boilerplate.
   * This is necessary whenever you have multiple mocks of the same function/object that could be used and
   * manipulated throughout the test suite.
   */
  afterEach(() => {
    httpMockController.verify();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    service = TestBed.get(QuoteSearchService);
    expect(service).toBeTruthy();
  });

  // ------------------------------ Methods ------------------------------

  describe('getQueryResults', () => {
    let mockUrl: string;
    let mockQuery: string;
    let mockData: QuoteSearchQueryResults;
    let handleUrlAndMockData: (
      mockUrl: string,
      mockQuery: string,
      mockData?: QuoteSearchQueryResults,
      mockError?: ErrorEvent | null
    ) => void;

    beforeEach(() => {
      mockUrl = TestBed.get(APP_CONFIG).configs.pe.quoteSearch;
      mockQuery = mocks.validQuoteQuery;
      mockData = mocks.populatedQueryResults;

      handleUrlAndMockData = (
        url: string,
        query: string,
        data?: QuoteSearchQueryResults,
        error?: ErrorEvent | null
      ) => {
        const req = httpMockController.expectOne(`${url}/${query}`);
        expect(req.request.method).toEqual('GET');

        if (error !== undefined) {
          req.error(error);
        } else if (data) {
          req.flush(data);
        }
      };
    });

    it('should return a PropertySearchResult object', () => {
      service.getQueryResults(mockQuery).subscribe((data: QuoteSearchQueryResults) => {
        expect(data).toMatchObject(mockData);
      });

      handleUrlAndMockData(mockUrl, mockQuery, mockData);
    });

    it('should fail and throw an error of type ErrorEvent', () => {
      const errMsg = 'simulated network error';

      service.getQueryResults(mockQuery).subscribe(
        data => fail('should have failed with the network error'),
        (error: HttpErrorResponse) => {
          expect(error.error).toBeInstanceOf(ErrorEvent);
          expect(error.error.message).toEqual(errMsg);
        }
      );

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const mockError = new ErrorEvent('Network error', {
        message: errMsg
      });

      handleUrlAndMockData(mockUrl, mockQuery, mockData, mockError);
    });

    it('should fail and throw a generic error', () => {
      service.getQueryResults(mockQuery).subscribe(
        data => fail('should have failed with a generic error'),
        (error: HttpErrorResponse) => {
          expect(error.error).not.toBeInstanceOf(ErrorEvent);
          expect(error.error).toBeNull();
        }
      );

      handleUrlAndMockData(mockUrl, mockQuery, mockData, null);
    });
  });
});

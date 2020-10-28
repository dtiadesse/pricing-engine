import { QuoteSearchQueryResults } from '.';

export const MOCK_QUERY_RESULTS: QuoteSearchQueryResults = {
  searchResults: [
    {
      opportunityId: '1000000',
      loanId: '1000',
      propertyName: 'Mock Property',
      quoteResults: [
        {
          quoteId: '10101010',
          quoteType: '10 yr',
          statusType: 'status'
        }
      ]
    }
  ]
};

export const MOCK_APP_CONFIG: any = {
  configs: {
    pe: {
      quoteDetails: '/dummy/url',
      updQuoteDetails: '/dummy/url/update',
      propertySearch: '/dummy/url'
    }
  }
};

export const mockQuoteSearchResults = () => {
  return {
    populatedQueryResults: MOCK_QUERY_RESULTS,
    validQuoteQuery: 'Q100',
    validOpportunityQuery: 'O100',
    validLoanQuery: 'L100',
    validPropertyNameQuery: 'The A',
    invalidQuoteQuery: 'Q1',
    invalidOpportunityQuery: 'O1',
    invalidLoanQuery: 'L1',
    invalidPropertyNameQuery: 'The',
    appConfig: MOCK_APP_CONFIG
  };
};

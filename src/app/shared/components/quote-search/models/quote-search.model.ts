export type SearchType = 'quote' | 'opportunity' | 'loan' | 'property';

export interface QuoteSearchQueryResults {
  searchResults: Opportunity[];
}

export interface Opportunity {
  opportunityId: string | number;
  loanId: string | number;
  propertyName: string;
  quoteResults: Quote[];
}

export interface Quote {
  quoteId: string | number;
  quoteType: string;
  statusType: string;
}

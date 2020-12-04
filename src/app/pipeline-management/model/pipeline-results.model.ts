export interface PipelineResults {
  newQuotes: PipelineQuoteDetails[];
  extensionQuotes: PipelineQuoteDetails[];
  awaitingApprovalQuotes: PipelineQuoteDetails[];
  approvalLimit: number;
  userId: string;
  pipelineStatistics?: PipelineStatistics;
}

export interface PipelineStatistics {
  newQuotes: QuoteStatistics;
  extensionQuotes: QuoteStatistics;
  awaitingApprovalQuotes: QuoteStatistics;
}

export interface QuoteStatistics {
  unclaimedQuotes: string;
  unapprovedQuotes: string;
  highPriorityQuotes: string;
  highPriorityOpportunities: string;
  quotesGreaterThanFiftyMillion: string;
  opportunitiesGreaterThanFiftyMillion: string;
  opportunitiesCount: string;
  quotesCount: string;
}
export interface PipelineQuoteDetails {
  opportunityId: string;
  maxUPB: number;
  claimedByUserId: string;
  claimedBy: string;
  quoteCount: number;
  submitDateTime: Date;
  propertyName: string;
  approvalHold: string;
  borrower: string;
  producer: string;
  region: string;
  quoteResults: any[];
}

export interface PipelineOpportunityDetails {
  opportunityId: string;
  claimedByUserId: string;
  claimedByUser: boolean;
  approvalHold: boolean;
  approvalHoldId: string;
  loanNumber: string;
  userName: string;
  version: number;
  quoteResults: any[];
}

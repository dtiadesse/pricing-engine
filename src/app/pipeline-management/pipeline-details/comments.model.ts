export interface IComment {
  commentType?: string;
  content?: string;
  conversationId?: string;
  lastModifiedDateTime?: string;
  messageId?: string;
  opportunityId?: string;
  opportunityStatus?: string;
  quoteId?: string;
  sender?: string;
  senderGroup?: string;
  senderInfo?: string;
  timeCommentSubmitted?: string;
}

export interface ContextTypeReferenceData {
  contextColor?: string;
  displayOrder?: number;
  displayValue: string;
  value: string;
}

export interface ConversationContextLineage {
  dealId?: string;
  documentId?: string;
  loanId?: string;
  opportunityId?: string;
  partyId?: string;
  propertyId?: string;
  quoteId?: string;
}

export interface ConversationParticipant {
  groupName: string;
  userId: string;
  userIdentityType: string;
  userName: string;
}

export interface ConversationMessage {
  content: string;
  conversationBulkGroup: string;
  createdDateTime: string;
  importance: string;
  lastModifiedDateTime: string;
  messageId: string;
  recipient: ConversationParticipant;
  replyRequired: boolean;
  replyTargetDateTime: string;
  sender: ConversationParticipant;
  sentDateTime: string;
  state: string;
}

export interface IConversation {
  businessProcess: string;
  contextId: string;
  contextLineage: ConversationContextLineage;
  contextType: string;
  conversationId: string;
  createdDateTime: string;
  creator: ConversationParticipant;
  lastUpdateDateTime: string;
  messages: ConversationMessage[];
  state: string;
  type: string;
}

import { IConversation } from "./conversation.model";

export interface Conversations {
  conversations: IConversation[];
}

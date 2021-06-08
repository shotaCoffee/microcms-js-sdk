export interface ClientParams {
  serviceDomain: string;
  apiKey: string;
  globalDraftKey?: string;
}

export interface MakeRequest<T> {
  endpoint: string;
  contentId?: string;
  queries?: QueriesType;
  useGlobalDraftKey?: boolean;
  contentData?: T;
}

export interface GetRequest {
  endpoint: string;
  contentId?: string;
  queries?: QueriesType;
  useGlobalDraftKey?: boolean;
}

export interface PostRequest<T> {
  endpoint: string
  contentData: T
}

type depthNumber = 1 | 2 | 3;

export interface QueriesType {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: string;
  q?: string;
  depth?: depthNumber;
  ids?: string;
  filters?: string;
}

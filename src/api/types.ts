// X API (Twitter API v2) TypeScript Types

// Tweet related types
export interface Tweet {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  public_metrics?: TweetPublicMetrics;
  context_annotations?: ContextAnnotation[];
  source?: string;
  lang?: string;
  possibly_sensitive?: boolean;
  reply_settings?: string;
  referenced_tweets?: ReferencedTweet[];
}

export interface TweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count?: number;
  impression_count?: number;
}

export interface ReferencedTweet {
  type: string;
  id: string;
}

export interface ContextAnnotation {
  domain: {
    id: string;
    name: string;
    description: string;
  };
  entity: {
    id: string;
    name: string;
    description?: string;
  };
}

// User related types
export interface User {
  id: string;
  name: string;
  username: string;
  created_at?: string;
  description?: string;
  public_metrics?: UserPublicMetrics;
  verified?: boolean;
  verified_type?: string;
  protected?: boolean;
  profile_image_url?: string;
  url?: string;
  location?: string;
  pinned_tweet_id?: string;
}

export interface UserPublicMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count?: number;
  media_count?: number;
}

// API Response types
export interface TweetResponse {
  data: Tweet;
  includes?: {
    users?: User[];
    tweets?: Tweet[];
  };
  errors?: ApiError[];
}

export interface TweetsResponse {
  data: Tweet[];
  meta: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
    previous_token?: string;
  };
  includes?: {
    users?: User[];
    tweets?: Tweet[];
    media?: any[];
    places?: any[];
  };
  errors?: ApiError[];
}

export interface UserResponse {
  data: User;
  includes?: {
    tweets?: Tweet[];
  };
  errors?: ApiError[];
}

export interface UsersResponse {
  data: User[];
  errors?: ApiError[];
}

// Error types
export interface ApiError {
  message: string;
  parameters?: Record<string, any>;
  resource_id?: string;
  resource_type?: string;
  section?: string;
  code?: string;
  value?: string;
  detail?: string;
}

// Search options
export interface SearchTweetsOptions {
  maxResults?: number; // 10-100
  tweetFields?: string[];
  expansions?: string[];
  userFields?: string[];
  mediaFields?: string[];
  placeFields?: string[];
  pollFields?: string[];
  nextToken?: string;
  sinceId?: string;
  untilId?: string;
  startTime?: string;
  endTime?: string;
}

export interface GetUserTweetsOptions {
  maxResults?: number; // 5-100
  tweetFields?: string[];
  expansions?: string[];
  userFields?: string[];
  exclude?: ('replies' | 'retweets')[];
  nextToken?: string;
  sinceId?: string;
  untilId?: string;
  startTime?: string;
  endTime?: string;
}

export interface GetTweetOptions {
  tweetFields?: string[];
  expansions?: string[];
  userFields?: string[];
  mediaFields?: string[];
  placeFields?: string[];
  pollFields?: string[];
}

export interface GetUserOptions {
  userFields?: string[];
  expansions?: string[];
  tweetFields?: string[];
}

// Topic related types
export interface Topic {
  id: string;
  name: string;
  description?: string;
  query?: string;
  pinned_tweet_id?: string;
  created_at?: string;
}

export interface TopicResponse {
  data: Topic;
  includes?: {
    tweets?: Tweet[];
  };
  errors?: ApiError[];
}

export interface TopicsResponse {
  data: Topic[];
  meta: {
    result_count: number;
  };
  errors?: ApiError[];
}

// Topic search options
export interface SearchTopicsOptions {
  maxResults?: number; // 1-100
  topicFields?: string[];
  expansions?: string[];
  tweetFields?: string[];
}

export interface GetTopicTweetsOptions {
  maxResults?: number; // 10-100
  tweetFields?: string[];
  expansions?: string[];
  userFields?: string[];
  nextToken?: string;
}

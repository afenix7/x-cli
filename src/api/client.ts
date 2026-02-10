import {
  Tweet,
  TweetResponse,
  TweetsResponse,
  User,
  UserResponse,
  UsersResponse,
  SearchTweetsOptions,
  GetUserTweetsOptions,
  GetTweetOptions,
  GetUserOptions,
  SearchTopicsOptions,
  GetTopicTweetsOptions,
  TopicsResponse,
  TopicResponse,
  TweetsResponse as TopicTweetsResponse,
  ApiError,
} from './types.js';

export class XApiClient {
  private baseUrl = 'https://api.x.com/2';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(','));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { errors?: any[] };
      throw new XApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorData.errors || []
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * 搜索推文
   * @param query 搜索查询
   * @param options 可选参数
   */
  async searchTweets(query: string, options: SearchTweetsOptions = {}): Promise<TweetsResponse> {
    const params: Record<string, any> = {
      query,
      max_results: options.maxResults || 10,
    };

    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }
    if (options.nextToken) {
      params['next_token'] = options.nextToken;
    }
    if (options.startTime) {
      params['start_time'] = options.startTime;
    }
    if (options.endTime) {
      params['end_time'] = options.endTime;
    }

    return this.request<TweetsResponse>('/tweets/search/recent', params);
  }

  /**
   * 通过用户名获取用户信息
   * @param username 用户名 (不带 @)
   */
  async getUserByUsername(username: string, options: GetUserOptions = {}): Promise<UserResponse> {
    const params: Record<string, any> = {};

    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }

    return this.request<UserResponse>(`/users/by/username/${username}`, params);
  }

  /**
   * 通过 ID 获取用户信息
   * @param id 用户 ID
   */
  async getUserById(id: string, options: GetUserOptions = {}): Promise<UserResponse> {
    const params: Record<string, any> = {};

    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }

    return this.request<UserResponse>(`/users/${id}`, params);
  }

  /**
   * 获取用户的推文
   * @param userId 用户 ID
   */
  async getUserTweets(userId: string, options: GetUserTweetsOptions = {}): Promise<TweetsResponse> {
    const params: Record<string, any> = {
      max_results: options.maxResults || 10,
    };

    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }
    if (options.exclude) {
      params['exclude'] = options.exclude.join(',');
    }
    if (options.nextToken) {
      params['pagination_token'] = options.nextToken;
    }

    return this.request<TweetsResponse>(`/users/${userId}/tweets`, params);
  }

  /**
   * 获取推文详情
   * @param tweetId 推文 ID
   */
  async getTweet(tweetId: string, options: GetTweetOptions = {}): Promise<TweetResponse> {
    const params: Record<string, any> = {};

    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }

    return this.request<TweetResponse>(`/tweets/${tweetId}`, params);
  }

  /**
   * 搜索话题/主题
   * @param query 搜索关键词
   * @param options 可选参数
   */
  async searchTopics(query: string, options: SearchTopicsOptions = {}): Promise<TopicsResponse> {
    const params: Record<string, any> = {
      query,
      max_results: options.maxResults || 10,
    };

    if (options.topicFields) {
      params['topic.fields'] = options.topicFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }

    return this.request<TopicsResponse>('/topics/search', params);
  }

  /**
   * 获取话题详情
   * @param topicId 话题 ID
   * @param options 可选参数
   */
  async getTopic(topicId: string, options: SearchTopicsOptions = {}): Promise<TopicResponse> {
    const params: Record<string, any> = {};

    if (options.topicFields) {
      params['topic.fields'] = options.topicFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }

    return this.request<TopicResponse>(`/topics/${topicId}`, params);
  }

  /**
   * 获取话题下的推文
   * @param topicId 话题 ID
   * @param options 可选参数
   */
  async getTopicTweets(topicId: string, options: GetTopicTweetsOptions = {}): Promise<TweetsResponse> {
    const params: Record<string, any> = {
      max_results: options.maxResults || 10,
    };

    if (options.tweetFields) {
      params['tweet.fields'] = options.tweetFields.join(',');
    }
    if (options.expansions) {
      params['expansions'] = options.expansions.join(',');
    }
    if (options.userFields) {
      params['user.fields'] = options.userFields.join(',');
    }
    if (options.nextToken) {
      params['pagination_token'] = options.nextToken;
    }

    return this.request<TweetsResponse>(`/topics/${topicId}/tweets`, params);
  }
}

/**
 * X API 错误类
 */
export class XApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors: any[]
  ) {
    super(message);
    this.name = 'XApiError';
  }
}

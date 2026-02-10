import { XApiClient } from '../api/client.js';
import type { Topic, TopicsResponse, TopicResponse, TweetsResponse } from '../api/types.js';

// Mock fetch for testing
global.fetch = jest.fn();

const TEST_TOPIC = 'openclaw';
const TEST_TOPIC_ID = '1234567890';

// Mock topic data
const mockTopic: Topic = {
  id: TEST_TOPIC_ID,
  name: 'OpenClaw',
  description: 'OpenClaw - AI Agent Framework',
  query: 'openclaw',
  created_at: '2024-01-01T00:00:00Z',
};

const mockTopicsResponse: TopicsResponse = {
  data: [mockTopic],
  meta: {
    result_count: 1,
  },
};

const mockTopicResponse: TopicResponse = {
  data: mockTopic,
};

const mockTweetsResponse: TweetsResponse = {
  data: [
    {
      id: 'tw123',
      text: 'Check out OpenClaw!',
      author_id: 'user123',
      created_at: '2025-01-01T00:00:00Z',
      public_metrics: {
        retweet_count: 10,
        reply_count: 5,
        like_count: 50,
        quote_count: 2,
      },
    },
  ],
  meta: {
    result_count: 1,
  },
  includes: {
    users: [
      {
        id: 'user123',
        name: 'Test User',
        username: 'testuser',
      },
    ],
  },
};

describe('XApiClient Topic Operations', () => {
  let client: XApiClient;

  beforeEach(() => {
    client = new XApiClient('test-token');
    jest.clearAllMocks();
  });

  describe('searchTopics', () => {
    it('should search for topics by query', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTopicsResponse,
      });

      const response = await client.searchTopics(TEST_TOPIC);

      expect(response.data).toHaveLength(1);
      expect(response.data[0].name).toBe('OpenClaw');
      expect(response.data[0].query).toBe(TEST_TOPIC);
    });

    it('should include correct parameters in request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTopicsResponse,
      });

      await client.searchTopics(TEST_TOPIC, {
        maxResults: 20,
        topicFields: ['id', 'name', 'description'],
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const url = fetchCall[0] as string;
      
      expect(url).toContain(`query=${TEST_TOPIC}`);
      expect(url).toContain('max_results=20');
      expect(url).toContain('topic.fields=');
    });
  });

  describe('getTopic', () => {
    it('should get topic details by ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTopicResponse,
      });

      const response = await client.getTopic(TEST_TOPIC_ID);

      expect(response.data.id).toBe(TEST_TOPIC_ID);
      expect(response.data.name).toBe('OpenClaw');
    });

    it('should include correct endpoint in request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTopicResponse,
      });

      await client.getTopic(TEST_TOPIC_ID, {
        topicFields: ['id', 'name', 'description', 'follower_count'],
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const url = fetchCall[0] as string;
      
      expect(url).toContain(`/topics/${TEST_TOPIC_ID}`);
      expect(url).toContain('topic.fields=');
    });
  });

  describe('getTopicTweets', () => {
    it('should get tweets for a topic', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTweetsResponse,
      });

      const response = await client.getTopicTweets(TEST_TOPIC_ID);

      expect(response.data).toHaveLength(1);
      expect(response.data[0].text).toBe('Check out OpenClaw!');
    });

    it('should include correct parameters in request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTweetsResponse,
      });

      await client.getTopicTweets(TEST_TOPIC_ID, {
        maxResults: 50,
        tweetFields: ['created_at', 'public_metrics'],
        expansions: ['author_id'],
        userFields: ['username'],
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const url = fetchCall[0] as string;
      
      expect(url).toContain(`/topics/${TEST_TOPIC_ID}/tweets`);
      expect(url).toContain('max_results=50');
      expect(url).toContain('tweet.fields=');
      expect(url).toContain('expansions=author_id');
    });
  });
});
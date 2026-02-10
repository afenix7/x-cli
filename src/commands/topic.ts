import { Command } from 'commander';
import { XApiClient } from '../api/client.js';
import { getConfig } from '../utils/config.js';
import { formatTweetList, output, OutputFormat } from '../utils/format.js';

export function createTopicCommand(): Command {
  const command = new Command('topic')
    .description('Search for topics and get topic-related content on X')
    .argument('<query>', 'Topic name or search query')
    .option('-n, --max-results <number>', 'Maximum number of results (1-100)', '10')
    .option('-f, --format <format>', 'Output format: table or json', 'table')
    .option('--include-tweets', 'Include related tweets for the topic', false)
    .option('--topic-id <id>', 'Get specific topic by ID instead of searching')
    .action(async (query: string, options) => {
      try {
        const config = getConfig();
        const client = new XApiClient(config.token);

        const format = options.format as OutputFormat;

        // If topic-id is provided, get specific topic
        if (options.topicId) {
          console.log(`Fetching topic ${options.topicId}...`);
          const topicResult = await client.getTopic(options.topicId, {
            topicFields: ['description', 'created_at', 'query'],
            expansions: ['pinned_tweet_id'],
            tweetFields: ['created_at', 'public_metrics'],
          });

          if (format === 'json') {
            console.log(output(topicResult, format));
            return;
          }

          if (!topicResult.data) {
            console.log('Topic not found.');
            return;
          }

          const topic = topicResult.data;
          console.log('\n📌 Topic Details:\n');
          console.log(`Name: ${topic.name}`);
          console.log(`ID: ${topic.id}`);
          if (topic.description) {
            console.log(`Description: ${topic.description}`);
          }
          if (topic.query) {
            console.log(`Query: ${topic.query}`);
          }
          if (topic.created_at) {
            console.log(`Created: ${topic.created_at}`);
          }

          // Show pinned tweet if available
          if (topicResult.includes?.tweets && topicResult.includes.tweets.length > 0) {
            const pinnedTweet = topicResult.includes.tweets[0];
            console.log('\n📍 Pinned Tweet:');
            console.log('-'.repeat(50));
            console.log(pinnedTweet.text);
            console.log('-'.repeat(50));
            if (pinnedTweet.public_metrics) {
              console.log(`♥ ${pinnedTweet.public_metrics.like_count} | 🔄 ${pinnedTweet.public_metrics.retweet_count} | 💬 ${pinnedTweet.public_metrics.reply_count}`);
            }
          }

          // Get tweets for this topic if requested
          if (options.includeTweets) {
            console.log('\n' + '='.repeat(50));
            console.log('Fetching tweets for this topic...\n');
            const tweetsResult = await client.getTopicTweets(topic.id, {
              maxResults: 10,
              tweetFields: ['created_at', 'public_metrics'],
              expansions: ['author_id'],
              userFields: ['username', 'name', 'verified'],
            });

            if (tweetsResult.data.length === 0) {
              console.log('No tweets found for this topic.');
              return;
            }

            // Build user lookup map
            const users = new Map();
            if (tweetsResult.includes?.users) {
              for (const user of tweetsResult.includes.users) {
                users.set(user.id, user);
              }
            }

            console.log(`Found ${tweetsResult.meta.result_count} tweets:\n`);
            console.log(formatTweetList(tweetsResult.data, users));
          }

          return;
        }

        // Search for topics
        console.log(`Searching for topics matching "${query}"...`);
        const maxResults = Math.min(Math.max(parseInt(options.maxResults), 1), 100);

        const searchResult = await client.searchTopics(query, {
          maxResults,
          topicFields: ['description', 'created_at', 'query'],
        });

        if (format === 'json') {
          console.log(output(searchResult, format));
          return;
        }

        if (searchResult.data.length === 0) {
          console.log('No topics found matching your query.');
          return;
        }

        console.log(`\nFound ${searchResult.meta.result_count} topics:\n`);

        for (let i = 0; i < searchResult.data.length; i++) {
          const topic = searchResult.data[i];
          console.log(`[${i + 1}/${searchResult.data.length}] 📌 ${topic.name}`);
          console.log(`    ID: ${topic.id}`);
          if (topic.description) {
            console.log(`    Description: ${topic.description}`);
          }
          if (topic.query) {
            console.log(`    Query: ${topic.query}`);
          }
          if (i < searchResult.data.length - 1) {
            console.log('');
          }
        }

        console.log('\n💡 Tip: Use --topic-id <id> to get details and tweets for a specific topic');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Unknown error occurred');
        }
        process.exit(1);
      }
    });

  return command;
}

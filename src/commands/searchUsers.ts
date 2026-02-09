import { Command } from 'commander';
import { XApiClient } from '../api/client.js';
import { getConfig } from '../utils/config.js';
import { formatUserList, output, OutputFormat } from '../utils/format.js';

export function createSearchUsersCommand(): Command {
  const command = new Command('search-users')
    .description('Search for X users by username')
    .argument('<username>', 'Username to search for (without @)')
    .option('-f, --format <format>', 'Output format: table or json', 'table')
    .option('--include-metrics', 'Include user metrics', false)
    .action(async (username: string, options) => {
      try {
        const config = getConfig();
        const client = new XApiClient(config.token);

        const format = options.format as OutputFormat;

        // Remove @ if present
        const cleanUsername = username.replace(/^@/, '');

        const userFields = [
          'created_at',
          'description',
          'profile_image_url',
          'verified',
          'verified_type',
          'url',
          'location',
          'public_metrics',
          'protected',
          'pinned_tweet_id',
        ];

        const expansions = ['pinned_tweet_id'];
        const tweetFields = ['created_at', 'public_metrics'];

        const result = await client.getUserByUsername(cleanUsername, {
          userFields,
          expansions,
          tweetFields,
        });

        if (format === 'json') {
          console.log(output(result, format));
          return;
        }

        if (!result.data) {
          console.log(`User "${cleanUsername}" not found.`);
          return;
        }

        console.log('\nUser found:\n');
        console.log(formatUserList([result.data]));

        if (result.includes?.tweets && result.includes.tweets.length > 0) {
          const pinnedTweet = result.includes.tweets[0];
          console.log('\n📌 Pinned Tweet:');
          console.log('-'.repeat(50));
          console.log(pinnedTweet.text);
          console.log('-'.repeat(50));
          if (pinnedTweet.public_metrics) {
            console.log(`♥ ${pinnedTweet.public_metrics.like_count} | 🔄 ${pinnedTweet.public_metrics.retweet_count} | 💬 ${pinnedTweet.public_metrics.reply_count}`);
          }
        }
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

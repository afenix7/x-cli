import { Command } from 'commander';
import { XApiClient } from '../api/client.js';
import { getConfig } from '../utils/config.js';
import { formatTweetList, formatUser, output, OutputFormat } from '../utils/format.js';

export function createUserTweetsCommand(): Command {
  const command = new Command('user-tweets')
    .description('Get tweets from a specific X user')
    .argument('<username>', 'Username (with or without @)')
    .option('-n, --max-results <number>', 'Maximum number of tweets (5-100)', '10')
    .option('-f, --format <format>', 'Output format: table or json', 'table')
    .option('--exclude-replies', 'Exclude reply tweets', false)
    .option('--exclude-retweets', 'Exclude retweets', false)
    .option('--include-metrics', 'Include engagement metrics', false)
    .action(async (username: string, options) => {
      try {
        const config = getConfig();
        const client = new XApiClient(config.token);

        const maxResults = Math.min(Math.max(parseInt(options.maxResults), 5), 100);
        const format = options.format as OutputFormat;

        // Remove @ if present
        const cleanUsername = username.replace(/^@/, '');

        // First, get the user
        console.log(`Fetching user @${cleanUsername}...`);
        const userResult = await client.getUserByUsername(cleanUsername, {
          userFields: ['created_at', 'description', 'public_metrics', 'verified'],
        });

        if (!userResult.data) {
          console.log(`User "${cleanUsername}" not found.`);
          return;
        }

        const user = userResult.data;
        console.log('\nUser info:\n');
        console.log(formatUser(user));
        console.log('\n' + '='.repeat(50) + '\n');

        // Now get tweets
        console.log('Fetching tweets...\n');

        const exclude: string[] = [];
        if (options.excludeReplies) exclude.push('replies');
        if (options.excludeRetweets) exclude.push('retweets');

        const tweetFields = ['created_at'];
        if (options.includeMetrics) {
          tweetFields.push('public_metrics');
        }

        const tweetsResult = await client.getUserTweets(user.id, {
          maxResults,
          tweetFields,
          exclude: exclude.length > 0 ? exclude as any : undefined,
        });

        if (format === 'json') {
          console.log(output({
            user,
            tweets: tweetsResult,
          }, format));
          return;
        }

        if (tweetsResult.data.length === 0) {
          console.log('No tweets found.');
          if (options.excludeReplies || options.excludeRetweets) {
            console.log('(Note: Some tweets may have been excluded by filters)');
          }
          return;
        }

        console.log(`Found ${tweetsResult.meta.result_count} tweets:\n`);
        console.log(formatTweetList(tweetsResult.data));

        if (tweetsResult.meta.next_token) {
          console.log('\n' + '-'.repeat(50));
          console.log('More tweets available. Use --next-token to paginate.');
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

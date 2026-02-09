import { Command } from 'commander';
import { XApiClient } from '../api/client.js';
import { getConfig } from '../utils/config.js';
import { formatTweetList, output, OutputFormat } from '../utils/format.js';

export function createSearchCommand(): Command {
  const command = new Command('search')
    .description('Search recent tweets on X')
    .argument('<query>', 'Search query')
    .option('-n, --max-results <number>', 'Maximum number of results (10-100)', '10')
    .option('-f, --format <format>', 'Output format: table or json', 'table')
    .option('--include-metrics', 'Include engagement metrics', false)
    .action(async (query: string, options) => {
      try {
        const config = getConfig();
        const client = new XApiClient(config.token);

        const maxResults = Math.min(Math.max(parseInt(options.maxResults), 10), 100);
        const format = options.format as OutputFormat;

        const tweetFields = ['created_at', 'author_id'];
        if (options.includeMetrics) {
          tweetFields.push('public_metrics');
        }

        const expansions = ['author_id'];
        const userFields = ['username', 'name', 'verified'];

        const result = await client.searchTweets(query, {
          maxResults,
          tweetFields,
          expansions,
          userFields,
        });

        if (format === 'json') {
          console.log(output(result, format));
          return;
        }

        if (result.data.length === 0) {
          console.log('No tweets found matching your query.');
          return;
        }

        // Build user lookup map
        const users = new Map();
        if (result.includes?.users) {
          for (const user of result.includes.users) {
            users.set(user.id, user);
          }
        }

        console.log(`\nFound ${result.meta.result_count} tweets:\n`);
        console.log(formatTweetList(result.data, users));

        if (result.meta.next_token) {
          console.log('\n' + '-'.repeat(50));
          console.log('More results available. Use --next-token to paginate.');
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

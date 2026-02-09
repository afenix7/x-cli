import { Command } from 'commander';
import { XApiClient } from '../api/client.js';
import { getConfig } from '../utils/config.js';
import { formatTweet, output, OutputFormat } from '../utils/format.js';

export function createTweetCommand(): Command {
  const command = new Command('tweet')
    .description('Get details of a specific X tweet')
    .argument('<tweetId>', 'Tweet ID (the numeric ID from the tweet URL)')
    .option('-f, --format <format>', 'Output format: table or json', 'table')
    .option('--include-author', 'Include author information', false)
    .action(async (tweetId: string, options) => {
      try {
        const config = getConfig();
        const client = new XApiClient(config.token);

        const format = options.format as OutputFormat;

        const tweetFields = [
          'created_at',
          'public_metrics',
          'context_annotations',
          'source',
          'lang',
          'possibly_sensitive',
          'reply_settings',
        ];

        let expansions: string[] = [];
        let userFields: string[] = [];

        if (options.includeAuthor) {
          expansions.push('author_id');
          userFields.push('username', 'name', 'verified', 'profile_image_url');
        }

        const result = await client.getTweet(tweetId, {
          tweetFields,
          expansions: expansions.length > 0 ? expansions : undefined,
          userFields: userFields.length > 0 ? userFields : undefined,
        });

        if (format === 'json') {
          console.log(output(result, format));
          return;
        }

        if (!result.data) {
          console.log('Tweet not found.');
          return;
        }

        // Get author if available
        let author = undefined;
        if (result.includes?.users && result.includes.users.length > 0) {
          author = result.includes.users[0];
        }

        console.log('\nTweet Details:\n');
        console.log(formatTweet(result.data, author));

        // Show context annotations if available
        if (result.data.context_annotations && result.data.context_annotations.length > 0) {
          console.log('\n📊 Context Annotations:');
          for (const annotation of result.data.context_annotations) {
            if (annotation.domain && annotation.entity) {
              console.log(`  • ${annotation.domain.name}: ${annotation.entity.name}`);
            }
          }
        }

        // Show reply settings
        if (result.data.reply_settings) {
          console.log('\n🔒 Reply Settings:', result.data.reply_settings);
        }

        // Show language
        if (result.data.lang) {
          console.log('🌐 Language:', result.data.lang);
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

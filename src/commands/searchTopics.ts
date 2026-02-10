import { Command } from 'commander';
import { getApiClient } from '../api/index.js';
import { formatTopicList } from '../utils/format.js';
import { loadConfig } from '../utils/config.js';

export function createSearchTopicsCommand(): Command {
  const command = new Command('searchTopics')
    .description('搜索话题/主题')
    .argument('<query>', '搜索关键词')
    .option('-n, --max-results <number>', '最大结果数 (1-100)', '10')
    .option('--json', '以 JSON 格式输出')
    .action(async (query, options) => {
      try {
        const config = loadConfig();
        if (!config.bearerToken) {
          console.error('错误: 未配置 Bearer Token');
          console.log('请先运行: x-cli config --bearer-token <token>');
          process.exit(1);
        }

        const client = getApiClient(config.bearerToken);
        const maxResults = Math.min(100, Math.max(1, parseInt(options.maxResults, 10)));

        console.log(`正在搜索话题: "${query}"...`);
        const response = await client.searchTopics(query, {
          maxResults,
          topicFields: ['id', 'name', 'description', 'query', 'follower_count'],
        });

        if (options.json) {
          console.log(JSON.stringify(response, null, 2));
        } else {
          if (!response.data || response.data.length === 0) {
            console.log('未找到相关话题。');
            return;
          }

          console.log(`\n找到 ${response.data.length} 个话题:\n`);
          console.log(formatTopicList(response.data));
        }
      } catch (error) {
        console.error('错误:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
}

import { Tweet, User, TweetPublicMetrics, UserPublicMetrics } from '../api/types.js';

export type OutputFormat = 'table' | 'json';

/**
 * 格式化推文时间
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化推文指标
 */
export function formatTweetMetrics(metrics?: TweetPublicMetrics): string {
  if (!metrics) return '';
  const parts = [];
  if (metrics.like_count !== undefined) parts.push(`♥ ${metrics.like_count}`);
  if (metrics.retweet_count !== undefined) parts.push(`🔄 ${metrics.retweet_count}`);
  if (metrics.reply_count !== undefined) parts.push(`💬 ${metrics.reply_count}`);
  return parts.join(' | ');
}

/**
 * 格式化用户指标
 */
export function formatUserMetrics(metrics?: UserPublicMetrics): string {
  if (!metrics) return '';
  return `👥 ${metrics.followers_count} followers | ${metrics.following_count} following | 📝 ${metrics.tweet_count} tweets`;
}

/**
 * 格式化单条推文
 */
export function formatTweet(tweet: Tweet, author?: User): string {
  const lines = [];

  // 作者信息
  if (author) {
    lines.push(`@${author.username} (${author.name})`);
  }

  // 推文内容
  lines.push('─'.repeat(50));
  lines.push(tweet.text);
  lines.push('─'.repeat(50));

  // 时间和指标
  const metaParts = [];
  if (tweet.created_at) {
    metaParts.push(`🕐 ${formatDate(tweet.created_at)}`);
  }
  const metrics = formatTweetMetrics(tweet.public_metrics);
  if (metrics) {
    metaParts.push(metrics);
  }
  lines.push(metaParts.join(' | '));

  // Tweet ID
  lines.push(`ID: ${tweet.id}`);

  return lines.join('\n');
}

/**
 * 格式化单个用户
 */
export function formatUser(user: User): string {
  const lines = [];

  // 用户名和显示名
  lines.push(`@${user.username}`);
  lines.push(`Name: ${user.name}`);

  // 验证状态
  if (user.verified) {
    lines.push(`✓ Verified${user.verified_type ? ` (${user.verified_type})` : ''}`);
  }

  // 描述
  if (user.description) {
    lines.push('─'.repeat(50));
    lines.push(user.description);
    lines.push('─'.repeat(50));
  }

  // 指标
  const metrics = formatUserMetrics(user.public_metrics);
  if (metrics) {
    lines.push(metrics);
  }

  // 其他信息
  const metaParts = [];
  if (user.created_at) {
    metaParts.push(`Joined: ${formatDate(user.created_at).split(' ')[0]}`);
  }
  if (user.location) {
    metaParts.push(`📍 ${user.location}`);
  }
  if (user.url) {
    metaParts.push(`🔗 ${user.url}`);
  }
  if (metaParts.length > 0) {
    lines.push(metaParts.join(' | '));
  }

  // 用户 ID
  lines.push(`ID: ${user.id}`);

  return lines.join('\n');
}

/**
 * 格式化推文列表
 */
export function formatTweetList(tweets: Tweet[], users?: Map<string, User>): string {
  if (tweets.length === 0) {
    return 'No tweets found.';
  }

  return tweets
    .map((tweet, index) => {
      const author = users?.get(tweet.author_id || '');
      const header = `[${index + 1}/${tweets.length}]`;
      return `${header}\n${formatTweet(tweet, author)}`;
    })
    .join('\n\n' + '='.repeat(50) + '\n\n');
}

/**
 * 格式化用户列表
 */
export function formatUserList(users: User[]): string {
  if (users.length === 0) {
    return 'No users found.';
  }

  return users
    .map((user, index) => {
      const header = `[${index + 1}/${users.length}]`;
      return `${header}\n${formatUser(user)}`;
    })
    .join('\n\n' + '='.repeat(50) + '\n\n');
}

/**
 * 根据格式输出数据
 */
export function output(data: any, format: OutputFormat = 'table'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // table format is handled by specific format functions above
  return String(data);
}

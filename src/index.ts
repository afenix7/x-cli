#!/usr/bin/env node

import { Command } from 'commander';
import { createSearchCommand } from './commands/search.js';
import { createSearchUsersCommand } from './commands/searchUsers.js';
import { createUserTweetsCommand } from './commands/userTweets.js';
import { createTweetCommand } from './commands/tweet.js';

const version = '1.0.0';

// Create CLI program
const program = new Command()
  .name('x-cli')
  .description('CLI tool for X (Twitter) API - search tweets, users, and more')
  .version(version);

// Add commands
program.addCommand(createSearchCommand());
program.addCommand(createSearchUsersCommand());
program.addCommand(createUserTweetsCommand());
program.addCommand(createTweetCommand());

// Add global help
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ x-cli search "typescript"');
  console.log('  $ x-cli search-users "elonmusk"');
  console.log('  $ x-cli user-tweets "x" --max-results 20');
  console.log('  $ x-cli tweet "1234567890" --include-author');
  console.log('');
  console.log('Configuration:');
  console.log('  Set your X API token in one of the following ways:');
  console.log('    1. Create ~/.x-cli.json: {"token": "YOUR_TOKEN"}');
  console.log('    2. Put your token in ~/my/x-token.txt');
  console.log('');
});

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

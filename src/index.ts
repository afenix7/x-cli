#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { createSearchCommand } from './commands/search.js';
import { createSearchUsersCommand } from './commands/searchUsers.js';
import { createUserTweetsCommand } from './commands/userTweets.js';
import { createTweetCommand } from './commands/tweet.js';
import { createSearchTopicsCommand } from './commands/searchTopics.js';
import { createTopicCommand } from './commands/topic.js';
import { createConfigCommand } from './commands/config.js';

// Get package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

program
  .name('x-cli')
  .description('X (Twitter) CLI 工具')
  .version(packageJson.version);

// Add commands
program.addCommand(createSearchCommand());
program.addCommand(createSearchUsersCommand());
program.addCommand(createUserTweetsCommand());
program.addCommand(createTweetCommand());
program.addCommand(createSearchTopicsCommand());
program.addCommand(createTopicCommand());
program.addCommand(createConfigCommand());

program.parse();

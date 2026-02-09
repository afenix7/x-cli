import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface Config {
  token: string;
  defaultFormat?: 'table' | 'json';
}

const CONFIG_FILE = '.x-cli.json';
const TOKEN_FILE = 'x-token.txt';

/**
 * 获取配置
 * 按以下顺序查找 token:
 1. ~/.x-cli.json 文件
 2. ~/my/x-token.txt 文件 (向后兼容)
 */
export function getConfig(): Config {
  const homeDir = homedir();
  const myDir = join(homeDir, 'my');

  // 1. 尝试从配置文件读取
  const configPath = join(homeDir, CONFIG_FILE);
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      if (config.token) {
        return config as Config;
      }
    } catch (e) {
      console.warn('Warning: Failed to parse config file');
    }
  }

  // 2. 尝试从 token 文件读取
  const tokenPath = join(myDir, TOKEN_FILE);
  if (existsSync(tokenPath)) {
    try {
      const token = readFileSync(tokenPath, 'utf-8').trim();
      if (token) {
        return { token };
      }
    } catch (e) {
      console.warn('Warning: Failed to read token file');
    }
  }

  throw new Error(
    'X API token not found. Please set your token in one of the following ways:\n' +
    '  1. Create ~/.x-cli.json with: {"token": "your_token_here"}\n' +
    '  2. Put your token in ~/my/x-token.txt'
  );
}

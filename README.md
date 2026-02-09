# X CLI

一个基于 TypeScript 的命令行工具,用于与 X (Twitter) API 交互。支持搜索推文、搜索用户、获取用户推文和查看推文详情。

## 功能

- 🔍 **搜索推文** - 搜索最近的公开推文
- 👤 **搜索用户** - 按用户名查找 X 用户
- 📝 **获取用户推文** - 查看指定用户的推文时间线
- 📄 **查看推文详情** - 获取单条推文的详细信息

## 安装

```bash
# 克隆或下载项目
cd ~/my/x-cli

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 安装到全局
npm install -g .
```

## 配置

在使用之前,你需要设置 X API Token。可以通过以下两种方式之一:

### 方式 1: 配置文件 (推荐)

在你的主目录创建 `.x-cli.json` 文件:

```json
{
  "token": "你的_X_API_Bearer_Token"
}
```

### 方式 2: Token 文件

将 Token 保存到 `~/my/x-token.txt` 文件中:

```
你的_X_API_Bearer_Token
```

## 使用

### 搜索推文

```bash
# 基本搜索
x-cli search "typescript"

# 查看更多结果
x-cli search "javascript" --max-results 50

# 输出 JSON 格式
x-cli search "nodejs" --format json

# 包含互动指标
x-cli search "programming" --include-metrics
```

### 搜索用户

```bash
# 查找用户
x-cli search-users "elonmusk"

# 输出 JSON
x-cli search-users "jack" --format json

# 包含用户指标
x-cli search-users "twitter" --include-metrics
```

### 获取用户推文

```bash
# 获取用户的推文
x-cli user-tweets "x"

# 获取更多推文
x-cli user-tweets "elonmusk" --max-results 20

# 排除回复
x-cli user-tweets "jack" --exclude-replies

# 排除转推
x-cli user-tweets "jack" --exclude-retweets

# 组合使用
x-cli user-tweets "x" --max-results 50 --exclude-replies --include-metrics
```

### 查看推文详情

```bash
# 获取推文详情
x-cli tweet "1234567890123456789"

# 包含作者信息
x-cli tweet "1234567890123456789" --include-author

# 输出 JSON
x-cli tweet "1234567890123456789" --format json
```

## 命令帮助

每个命令都支持 `--help` 选项来查看详细用法:

```bash
x-cli --help
x-cli search --help
x-cli search-users --help
x-cli user-tweets --help
x-cli tweet --help
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式 (监视文件变化)
npm run dev

# 构建
npm run build

# 运行 CLI
npm start -- search "hello"
```

## 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Commander.js** - 命令行界面框架
- **Node.js fetch** - HTTP 客户端 (原生支持)
- **X API v2** - X (Twitter) 官方 API

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request!

## 致谢

感谢 X (Twitter) 提供的 API 服务。
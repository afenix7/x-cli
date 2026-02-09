# X CLI 工具开发计划

## 项目目标
创建一个基于 TypeScript 的 CLI 工具，使用 X API (Twitter API v2) 提供以下功能：
1. 搜索 X 上的内容 ✅
2. 搜索 X 用户 ✅
3. 获取用户的推文 ✅
4. 阅读 X 上推文详情 ✅

## 技术栈
- **语言**: TypeScript 5.x
- **运行时**: Node.js 20+
- **CLI 框架**: Commander.js
- **HTTP 客户端**: 原生 fetch (Node.js 18+)
- **类型**: X API TypeScript 类型
- **构建**: tsc

## 开发阶段

### Phase 1: 项目初始化 ✅
- [x] 创建项目目录
- [x] 初始化 npm 项目
- [x] 安装依赖 (typescript, commander, @types/node)
- [x] 配置 TypeScript (tsconfig.json)
- [x] 创建项目结构
- [x] 更新 package.json 添加 scripts 和 bin
- [x] 修复 TypeScript 编译错误

### Phase 2: X API 客户端封装 ✅
- [x] 创建 X API 类型定义 (src/api/types.ts)
- [x] 创建 X API 客户端类 (src/api/client.ts)
- [x] 实现认证 (Bearer Token)
- [x] 实现搜索推文接口
- [x] 实现搜索用户接口
- [x] 实现获取用户推文接口
- [x] 实现获取推文详情接口

### Phase 3: CLI 命令实现 ✅
- [x] 实现 `x-cli search <query>` - 搜索推文
- [x] 实现 `x-cli search-users <query>` - 搜索用户
- [x] 实现 `x-cli user-tweets <username>` - 获取用户推文
- [x] 实现 `x-cli tweet <tweet-id>` - 获取推文详情
- [x] 实现配置管理 (从 ~/.x-cli.json 或 ~/my/x-token.txt 读取 token)
- [x] 实现 CLI 入口 (src/index.ts)

### Phase 4: 优化和测试 ✅
- [x] 添加错误处理和重试机制
- [x] 添加输出格式化 (表格/JSON)
- [x] 添加分页支持
- [x] 编写使用文档 (README.md)
- [x] 安装到全局 npm

## 项目结构
```
x-cli/
├── src/
│   ├── index.ts          # CLI 入口
│   ├── api/
│   │   ├── client.ts     # X API 客户端
│   │   └── types.ts      # API 类型定义
│   ├── commands/
│   │   ├── search.ts     # 搜索推文
│   │   ├── searchUsers.ts # 搜索用户
│   │   ├── userTweets.ts  # 用户推文
│   │   └── tweet.ts      # 推文详情
│   └── utils/
│       ├── config.ts     # 配置管理
│       └── format.ts     # 输出格式化
├── dist/                 # 编译输出
├── package.json
├── tsconfig.json
├── README.md
├── task_plan.md          # 任务计划
├── findings.md           # 研究笔记
└── progress.md           # 进度日志
```

## 依赖项
```json
{
  "dependencies": {
    "commander": "^14.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "typescript": "^5.x"
  }
}
```

## X API 端点参考
- 搜索推文: `GET /2/tweets/search/recent`
- 搜索用户: `GET /2/users/by/username/:username`
- 获取用户推文: `GET /2/users/:id/tweets`
- 获取推文详情: `GET /2/tweets/:id`

## 状态
- 创建日期: 2026-02-08
- 当前阶段: 全部完成 ✅
- 进度: 100% 完成

## 使用方式

```bash
# 搜索推文
x-cli search "typescript"

# 搜索用户
x-cli search-users "elonmusk"

# 获取用户推文
x-cli user-tweets "x"

# 查看推文详情
x-cli tweet "1234567890"
```

## 配置方式

```bash
# 方式 1: 配置文件
# 创建 ~/.x-cli.json
{
  "token": "你的_X_API_Bearer_Token"
}

# 方式 2: Token 文件
# 将 Token 保存到 ~/my/x-token.txt
```

# X CLI 开发研究笔记

## X API 端点参考

### 认证
- 使用 Bearer Token 认证
- Token 存储在 `~/my/x-token.txt`

### API 端点

#### 1. 搜索推文
```
GET /2/tweets/search/recent
```
参数:
- `query`: 搜索查询 (必需)
- `max_results`: 返回结果数量 (10-100, 默认10)
- `tweet.fields`: 需要返回的字段

#### 2. 搜索用户 (按用户名)
```
GET /2/users/by/username/:username
```

#### 3. 搜索用户 (按 ID)
```
GET /2/users/:id
```

#### 4. 获取用户推文
```
GET /2/users/:id/tweets
```
参数:
- `max_results`: 返回结果数量 (5-100)
- `tweet.fields`: 需要返回的字段

#### 5. 获取推文详情
```
GET /2/tweets/:id
```
参数:
- `tweet.fields`: 需要返回的字段

### 常用 tweet.fields
- `created_at`: 创建时间
- `public_metrics`: 公开指标(点赞、转发等)
- `context_annotations`: 上下文注解
- `author_id`: 作者ID

## 技术决策

### 使用原生 fetch
Node.js 18+ 已内置 fetch,无需额外安装依赖

### 使用 Commander.js
成熟的 CLI 框架,提供命令解析、帮助文档等功能

### 使用 TypeScript
类型安全,更好的 IDE 支持

## 遇到的问题

(待记录)
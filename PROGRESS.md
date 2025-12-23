# MiniCoder-CLI 开发进度报告

**最后更新**: 2025-12-23

---

## 当前阶段：阶段五 - CLI 交互体验增强 ✅ 已完成

> **2025-12-23 更新**: 新增 Chat UI 增强模块，提供 ClaudeCode 风格的聊天界面

---

## 已完成任务清单

### 1. 项目基础配置

| 任务 | 状态 | 说明 |
|------|------|------|
| 初始化 npm 项目 | ✅ | `npm init -y`，配置为 ESM 模块 |
| 安装 TypeScript | ✅ | `typescript@^5.7.0`, `@types/node@^22.0.0` |
| 创建 tsconfig.json | ✅ | strict mode, ES2022, NodeNext |
| 安装 ESLint | ✅ | `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` |
| 安装 Prettier | ✅ | `.prettierrc` 配置完成 |
| 配置构建工具 | ✅ | `tsx` 用于开发环境 |

### 2. 项目结构

```
minicoder-cli/
├── src/
│   ├── cli/
│   │   └── index.ts          # CLI 入口类 (Cli)
│   ├── commands/
│   │   ├── hello.ts          # 示例命令 (HelloCommand)
│   │   ├── init.ts           # 初始化命令 (InitCommand)
│   │   └── chat.ts           # 对话命令 (ChatCommand, AskCommand)
│   ├── core/
│   │   └── dispatcher.ts     # 命令分发器 (CommandDispatcher)
│   ├── services/
│   │   └── gemini.ts         # Gemini API 客户端
│   ├── config/
│   │   └── config.ts         # 配置管理器
│   ├── types/
│   │   └── command.ts        # Command 接口定义
│   ├── ui/                   # UI 交互模块
│   │   ├── index.ts          # 统一导出
│   │   ├── format.ts         # 颜色、符号、Markdown 渲染
│   │   ├── input.ts          # 交互式输入封装
│   │   └── spinner.ts        # 加载动画、进度条、打字机效果
│   └── index.ts              # 主入口
├── docs/
│   └── adr/                  # 架构决策记录
│       ├── 001-use-undici-for-proxy.md
│       └── 002-use-clack-ora-ui-libs.md
├── package.json              # bin: "mini"
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── CLAUDE.md                 # Claude Code 指南
├── PLAN.md                   # 开发计划
├── PROGRESS.md               # 开发进度
├── README.md                 # 项目说明
└── .gitignore
```

### 3. 核心框架

| 组件 | 文件 | 说明 |
|------|------|------|
| `Cli` | `src/cli/index.ts` | 命令行入口，处理参数解析和 help |
| `CommandDispatcher` | `src/core/dispatcher.ts` | 命令注册和分发 |
| `Command` 接口 | `src/types/command.ts` | 命令规范 |

### 4. 配置管理

| 组件 | 文件 | 说明 |
|------|------|------|
| `ConfigManager` | `src/config/config.ts` | 配置加载、保存、读取 |
| 用户配置 | `~/.minicoderrc.json` | 用户级配置 |
| 项目配置 | `.minicoderrc.json` | 项目级配置 |
| 环境变量 | `MINICODER_API_KEY` | API Key 环境变量 |

### 5. Gemini API 层

| 组件 | 文件 | 说明 |
|------|------|------|
| `GeminiClient` | `src/services/gemini.ts` | API 请求封装 |
| 认证 | - | 从配置读取 API Key |
| 错误处理 | - | 网络错误、API 错误、配置错误 |

### 6. 核心命令

| 命令 | 文件 | 说明 |
|------|------|------|
| `mini init` | `src/commands/init.ts` | 初始化配置，测试 API 连接 |
| `mini chat` | `src/commands/chat.ts` | 交互式对话 (Ctrl+C 退出) |
| `mini ask` | `src/commands/chat.ts` | 单次问答 |

### 7. 代理支持

| 组件 | 文件 | 说明 |
|------|------|------|
| `undici` | `package.json` | HTTP 客户端，支持代理 |
| `ProxyAgent` | `src/services/gemini.ts` | 代理配置 |
| `MINICODER_PROXY` | 环境变量 | 代理地址配置 |

**配置方式**：
```bash
# 环境变量
export MINICODER_PROXY="http://127.0.0.1:7890"

# 或配置文件 (.minicoderrc.json)
{ "proxy": "http://127.0.0.1:7890" }
```

**ADR**: [001-use-undici-for-proxy.md](./docs/adr/001-use-undici-for-proxy.md)

### 8. CLI 交互体验

| 组件/库 | 文件 | 说明 |
|---------|------|------|
| @clack/prompts | `package.json` | 交互式输入（单选、确认、文本输入） |
| ora | `package.json` | 加载动画 spinner |
| figures | `package.json` | 跨平台符号自动回退 |
| boxen | `package.json` | 终端内容盒子 |
| chalk | `package.json` | 颜色输出 |
| marked + highlight.js | `package.json` | Markdown 渲染与代码高亮 |
| `format.ts` | `src/ui/format.ts` | 颜色、符号、Markdown 渲染 |
| `input.ts` | `src/ui/input.ts` | 交互式输入封装 |
| `spinner.ts` | `src/ui/spinner.ts` | 加载动画、进度条、打字机效果 |

**增强的命令**：
- `mini init` - 交互式配置向导，带模型选择、代理配置、API 测试
- `mini chat` - 欢迎界面、加载动画、Markdown 响应、命令帮助
- `mini ask` - 加载动画、Markdown 输出

**跨平台符号支持**：
```typescript
// Windows 下自动回退为 ASCII
// ✓ → [OK]
// ✗ → [X]
// →  → ->
```

**ADR**: [002-use-clack-ora-ui-libs.md](./docs/adr/002-use-clack-ora-ui-libs.md)

### 9. Chat UI 交互体验增强 (新增)

| 组件/功能 | 文件 | 说明 |
|-----------|------|------|
| `chat-ui.ts` | `src/ui/chat-ui.ts` | 新增：Chat UI 渲染模块 |
| `printWelcome()` | `chat-ui.ts` | 欢迎界面 (带边框、命令提示) |
| `printUserMessage()` | `chat-ui.ts` | 用户消息气泡 (青色) |
| `printAiMessage()` | `chat-ui.ts` | AI 消息气泡 (绿色 + 思考动画) |
| `printHelpPanel()` | `chat-ui.ts` | 帮助面板 (框选样式) |
| `printHistory()` | `chat-ui.ts` | 对话历史预览 |
| `printGoodbye()` | `chat-ui.ts` | 退出提示 |
| `printCleared()` | `chat-ui.ts` | 清空成功反馈 |
| `printChatError()` | `chat-ui.ts` | 错误提示 |
| `chatInput()` | `chat-ui.ts` | @clack/prompts.text 封装 |

**消息气泡示例**：
```
╭─ 用户 ──────────────────────
│  你好，我想请教一个问题...
╰──────────────────────────

╭─ AI ──────────────────────
│  你好！很高兴帮助你...
╰──────────────────────────
```

**支持命令**：
- `/exit` - 退出对话
- `/quit` - 退出对话
- `/clear` - 清空对话历史
- `/help` - 显示帮助面板
- `/history` - 查看对话历史

**ADR**: [003-chat-ui-enhancement.md](./docs/adr/003-chat-ui-enhancement.md)

### 10. 验证结果

| 命令 | 状态 |
|------|------|
| `npm run build` | ✅ 编译成功 |
| `npm run typecheck` | ✅ 类型检查通过 |
| `npm run lint` | ✅ 无错误 |
| `npm run fmt` | ✅ 格式化完成 |
| `mini --help` | ✅ 显示帮助信息 |

---

## 下一步计划

### 阶段六：代码生成命令 (P1)

| 命令 | 功能 | 状态 |
|------|------|------|
| `mini code` | 代码生成 | 待实现 |

### 阶段七：流式输出 (P2)

| 功能 | 说明 | 状态 |
|------|------|------|
| 流式响应 | Gemini API 流式输出 | 待实现 |
| 打字机效果 | AI 响应边接收边显示 | 待实现 |

### 阶段八：多行输入优化 (P2)

| 功能 | 说明 | 状态 |
|------|------|------|
| 换行输入 | `\` + Enter 换行 | 待实现 |
| 自动检测 | 智能识别多行意图 | 待实现 |

### 阶段九：写作与笔记 (P2)

| 命令 | 功能 | 状态 |
|------|------|------|
| `mini write` | 写作辅助 | 待实现 |
| `mini note` | 思考笔记 | 待实现 |

---

## 后续优化计划

### Chat UI 优化 (P1)

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 多行输入 | 支持 `\` + Enter 换行 | P1 |
| 命令补全 | Tab 自动补全命令 | P1 |
| 终端自适应 | 动态调整气泡宽度 | P2 |
| 快捷键支持 | 上箭头调历史 | P2 |

---

## 常用命令速查

```bash
# 开发
npm run dev -- <command>     # 使用 tsx 运行

# 构建与检查
npm run build                # 编译 TypeScript
npm run typecheck            # 仅类型检查
npm run lint                 # ESLint
npm run fmt                  # Prettier 格式化

# 使用
mini --help                  # 显示帮助
mini init                    # 初始化配置
mini chat                    # 交互式对话
mini ask "你好"              # 单次问答
mini -h                      # 显示帮助

# 全局安装
npm install -g .
mini --help
```

---

## 项目哲学

始终遵循 `CLAUDE.md` 中定义的三原则：

1. **第一性原理** - 降低认知负荷，降低系统熵增
2. **辩证法** - 灵活性与复杂度的动态平衡
3. **实事求是** - 匹配当前业务阶段

**负面约束**：
- 禁止炫技
- 禁止硬编码
- 禁止早熟架构

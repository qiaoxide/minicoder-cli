# 003 - Chat UI 交互体验增强

## 状态

已采纳

## 背景

`mini chat` 命令作为核心交互功能，需要提供类似 ClaudeCode 的生动聊天体验。当前 UI 交互存在以下改进空间：

- 消息展示缺乏视觉层次感
- 用户输入与 AI 响应难以区分
- 缺乏命令帮助提示
- 退出/清空等操作反馈不够醒目

## 决策

### 新增 UI 模块

创建 `src/ui/chat-ui.ts` 专门处理聊天场景的 UI 渲染：

```
src/ui/
├── chat-ui.ts         # 新增：Chat UI 渲染模块
├── format.ts          # 颜色、符号、Markdown 渲染
├── input.ts           # 交互式输入封装
└── spinner.ts         # 加载动画、进度条、打字机效果
```

### 聊天消息气泡设计

```
╭─ 用户 ──────────────────────
│  你好，我想请教一个问题...
╰──────────────────────────

╭─ AI ──────────────────────
│  你好！很高兴帮助你...
╰──────────────────────────
```

### 功能列表

| 功能 | 函数 | 说明 |
|------|------|------|
| 欢迎界面 | `printWelcome()` | 带边框、命令提示 |
| 用户消息 | `printUserMessage()` | 青色气泡 |
| AI 消息 | `printAiMessage()` | 绿色气泡 + 思考动画 |
| 帮助面板 | `printHelpPanel()` | 框选样式 |
| 历史记录 | `printHistory()` | 对话历史预览 |
| 退出提示 | `printGoodbye()` | 带边框退出信息 |
| 清空提示 | `printCleared()` | 成功状态反馈 |
| 错误提示 | `printChatError()` | 红色错误气泡 |
| 聊天输入 | `chatInput()` | @clack/prompts.text 封装 |

### 依赖关系

```typescript
// chat.ts 使用新的 chat-ui 模块
import {
  chatInput,
  printUserMessage,
  printAiMessage,
  printWelcome,
  printHelpPanel,
  printHistory,
  printGoodbye,
  printCleared,
  printChatError,
} from '../ui/chat-ui.js';
```

### 命令支持

| 命令 | 说明 |
|------|------|
| `/exit` | 退出对话 |
| `/quit` | 退出对话 |
| `/clear` | 清空对话历史 |
| `/help` | 显示帮助面板 |
| `/history` | 查看对话历史 |

## 后果

### 正面

- 聊天界面更生动，视觉层次清晰
- 用户与 AI 消息易于区分
- 帮助信息随时可查
- 操作反馈更加明确

### 负面

- 增加约 100 行代码
- 气泡边框在极窄终端可能显示不佳

## 后续优化

| 优化项 | 说明 | 优先级 |
|--------|------|--------|
| 多行输入 | 支持 `\` + Enter 换行 | P1 |
| 流式打字 | AI 响应边接收边显示 | P1 |
| 代码块优化 | 更好的代码显示效果 | P2 |
| 终端自适应 | 动态调整边框宽度 | P2 |

## 引用

- 现有 ADR: [002-use-clack-ora-ui-libs.md](./002-use-clack-ora-ui-libs.md)
- Claude Code CLI 交互设计参考

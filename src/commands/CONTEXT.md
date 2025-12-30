# Commands 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> 命令实现层 - 业务逻辑入口

*   **负责**:
    *   实现具体的 CLI 命令
    *   处理用户交互
    *   调用 services 和 ui 模块
*   **不负责**:
    *   命令注册（由 cli 模块负责）
    *   参数解析（由 cli 模块负责）
    *   API 调用细节（由 services 模块负责）

## 2. 关键文件索引 (Key Files)
*   `chat.ts`: `ChatCommand`（交互模式）和 `AskCommand`（单次问答）
*   `init.ts`: `InitCommand` 配置初始化
*   `hello.ts`: 示例命令模板

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `CommandDispatcher` (core 模块)
*   **下游 (Calls to)**:
    *   `GeminiClient` (services/gemini.ts)
    *   `getConfig()` (config/config.ts)
    *   `ui/print/*`: 消息输出（UserMessage, AiMessage 等）
    *   `ui/components/*`: 交互组件（chatInput, Dots, LoadingDone 等）
*   **数据流**: `execute(args)` -> 获取配置 -> Dots Loading -> 调用 API -> LoadingDone -> 渲染输出

## 4. 开发规约 (Rules & Constraints)
1.  **错误处理**: 使用 `try/catch` 捕获 API 错误，用户友好提示
2.  **消息历史**: chat 命令需维护 `ChatMessage[]` 数组
3.  **命令前缀**: 聊天模式中 `/` 开头的字符串视为内部命令
4.  **Loading 动画**: AI 响应期间需使用 `Dots('思考中...')` 显示 loading，响应后调用 `LoadingDone(spinner)`

## 5. 已知问题与雷区 (Gotchas)
*   **坑**: `ChatCommand` 需在 AI 响应失败时移除用户消息 (`messages.pop()`)

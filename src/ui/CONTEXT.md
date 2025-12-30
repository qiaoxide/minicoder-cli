# UI 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> 用户界面层 - 终端渲染与用户交互

*   **负责**:
    *   终端输出格式化（颜色、符号、Markdown）
    *   用户输入获取（文本、选择、确认）
    *   交互式组件（Loading、Progress、MessageBox）
    *   聊天界面打印（消息、帮助、历史）
*   **不负责**:
    *   业务逻辑（由 commands 模块负责）
    *   命令注册（由 cli 模块负责）

## 2. 关键文件索引 (Key Files)
*   `components/index.ts`: 基础组件导出
    *   `base.ts`: `colors`, `symbols`, `renderMarkdown`, `highlightCode`, `boxContent`
    *   `prompt.ts`: `text`, `password`, `select`, `confirm` 输入函数
    *   `Loading.ts`: Loading 动画组件
    *   `MessageBox.ts`: 消息框
*   `print/index.ts`: 聊天界面输出
    *   `ChatInput.ts`: `chatInput()` 聊天输入
    *   `AiMessage.ts`: AI 消息渲染（支持 Markdown 和代码高亮）
    *   `UserMessage.ts`: 用户消息渲染
    *   `HelpPanel.ts`: 帮助面板

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `commands/*` 模块
*   **下游 (Calls to)**: `chalk`, `marked`, `highlight.js` 等依赖包
*   **数据流**: 命令调用 -> 获取输入/渲染输出 -> 控制台显示

## 4. 开发规约 (Rules & Constraints)
1.  **跨平台兼容**: 使用 `figures` 包自动适配 Windows/Linux/macOS 符号
2.  **Markdown 渲染**: `AiMessage` 调用 `renderMarkdown()` 和 `highlightCode()` 渲染代码块
3.  **输入函数**: 聊天输入使用 `chatInput()`，配置输入使用 `text/password/select/confirm`

## 5. 已知问题与雷区 (Gotchas)
*   **坑**: Windows 终端对 ANSI 转义序列支持可能有限，已使用 `figures` 回退
*   **坑**: `highlightCode()` 返回 HTML，需在非 Ink 环境手动处理

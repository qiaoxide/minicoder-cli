# Services 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> API 服务层 - Gemini API 调用封装

*   **负责**:
    *   Gemini REST API 调用
    *   认证与代理支持
    *   错误处理与重试
*   **不负责**:
    *   配置管理（由 config 模块负责）
    *   UI 输出（由 ui 模块负责）

## 2. 关键文件索引 (Key Files)
*   `gemini.ts`: `GeminiClient` 类和 `createGeminiClient()` 工厂函数

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `commands/*` 模块
*   **下游 (Calls to)**: Google Generative Language API
*   **数据流**: `generate(prompt)` / `chat(messages)` -> HTTP POST -> 返回文本

## 4. 开发规约 (Rules & Constraints)
1.  **代理支持**: 使用 `undici` 的 `ProxyAgent`（Node.js 原生 fetch 不支持代理）
2.  **错误处理**: 自定义 `GeminiApiError` 分类处理网络错误和 API 错误
3.  **模型配置**: 优先使用构造函数参数，其次读取配置，最后默认为 `gemini-pro`
4.  **API 版本**: 当前使用 `v1beta` 端点

## 5. 已知问题与雷区 (Gotchas)
*   **坑**: 响应为空时需检查 `promptFeedback.blockReason`（内容被安全过滤器阻止）
*   **坑**: `fetch` 在 Node.js 18 中不支持代理，必须用 `undici`

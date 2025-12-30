# Config 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> 配置管理层 - 加载、读取、保存配置

*   **负责**:
    *   加载环境变量
    *   读取用户/项目配置文件
    *   提供配置获取/设置接口
    *   配置持久化
*   **不负责**:
    *   命令行参数解析（由 cli 模块负责）

## 2. 关键文件索引 (Key Files)
*   `config.ts`: `ConfigManager` 单例类和 `getConfig()` 便捷函数

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `commands/*` 模块
*   **下游 (Calls to)**: Node.js `fs` 模块读写配置文件
*   **数据流**: 构造函数自动加载 -> `get(key)` 读取 -> `saveToUser()/saveToProject()` 持久化

## 4. 开发规约 (Rules & Constraints)
1.  **单例模式**: 使用 `getInstance()` 获取实例，禁止直接 `new ConfigManager()`
2.  **配置优先级**: 环境变量 > 用户配置 > 项目配置（覆盖关系）
3.  **文件路径**:
    *   用户配置: `~/.minicoderrc.json`
    *   项目配置: `.minicoderrc.json`
4.  **错误处理**: 配置文件读取失败时仅 `console.warn`，不影响程序运行

## 5. 已知问题与雷区 (Gotchas)
*   **Hack**: `hasApiKey()` 检查时需注意 `apiKey` 可能为空字符串

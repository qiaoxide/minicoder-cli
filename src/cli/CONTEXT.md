# CLI 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> CLI 入口框架 - 处理命令注册、参数解析与主循环

*   **负责**:
    *   命令注册与初始化
    *   命令行参数解析
    *   帮助信息输出
    *   命令分发调度
*   **不负责**:
    *   具体命令的业务逻辑（由 commands 模块负责）
    *   配置管理（由 config 模块负责）

## 2. 关键文件索引 (Key Files)
*   `index.ts`: CLI 入口类，负责注册命令和运行解析

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `src/index.ts` 作为主入口
*   **下游 (Calls to)**: `CommandDispatcher` (core 模块)
*   **数据流**: `index.ts` -> `Cli` -> `CommandDispatcher` -> `Command.execute()`

## 4. 开发规约 (Rules & Constraints)
1.  **参数解析**: 支持 `--option value` 和 `-o` 两种格式，位置参数通过 `_` 数组传递
2.  **帮助信息**: 自动从已注册命令中提取 name 和 description 生成
3.  **命令注册**: 使用 `cli.register(new XxxCommand())` 注册命令

## 5. 已知问题与雷区 (Gotchas)
*   无

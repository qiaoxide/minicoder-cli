# Core 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> 命令分发核心 - 管理命令注册与执行

*   **负责**:
    *   命令注册与存储
    *   命令名称/别名解析
    *   命令执行调度
*   **不负责**:
    *   命令参数解析（由 cli 模块负责）
    *   具体业务逻辑（由 commands 模块负责）

## 2. 关键文件索引 (Key Files)
*   `dispatcher.ts`: `CommandDispatcher` 类，命令注册与分发中心

## 3. 数据流与依赖 (Architecture)
*   **上游 (Calls from)**: `cli/index.ts` 调用 `dispatch()`
*   **下游 (Calls to)**: 具体 `Command` 实现类
*   **数据流**: `dispatch(name, args)` -> 查找 Command -> `command.execute(args)`

## 4. 开发规约 (Rules & Constraints)
1.  **别名支持**: 注册时自动将 alias 也添加到命令表中
2.  **错误处理**: 命令不存在时抛出 `Error`（非 `Result<T>` 模式）
3.  **单例模式**: `CommandDispatcher` 无需单例，由 `Cli` 管理实例

## 5. 已知问题与雷区 (Gotchas)
*   无

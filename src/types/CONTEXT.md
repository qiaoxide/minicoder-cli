# Types 模块上下文文档 (AI Context)

## 1. 核心职责 (Scope)
> 类型定义中心 - 所有接口与类型声明

*   **负责**:
    *   `Command` 接口定义
    *   `CommandArgs` 参数类型
    *   命令参数描述类型
*   **不负责**:
    *   具体类型实现
    *   业务逻辑

## 2. 关键文件索引 (Key Files)
*   `command.ts`: 核心命令接口定义

## 3. 开发规约 (Rules & Constraints)
1.  **修改前必读**: 任何业务逻辑修改前先查看此文件
2.  **接口稳定**: `Command` 接口变更会影响所有命令实现

## 4. 已知问题与雷区 (Gotchas)
*   无

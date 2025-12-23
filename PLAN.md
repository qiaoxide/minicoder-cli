# MiniCoder-CLI 开发计划

## 项目概述

一个类似 geminicli 和 claudeCode 的命令行工具，用于编程、写作和思考笔记记录。采用 Node.js + TypeScript 技术栈，初期使用 Gemini API 作为底层模型。

## 核心哲学

开发过程中始终遵循：
- **第一性原理**：降低认知负荷，降低系统熵增
- **辩证法**：灵活性与复杂度的动态平衡
- **实事求是**：匹配当前业务阶段和团队能力

---

## 阶段一：项目初始化

### 1.1 基础配置

| 任务 | 说明 |
|------|------|
| 初始化 npm | `npm init -y` |
| 安装 TypeScript | `npm i -D typescript @types/node` |
| 配置 tsconfig.json | 严格模式，ESNext 目标 |
| 配置 ESLint + Prettier | 代码规范 |

### 1.2 构建工具

| 任务 | 说明 |
|------|------|
| 选择构建工具 | tsx 或 ts-node 或 esbuild |
| 配置构建脚本 | 入口文件 → 打包产物 |
| 配置类型声明生成 | 用于 CLI 全局安装 |

---

## 阶段二：核心架构设计

### 2.1 目录结构

```
src/
├── cli/           # 命令行入口
├── commands/      # 各命令实现
├── core/          # 核心逻辑
├── services/      # API 服务层
├── utils/         # 工具函数
├── types/         # 类型定义
└── config/        # 配置文件
```

### 2.2 核心组件

| 组件 | 职责 |
|------|------|
| CommandDispatcher | 命令分发 |
| ConfigManager | 配置管理 |
| ApiClient | Gemini API 调用 |
| SessionManager | 会话状态管理 |

---

## 阶段三：API 层实现

### 3.1 Gemini API 集成

| 任务 | 优先级 |
|------|--------|
| API Key 配置 | P0 |
| 请求封装 | P0 |
| 流式响应支持 | P1 |
| 重试机制 | P2 |
| 错误处理 | P0 |

### 3.2 Prompt 管理

| 任务 | 优先级 |
|------|--------|
| System Prompt 模板 | P0 |
| Prompt 变量替换 | P0 |
| 历史上下文管理 | P1 |

---

## 阶段四：核心命令实现

### 4.1 基础命令

| 命令 | 功能 | 优先级 |
|------|------|--------|
| `mini init` | 初始化项目 | P0 |
| `mini chat` | 交互式对话 | P0 |
| `mini code` | 代码生成 | P0 |
| `mini write` | 写作辅助 | P1 |
| `mini note` | 思考笔记 | P2 |

### 4.2 全局参数

| 参数 | 说明 |
|------|------|
| `--model` | 指定模型 |
| `--config` | 指定配置文件 |
| `--verbose` | 详细输出 |

---

## 阶段五：CLI 交互体验

### 5.1 UI 组件库

| 库 | 用途 |
|------|------|
| @clack/prompts | 交互式输入（单选、确认、密码输入） |
| ora | 加载动画 spinner |
| figures | 跨平台符号自动回退 |
| boxen | 终端内容盒子 |
| chalk | 颜色输出 |
| marked + highlight.js | Markdown 渲染与代码高亮 |

### 5.2 UI 模块结构

```
src/ui/
├── format.ts         # 颜色、符号、Markdown 渲染
├── input.ts          # 交互式输入封装
├── spinner.ts        # 加载动画、进度条、打字机效果
└── index.ts          # 统一导出
```

### 5.3 交互功能

| 功能 | 说明 |
|------|------|
| 彩色输出 | 状态符号、错误/成功提示 |
| 交互输入 | 单选列表、确认提示、密码输入 |
| 加载动画 | API 调用时的 spinner |
| 打字机效果 | 模拟自然对话的逐字输出 |
| 跨平台兼容 | Windows 下符号自动回退 |

### 5.4 Chat UI 交互设计 (新增)

ClaudeCode 风格的聊天界面设计：

| 功能 | 说明 |
|------|------|
| 消息气泡 | 用户/AI 消息分色显示 (青/绿) |
| 欢迎界面 | 带边框、命令提示 |
| 帮助面板 | 框选样式展示命令 |
| 命令支持 | /exit, /quit, /clear, /help, /history |
| 操作反馈 | 清空、退出等状态提示 |

**UI 模块结构**：
```
src/ui/
├── chat-ui.ts         # 聊天专用 UI (新增)
├── format.ts          # 颜色、符号、Markdown 渲染
├── input.ts           # 交互式输入封装
├── spinner.ts         # 加载动画、进度条、打字机效果
└── index.ts           # 统一导出
```

**参考**: [ADR-003-chat-ui-enhancement.md](./docs/adr/003-chat-ui-enhancement.md)

---

## 阶段六：测试与质量

### 6.1 测试框架

| 类型 | 工具选择 |
|------|----------|
| 单元测试 | Vitest |
| E2E 测试 | 自研脚本 |
| 类型检查 | tsc --noEmit |

### 6.2 测试覆盖

| 目标 | 说明 |
|------|------|
| 核心逻辑 | SessionManager、ConfigManager |
| API 层 | 请求封装、错误处理 |
| CLI 命令 | 各命令的正常/异常流程 |

---

## 阶段七：文档与发布

### 7.1 文档

| 文档 | 说明 |
|------|------|
| README.md | 使用说明 |
| CONTRIBUTING.md | 贡献指南 |
| CHANGELOG.md | 版本变更 |

### 6.2 发布准备

| 任务 | 说明 |
|------|------|
| 版本号规范 | Semantic Versioning |
| 发布脚本 | npm publish |
| npm 描述 | 清晰的功能说明 |

---

## 优先级排序

### 当前阶段 (P0 - 必须)

1. 项目初始化 (npm, TypeScript, ESLint)
2. 基础目录结构
3. Gemini API 客户端
4. `mini chat` 基础命令
5. 配置管理
6. CLI 交互体验增强

### 后续阶段 (P1 - 应该)

1. `mini code` 代码生成
2. 流式输出支持
3. 单元测试

### 规划阶段 (P2 - 可以)

1. `mini write` 写作辅助
2. `mini note` 思考笔记
3. 插件系统
4. 多模型支持

---

## 注意事项

- 遵循 YAGNI 原则，不做过度设计
- 保持代码简洁，避免炫技
- 每次提交前确保测试通过
- 配置与代码分离，支持用户自定义

# MiniCoder CLI

一个类似 ClaudeCode 的命令行工具，用于编程、写作和思考笔记。采用 Node.js + TypeScript 技术栈， Gemini API 驱动。

## 特性

- **交互式对话** - ClaudeCode 风格的聊天界面，气泡式消息展示
- **代码高亮** - Markdown 渲染 + 代码语法高亮
- **打字机效果** - AI 响应逐字输出，模拟自然对话
- **丰富命令** - 支持对话历史、清空、帮助等命令
- **跨平台** - Windows/Linux/macOS 符号自动回退

## 快速开始

### 环境要求

- Node.js 18+

### 安装

```bash
# 开发模式运行
npm run dev -- chat

# 构建后全局安装
npm run build
npm install -g .
mini chat
```

## 命令

| 命令 | 说明 |
|------|------|
| `mini init` | 初始化配置，测试 API 连接 |
| `mini chat` | 交互式对话模式 |
| `mini ask "问题"` | 单次问答 |
| `mini --help` | 显示帮助信息 |

### 聊天命令

在 `mini chat` 模式中可使用以下命令：

| 命令 | 说明 |
|------|------|
| `/exit` | 退出对话 |
| `/quit` | 退出对话 |
| `/clear` | 清空对话历史 |
| `/help` | 显示帮助面板 |
| `/history` | 查看对话历史 |

## 使用示例

```bash
# 初始化配置
mini init

# 交互式对话
mini chat
# > 你: 你好！
# > AI: 你好！很高兴见到你...

# 单次问答
mini ask "用 Python 实现快速排序"
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 使用 tsx 开发运行 |
| `npm run build` | 编译 TypeScript |
| `npm run typecheck` | 仅类型检查 |
| `npm run lint` | 运行 ESLint |
| `npm run fmt` | Prettier 格式化 |

## 项目结构

```
minicoder-cli/
├── src/
│   ├── cli/           # CLI 入口
│   ├── commands/      # 命令实现
│   ├── core/          # 核心框架
│   ├── services/      # API 服务
│   ├── ui/            # UI 组件 (新增)
│   │   ├── chat-ui.ts # 聊天界面
│   │   ├── format.ts  # 颜色/符号/Markdown
│   │   ├── input.ts   # 交互输入
│   │   └── spinner.ts # 动画效果
│   ├── config/        # 配置管理
│   ├── types/         # 类型定义
│   └── index.ts       # 主入口
├── docs/
│   └── adr/           # 架构决策记录
├── PLAN.md            # 开发计划
└── PROGRESS.md        # 开发进度
```


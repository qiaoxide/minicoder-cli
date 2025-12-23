# 002 - 使用 clack + ora + figures + boxen 实现 CLI 交互体验

## 状态

已采纳

## 背景

CLI 工具需要更好的用户交互体验，包括：
- 交互式输入（选择、确认、密码输入）
- 加载动画和进度反馈
- 彩色输出和格式化显示
- 跨平台兼容性（Windows/Linux/macOS）

## 决策

使用以下库组合实现 CLI 交互体验：

| 库 | 用途 | 版本 |
|---|------|------|
| [@clack/prompts](https://github.com/natemoo-re/clack) | 交互式输入（单选、确认、文本输入） | ^0.11.0 |
| [ora](https://github.com/sindresorhus/ora) | 加载动画 spinner | ^9.0.0 |
| [figures](https://github.com/sindresorhus/figures) | 跨平台符号自动回退 | ^7.0.0 |
| [boxen](https://github.com/sindresorhus/boxen) | 终端内容盒子 | ^7.1.0 |
| [chalk](https://github.com/chalk/chalk) | 颜色输出 | ^5.4.0 |
| [marked](https://github.com/markedjs/marked) | Markdown 渲染 | ^15.0.0 |
| [highlight.js](https://github.com/highlightjs/highlight.js) | 代码语法高亮 | ^11.10.0 |

### 代码结构

```
src/ui/
├── index.ts          # 统一导出
├── format.ts         # 颜色、符号、Markdown 渲染
├── input.ts          # 交互式输入封装
└── spinner.ts        # 加载动画、进度条、打字机效果
```

### 使用示例

```typescript
import {
  colors,
  symbols,
  printHeader,
  printSuccess,
  boxContent,
} from './ui/format.js';
import {
  singleSelect,
  confirmAction,
  textInput,
} from './ui/input.js';
import {
  startLoading,
  stopSuccess,
  typewriter,
} from './ui/spinner.js';

// 打印带颜色的消息
printSuccess('操作成功');

// 交互式选择
const model = await singleSelect('选择模型', [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
]);

// 加载动画
const loading = startLoading('处理中...');
await someAsyncTask();
stopSuccess(loading, '完成');

// 打字机效果输出
await typewriter('Hello World!');
```

### 备选方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| clack + ora + figures | 现代化、TypeScript 支持、跨平台 | 依赖较多 |
| inquirer | 功能全面、历史悠久 | 体积大、API 较旧 |
| prompts + ora | 轻量、无依赖 | 功能较少 |
| 原生实现 | 无额外依赖 | 开发成本高、兼容性差 |

## 后果

### 正面
- 提供丰富的交互组件，提升用户体验
- 跨平台符号支持，Windows 下自动回退
- 打字机效果模拟自然对话感
- 成熟的库，稳定性和兼容性有保障

### 负面
- 增加 7 个依赖（约 500KB）
- 需要处理异步渲染的兼容性问题

## 引用

- clack 文档: https://clack.docs.natemoo.re/
- ora 文档: https://github.com/sindresorhus/ora
- figures 文档: https://github.com/sindresorhus/figures
- boxen 文档: https://github.com/sindresorhus/boxen

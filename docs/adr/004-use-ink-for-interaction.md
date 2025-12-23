# 004 - 使用 Ink + React 实现 CLI 交互体验

## 状态

已采纳

## 日期

2025-12-23

## 背景

随着项目发展，需要更灵活的终端 UI 组件化能力。原有使用 `@clack/prompts` 的方案虽然轻量，但在复杂交互场景下扩展性有限。

## 决策

采用 **Ink + React** 方案替代 `@clack/prompts`：

| 库 | 用途 | 版本 |
|---|------|------|
| [Ink](https://github.com/vadimdemedes/ink) | React 终端 UI 框架 | ^6.6.0 |
| [ink-select-input](https://github.com/vadimdemedes/ink-select-input) | 列表选择组件 | ^6.2.0 |
| [ink-text-input](https://github.com/vadimdemedes/ink-text-input) | 文本输入组件 | ^6.0.0 |
| [React](https://github.com/facebook/react) | UI 组件库 | ^19.2.0 |

### 代码结构

```
src/ui/components/
├── index.ts      # 统一导出
├── TextInput.tsx # 文本输入组件 (ink-text-input 封装)
├── Select.tsx    # 选择组件 (ink-select-input 封装)
├── Confirm.tsx   # 确认组件
└── render.tsx    # 渲染工具
```

### 核心 API

```typescript
// 文本输入
import { inkTextInput } from './ui/components/index.js';
const name = await inkTextInput('请输入名字', { placeholder: '张三' });

// 单选
import { inkSelect } from './ui/components/index.js';
const model = await inkSelect('选择模型', [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
]);

// 多选
import { inkMultiSelect } from './ui/components/index.js';
const selected = await inkMultiSelect('选择选项', options);

// 确认
import { inkConfirm } from './ui/components/index.js';
const confirmed = await inkConfirm('确认执行？');
```

### 与 input.ts 的集成

原有 `input.ts` 保持接口不变，内部实现改为使用 Ink 组件：

```typescript
export async function textInput(message: string, options?: {...}): Promise<string | null> {
  return inkTextInput(message, options);
}

export async function singleSelect<T>(message: string, options: {...}): Promise<T | null> {
  return inkSelect(message, options);
}
```

### API 变更说明

| 原 @clack/prompts | 新 Ink 方案 | 说明 |
|-------------------|-------------|------|
| `isCancel(result)` | `result === null` | 返回 null 表示取消 |
| `intro()` | `console.log()` | 直接打印 |
| `outro()` | `console.log()` | 直接打印 |
| `cancel()` | `console.log()` | 直接打印 |

## 备选方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| Ink + React | 组件化强、扩展性好、React 生态 | 需要学习 React、依赖较大 |
| @clack/prompts | 轻量、函数式 API | 扩展性有限 |
| inquirer | 功能全面 | 体积大、API 较旧 |

## 后果

### 正面
- React 组件化开发，代码复用性更强
- 可使用 React Hooks 管理状态
- 丰富的 React 生态系统
- 更灵活的 UI 组合能力

### 负面
- 增加 React 依赖（约 150KB）
- 需要配置 JSX 编译 (`tsconfig.json` `"jsx": "react-jsx"`)
- 需要处理动态导入以避免打包问题

## 迁移记录

| 时间 | 操作 |
|------|------|
| 2025-12-23 | 从 @clack/prompts 迁移至 Ink + React |

## 引用

- Ink 文档: https://github.com/vadimdemedes/ink
- ink-select-input: https://github.com/vadimdemedes/ink-select-input
- ink-text-input: https://github.com/vadimdemedes/ink-text-input

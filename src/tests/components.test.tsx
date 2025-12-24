/**
 * Ink 交互组件测试 - 测试 inkTextInput, inkSelect, inkConfirm
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { render, cleanup } from 'ink-testing-library';

// ============== TextInput 组件测试 ==============

function SimpleTextInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Box flexDirection="column">
      <Text>❯ 输入消息</Text>
      <TextInput value={value} onChange={onChange} onSubmit={onSubmit} placeholder="占位符" />
    </Box>
  );
}

describe('inkTextInput (SimpleTextInput)', () => {
  it('should render input with label', () => {
    const { lastFrame } = render(
      <SimpleTextInput value="" onChange={() => {}} onSubmit={() => {}} />
    );

    expect(lastFrame()).toContain('❯ 输入消息');
  });

  it('should show placeholder when empty', () => {
    const { lastFrame } = render(
      <SimpleTextInput value="" onChange={() => {}} onSubmit={() => {}} />
    );

    expect(lastFrame()).toContain('占位符');
  });

  it('should display input value', () => {
    const { lastFrame } = render(
      <SimpleTextInput value="hello" onChange={() => {}} onSubmit={() => {}} />
    );

    expect(lastFrame()).toContain('hello');
  });
});

// ============== Select 组件测试 ==============

interface SelectItem {
  label: string;
  value: string;
}

function SimpleSelect({
  items,
  onSelect,
}: {
  items: SelectItem[];
  onSelect: (item: SelectItem) => void;
}) {
  return (
    <Box flexDirection="column">
      <Text>❯ 请选择</Text>
      <SelectInput items={items} onSelect={onSelect} />
    </Box>
  );
}

describe('inkSelect (SimpleSelect)', () => {
  const items: SelectItem[] = [
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' },
    { label: '选项 C', value: 'c' },
  ];

  it('should render select with label', () => {
    const { lastFrame } = render(<SimpleSelect items={items} onSelect={() => {}} />);

    expect(lastFrame()).toContain('❯ 请选择');
  });

  it('should render all options', () => {
    const { lastFrame } = render(<SimpleSelect items={items} onSelect={() => {}} />);

    expect(lastFrame()).toContain('选项 A');
    expect(lastFrame()).toContain('选项 B');
    expect(lastFrame()).toContain('选项 C');
  });

  it('should show current selection indicator', () => {
    const { lastFrame } = render(<SimpleSelect items={items} onSelect={() => {}} />);

    // ink-select-input 使用 ❯ 作为选中标记
    expect(lastFrame()).toContain('❯');
    expect(lastFrame()).toContain('选项 A'); // 第一项被选中
  });
});

// ============== 组合测试 ==============

describe('Ink 组件组合使用', () => {
  it('should render multiple components', () => {
    const { lastFrame } = render(
      <Box flexDirection="column">
        <Text bold>标题</Text>
        <Text>内容文本</Text>
        <Text color="green">绿色文本</Text>
      </Box>
    );

    const frame = lastFrame();
    expect(frame).toContain('标题');
    expect(frame).toContain('内容文本');
    expect(frame).toContain('绿色文本');
  });

  it('should render nested structures', () => {
    const { lastFrame } = render(
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text>第一行</Text>
        </Box>
        <Box marginTop={1}>
          <Text>第二行</Text>
        </Box>
      </Box>
    );

    const frame = lastFrame();
    expect(frame).toContain('第一行');
    expect(frame).toContain('第二行');
  });
});

// ============== 快照测试示例 ==============

describe('Ink 快照测试', () => {
  it('should match snapshot for simple component', () => {
    const { lastFrame } = render(
      <Box padding={1}>
        <Text>测试内容</Text>
      </Box>
    );

    const frame = lastFrame();
    // 简单的快照验证 - 验证内容存在
    expect(frame).toContain('测试内容');
  });
});

/**
 * 使用提示:
 *
 * 1. 运行测试:
 *    npm run test          # watch 模式
 *    npm run test:ui       # 浏览器 UI
 *    npm run test:run      # 单次运行
 *
 * 2. 测试技巧:
 *    - 使用 lastFrame() 获取组件当前渲染的文本
 *    - 使用 cleanup() 清理测试后的组件
 *    - 对于用户输入模拟，需要使用 stdin 模拟库
 *
 * 3. 限制:
 *    - 交互式输入（用户输入、按键）需要更复杂的设置
 *    - 完整的 E2E 测试建议使用 CLI 实际运行测试
 */

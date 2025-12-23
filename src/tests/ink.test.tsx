/**
 * Ink TextInput 组件测试
 */
import { describe, it, expect } from 'vitest';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { render } from 'ink-testing-library';

// 简化的测试组件
function TestInput({
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
      <Text>请输入: </Text>
      <TextInput value={value} onChange={onChange} onSubmit={onSubmit} />
    </Box>
  );
}

describe('Ink TextInput', () => {
  it('should render input component', () => {
    const { lastFrame } = render(
      <TestInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(lastFrame()).toContain('请输入');
  });

  it('should display initial value', () => {
    const { lastFrame } = render(
      <TestInput
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(lastFrame()).toContain('hello');
  });
});

describe('Ink Box component', () => {
  it('should render nested boxes', () => {
    const { lastFrame } = render(
      <Box flexDirection="column">
        <Box>
          <Text>Line 1</Text>
        </Box>
        <Box>
          <Text>Line 2</Text>
        </Box>
      </Box>
    );

    const frame = lastFrame();
    expect(frame).toContain('Line 1');
    expect(frame).toContain('Line 2');
  });
});

describe('Ink colors', () => {
  it('should render colored text', () => {
    const { lastFrame } = render(
      <Text color="cyan">Cyan Text</Text>
    );

    expect(lastFrame()).toContain('Cyan Text');
  });

  it('should render bold text', () => {
    const { lastFrame } = render(
      <Text bold>Bold Text</Text>
    );

    expect(lastFrame()).toContain('Bold Text');
  });
});

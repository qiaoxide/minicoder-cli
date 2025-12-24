/**
 * Select 演示组件
 *
 * 测试重点：
 * - 键盘导航（上下键）
 * - 高亮状态
 * - 滚动显示
 * - 选择回调
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { inkSelect, inkMultiSelect } from '../Select.js';
import chalk from 'chalk';

interface DemoSelectProps {
  description?: string;
}

interface Fruit {
  value: string;
  label: string;
  color: string;
}

const FRUITS: Fruit[] = [
  { value: 'apple', label: '苹果 (Apple)', color: 'red' },
  { value: 'banana', label: '香蕉 (Banana)', color: 'yellow' },
  { value: 'orange', label: '橙子 (Orange)', color: 'orange' },
  { value: 'grape', label: '葡萄 (Grape)', color: 'magenta' },
  { value: 'watermelon', label: '西瓜 (Watermelon)', color: 'green' },
  { value: 'mango', label: '芒果 (Mango)', color: 'yellow' },
  { value: 'peach', label: '桃子 (Peach)', color: 'pink' },
  { value: 'pineapple', label: '菠萝 (Pineapple)', color: 'yellow' },
  { value: 'strawberry', label: '草莓 (Strawberry)', color: 'red' },
  { value: 'cherry', label: '樱桃 (Cherry)', color: 'red' },
];

const ANIMALS = [
  { value: 'cat', label: '🐱 猫咪' },
  { value: 'dog', label: '🐶 狗狗' },
  { value: 'rabbit', label: '🐰 兔子' },
  { value: 'hamster', label: '🐹 仓鼠' },
  { value: 'parrot', label: '🦜 鹦鹉' },
];

export function DemoSelect({ description }: DemoSelectProps) {
  const [singleSelect, setSingleSelect] = useState<string | null>(null);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [history, setHistory] = useState<{ type: string; value: string }[]>([]);

  const addHistory = (type: string, value: string) => {
    setHistory([...history, { type, value }]);
  };

  const handleSingleSelect = async () => {
    const result = await inkSelect(
      '请选择水果:',
      FRUITS.map((f) => ({
        value: f.value,
        label: f.label,
      }))
    );
    if (result) {
      const fruit = FRUITS.find((f) => f.value === result);
      setSingleSelect(result);
      addHistory('单选', fruit?.label || result);
    }
  };

  const handleMultiSelect = async () => {
    const result = await inkMultiSelect('请选择动物（多选）:', ANIMALS);
    if (result) {
      const labels = result.map((v) => ANIMALS.find((a) => a.value === v)?.label).join(', ');
      setMultiSelect(result);
      addHistory('多选', labels);
    }
  };

  return (
    <Box flexDirection="column" margin={1}>
      {/* 标题 */}
      <Text color="cyan" bold>
        ━━ Select 组件测试 ━━
      </Text>

      {description && <Text color="gray">{description}</Text>}

      <Text color="gray">测试说明：</Text>
      <Text color="gray"> - 上下方向键选择</Text>
      <Text color="gray"> - Enter 确认选择</Text>
      <Text color="gray"> - Ctrl+C 取消</Text>

      <Box marginTop={1} flexDirection="column">
        {/* 单选测试 */}
        <Box marginBottom={1}>
          <Text color="cyan">❯ </Text>
          <Text>单选测试 (水果): </Text>
          <Text color={singleSelect ? 'green' : 'gray'}>
            {singleSelect ? FRUITS.find((f) => f.value === singleSelect)?.label : '(未选择)'}
          </Text>
        </Box>
        <Text color="gray">{chalk.dim('按 Enter 触发选择器...')}</Text>

        {/* 模拟单选触发 */}
        <TriggerSelect onSelect={handleSingleSelect} />
      </Box>

      <Box marginTop={1} flexDirection="column">
        {/* 多选测试 */}
        <Box marginBottom={1}>
          <Text color="cyan">❯ </Text>
          <Text>多选测试 (动物): </Text>
          <Text color={multiSelect.length > 0 ? 'green' : 'gray'}>
            {multiSelect.length > 0
              ? multiSelect.map((v) => ANIMALS.find((a) => a.value === v)?.label).join(', ')
              : '(未选择)'}
          </Text>
        </Box>
        <Text color="gray">{chalk.dim('按 Enter 触发多选选择器...')}</Text>

        {/* 模拟多选触发 */}
        <TriggerMultiSelect onSelect={handleMultiSelect} />
      </Box>

      {/* 选择历史 */}
      {history.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="gray">选择历史 ({history.length}):</Text>
          {history.map((item, i) => (
            <Text key={i} color="yellow">
              {'  '}
              {i + 1}. {item.type}: {item.value}
            </Text>
          ))}
        </Box>
      )}

      <Text color="gray">{chalk.dim('按 Ctrl+C 退出测试')}</Text>
    </Box>
  );
}

/**
 * 单选触发器（用于模拟 Enter 键触发）
 */
function TriggerSelect({ onSelect }: { onSelect: () => void }) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSelect();
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();

    const listener = (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onSelect();
      }
    };

    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onSelect]);

  return null;
}

/**
 * 多选触发器
 */
function TriggerMultiSelect({ onSelect }: { onSelect: () => void }) {
  React.useEffect(() => {
    const listener = (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onSelect();
      }
    };

    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onSelect]);

  return null;
}

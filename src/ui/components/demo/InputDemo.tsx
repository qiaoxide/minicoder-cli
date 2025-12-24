/**
 * TextInput 演示组件
 *
 * 测试重点：
 * - 基础输入
 * - 光标移动（方向键）
 * - Backspace 删除
 * - 粘贴功能
 * - 边界情况
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import chalk from 'chalk';

interface DemoInputProps {
  /** 组件描述 */
  description?: string;
}

export function DemoInput({ description }: DemoInputProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleSubmit = () => {
    if (value.trim()) {
      setHistory([...history, value]);
      setValue('');
    }
  };

  return (
    <Box flexDirection="column" margin={1}>
      {/* 标题 */}
      <Text color="cyan" bold>
        ━━ TextInput 组件测试 ━━
      </Text>

      {/* 描述 */}
      {description && <Text color="gray">{description}</Text>}

      <Text color="gray">测试说明：</Text>
      <Text color="gray"> - 直接输入文本</Text>
      <Text color="gray"> - 左右方向键移动光标</Text>
      <Text color="gray"> - Backspace 删除字符</Text>
      <Text color="gray"> - Enter 提交内容</Text>

      <Box marginTop={1} marginBottom={1}>
        <Text color="cyan">❯ </Text>
        <Text>输入: </Text>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="在这里输入内容..."
        />
      </Box>

      {/* 实时显示 */}
      <Text color="gray">
        当前值: "<Text color="yellow">{value || '(空)'}</Text>"
      </Text>

      {/* 历史记录 */}
      {history.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="gray">历史记录 ({history.length}):</Text>
          {history.map((item, i) => (
            <Text key={i} color="gray">
              {'  '}
              {i + 1}. {item}
            </Text>
          ))}
        </Box>
      )}

      {/* 退出提示 */}
      <Text color="gray">{chalk.dim('按 Ctrl+C 退出测试')}</Text>
    </Box>
  );
}

/**
 * Confirm 演示组件
 *
 * 测试重点：
 * - y/n 响应
 * - 快捷键（Enter/Esc）
 * - 状态切换
 * - 回调执行
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { inkConfirm } from '../Confirm.js';
import chalk from 'chalk';

interface DemoConfirmProps {
  description?: string;
}

export function DemoConfirm({ description }: DemoConfirmProps) {
  const [history, setHistory] = useState<{ question: string; result: boolean }[]>([]);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async (question: string) => {
    if (isPending) return;
    setIsPending(true);

    const result = await inkConfirm(question);

    setIsPending(false);

    if (result !== null) {
      setHistory([...history, { question, result }]);
    }
  };

  const questions = [
    '确定要删除这个文件吗？',
    '确认要退出程序吗？',
    '是否保存更改？',
    '继续执行操作？',
    '接受条款和条件？',
  ];

  return (
    <Box flexDirection="column" margin={1}>
      {/* 标题 */}
      <Text color="cyan" bold>
        ━━ Confirm 组件测试 ━━
      </Text>

      {description && <Text color="gray">{description}</Text>}

      <Text color="gray">测试说明：</Text>
      <Text color="gray"> - 输入 y 或 n 确认/取消</Text>
      <Text color="gray"> - Enter 确认（y）</Text>
      <Text color="gray"> - Ctrl+C 取消</Text>

      {/* 测试按钮 */}
      <Box flexDirection="column" marginTop={1}>
        {questions.map((q, i) => (
          <Box key={i} marginBottom={1}>
            <Text color="cyan">❯ </Text>
            <Text>
              {i + 1}. {q}
            </Text>
            {!isPending && <Text color="gray"> {chalk.dim('(按 Enter 测试)')}</Text>}
          </Box>
        ))}

        {isPending && <Text color="yellow">等待确认...</Text>}

        {/* 触发器 */}
        {!isPending && <ConfirmTrigger onConfirm={handleConfirm} questions={questions} />}
      </Box>

      {/* 历史记录 */}
      {history.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="gray">确认历史 ({history.length}):</Text>
          {history.map((item, i) => (
            <Text key={i}>
              {'  '}
              {i + 1}.{' '}
              <Text color={item.result ? 'green' : 'red'}>{item.result ? '✓ 是' : '✗ 否'}</Text> -{' '}
              <Text color="gray">{item.question}</Text>
            </Text>
          ))}
        </Box>
      )}

      <Text color="gray">{chalk.dim('按 Ctrl+C 退出测试')}</Text>
    </Box>
  );
}

/**
 * 确认触发器
 */
function ConfirmTrigger({
  onConfirm,
  questions,
}: {
  onConfirm: (q: string) => void;
  questions: string[];
}) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const listener = (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onConfirm(questions[current]);
        setCurrent((c) => (c + 1) % questions.length);
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();
    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [current, onConfirm, questions]);

  return null;
}

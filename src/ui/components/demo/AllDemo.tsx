/**
 * 全部组件组合测试
 *
 * 测试重点：
 * - 多个组件同时存在时的状态隔离
 * - 焦点管理
 * - 整体交互流程
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { inkSelect } from '../Select.js';
import { inkConfirm } from '../Confirm.js';
import chalk from 'chalk';

interface DemoAllProps {
  description?: string;
}

const TASKS = [
  { value: 'coding', label: '💻 编程' },
  { value: 'design', label: '🎨 设计' },
  { value: 'writing', label: '📝 写作' },
  { value: 'reading', label: '📚 阅读' },
  { value: 'exercise', label: '🏃 运动' },
];

export function DemoAll({ description }: DemoAllProps) {
  // 表单状态
  const [name, setName] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 处理提交
  const handleSubmit = async () => {
    if (!name.trim() || !selectedTask) {
      return;
    }

    const result = await inkConfirm(
      `确认提交？\n姓名: ${name}\n任务: ${TASKS.find((t) => t.value === selectedTask)?.label}`
    );

    if (result) {
      setSubmitted(true);
    }
  };

  // 重置
  const handleReset = () => {
    setName('');
    setSelectedTask(null);
    setConfirmed(false);
    setSubmitted(false);
  };

  // 步骤指示
  const step = !name ? 1 : !selectedTask ? 2 : !confirmed ? 3 : 4;

  return (
    <Box flexDirection="column" margin={1}>
      {/* 标题 */}
      <Text color="cyan" bold>
        ━━ 全部组件组合测试 ━━
      </Text>

      {description && <Text color="gray">{description}</Text>}

      {/* 进度指示 */}
      <Box marginTop={1}>
        <Text color="gray">步骤: </Text>
        <Text color={step >= 1 ? 'green' : 'gray'}>1. 输入姓名</Text>
        <Text color="gray"> → </Text>
        <Text color={step >= 2 ? 'green' : 'gray'}>2. 选择任务</Text>
        <Text color="gray"> → </Text>
        <Text color={step >= 3 ? 'green' : 'gray'}>3. 确认提交</Text>
      </Box>

      {/* 已提交状态 */}
      {submitted && (
        <Box
          flexDirection="column"
          marginTop={2}
          padding={1}
          borderStyle="round"
          borderColor="green"
        >
          <Text color="green" bold>
            ✓ 提交成功！
          </Text>
          <Text>姓名: {name}</Text>
          <Text>任务: {TASKS.find((t) => t.value === selectedTask)?.label}</Text>
          <Text color="gray">{chalk.dim('按 Enter 继续测试')}</Text>
          <SubmitTrigger onReset={handleReset} onSubmit={() => setSubmitted(false)} />
        </Box>
      )}

      {!submitted && (
        <>
          {/* 步骤 1: 输入姓名 */}
          <Box marginTop={1}>
            <Text color="cyan">❯ </Text>
            <Text>1. 请输入你的姓名: </Text>
            <TextInput value={name} onChange={setName} placeholder="姓名..." />
          </Box>

          {/* 步骤 2: 选择任务 */}
          <Box marginTop={1}>
            <Text color="cyan">❯ </Text>
            <Text>2. 选择任务类型: </Text>
            <Text color={selectedTask ? 'green' : 'gray'}>
              {selectedTask ? TASKS.find((t) => t.value === selectedTask)?.label : '(未选择)'}
            </Text>
          </Box>
          {!selectedTask && (
            <Box marginLeft={4} flexDirection="column">
              {TASKS.map((task) => (
                <Text key={task.value} color="gray">
                  - {task.label}
                </Text>
              ))}
              <Text color="gray">{chalk.dim('(按 Enter 选择)')}</Text>
              <TaskSelector onSelect={setSelectedTask} tasks={TASKS} />
            </Box>
          )}

          {/* 步骤 3: 确认提交 */}
          {name && selectedTask && (
            <Box marginTop={1}>
              <Text color="cyan">❯ </Text>
              <Text>3. </Text>
              {!confirmed ? (
                <>
                  <Text>确认提交？</Text>
                  <Text color="gray"> {chalk.dim('(按 Enter 确认，n 取消)')}</Text>
                  <ConfirmTrigger
                    onConfirm={(result) => {
                      if (result) {
                        setConfirmed(true);
                      }
                    }}
                  />
                </>
              ) : (
                <Box>
                  <Text color="green">✓ 已确认</Text>
                  <Text color="gray"> {chalk.dim('(按 Enter 提交)')}</Text>
                  <FinalSubmitTrigger onSubmit={handleSubmit} />
                </Box>
              )}
            </Box>
          )}
        </>
      )}

      <Box marginTop={2}>
        <Text color="gray">{chalk.dim('按 Ctrl+C 退出测试')}</Text>
      </Box>
    </Box>
  );
}

/**
 * 任务选择触发器
 */
function TaskSelector({
  onSelect,
  tasks,
}: {
  onSelect: (v: string) => void;
  tasks: { value: string; label: string }[];
}) {
  React.useEffect(() => {
    const listener = async (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        const result = await inkSelect('选择任务:', tasks);
        if (result) {
          onSelect(result);
        }
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();
    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onSelect, tasks]);

  return null;
}

/**
 * 确认触发器
 */
function ConfirmTrigger({ onConfirm }: { onConfirm: (result: boolean) => void }) {
  React.useEffect(() => {
    const listener = async (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onConfirm(true);
      } else if (input === 'n' || input === 'N') {
        onConfirm(false);
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();
    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onConfirm]);

  return null;
}

/**
 * 最终提交触发器
 */
function FinalSubmitTrigger({ onSubmit }: { onSubmit: () => void }) {
  React.useEffect(() => {
    const listener = (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onSubmit();
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();
    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onSubmit]);

  return null;
}

/**
 * 提交后继续触发器
 */
function SubmitTrigger({ onReset, onSubmit }: { onReset: () => void; onSubmit: () => void }) {
  React.useEffect(() => {
    const listener = (data: Buffer) => {
      const input = data.toString();
      if (input === '\r') {
        onSubmit();
        onReset();
      }
    };

    process.stdin.setRawMode?.(true);
    process.stdin.resume?.();
    process.stdin.on('data', listener);

    return () => {
      process.stdin.off('data', listener);
    };
  }, [onReset, onSubmit]);

  return null;
}

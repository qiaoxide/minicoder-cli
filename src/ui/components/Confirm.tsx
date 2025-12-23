/**
 * 确认组件 - Ink 实现
 */

import React, { useState } from 'react';
import { render } from 'ink';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import chalk from 'chalk';

interface ConfirmAppProps {
  message: string;
  onConfirm: (confirmed: boolean) => void;
}

function ConfirmApp({ message, onConfirm }: ConfirmAppProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (input: string) => {
    const normalized = input.trim().toLowerCase();
    onConfirm(normalized === 'y' || normalized === 'yes' || normalized === '');
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="cyan">{chalk.cyan('❯')} </Text>
        <Text>{message}</Text>
        <Text color="gray"> (y/n)</Text>
      </Box>
      <Box marginLeft={2}>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="y"
          focus={true}
        />
      </Box>
    </Box>
  );
}

/**
 * 异步确认（包装函数）
 */
export async function inkConfirm(message: string): Promise<boolean | null> {
  return new Promise((resolve) => {
    let unmountFn: (() => void) | undefined;

    const handleConfirm = (confirmed: boolean) => {
      unmountFn?.();
      resolve(confirmed);
    };

    const handleCancel = () => {
      unmountFn?.();
      resolve(null);
    };

    const instance = render(
      <ConfirmApp message={message} onConfirm={handleConfirm} />
    );

    unmountFn = instance.unmount;

    // 处理 Ctrl+C
    const handleInterrupt = () => {
      process.off('SIGINT', handleInterrupt);
      handleCancel();
    };
    process.on('SIGINT', handleInterrupt);
  });
}

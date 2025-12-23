/**
 * 文本输入组件 - Ink 实现
 */

import React, { useState } from 'react';
import { render } from 'ink';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import chalk from 'chalk';

// 定义在模块顶层的组件，使用 useState
function TextInputApp({
  message,
  placeholder,
  defaultValue,
  validate,
  onSubmit,
}: {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string) => string | Error | undefined;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(typeof validationError === 'string' ? validationError : validationError.message);
        return;
      }
    }
    onSubmit(value);
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="cyan">{chalk.cyan('❯')} </Text>
        <Text>{message}</Text>
      </Box>
      <Box marginLeft={2}>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          focus={true}
        />
      </Box>
      {error && (
        <Box marginLeft={2}>
          <Text color="red">{error}</Text>
        </Box>
      )}
    </Box>
  );
}

/**
 * 异步文本输入（包装函数）
 */
export async function inkTextInput(
  message: string,
  options?: {
    placeholder?: string;
    defaultValue?: string;
    validate?: (value: string) => string | Error | undefined;
  }
): Promise<string | null> {
  return new Promise((resolve) => {
    let unmountFn: (() => void) | undefined;

    const handleSubmit = (value: string) => {
      unmountFn?.();
      resolve(value);
    };

    const handleCancel = () => {
      unmountFn?.();
      resolve(null);
    };

    const instance = render(
      <TextInputApp
        message={message}
        placeholder={options?.placeholder}
        defaultValue={options?.defaultValue}
        validate={options?.validate}
        onSubmit={handleSubmit}
      />
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

/**
 * 选择组件 - Ink 实现
 */

import { render } from 'ink';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import chalk from 'chalk';

interface Item {
  label: string;
  value: string;
}

interface SelectAppProps {
  message: string;
  items: Item[];
  onSelect: (value: string) => void;
}

function SelectApp({ message, items, onSelect }: SelectAppProps) {
  const handleSelect = (item: Item) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="cyan">{chalk.cyan('❯')} </Text>
        <Text>{message}</Text>
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}

/**
 * 异步单选（包装函数）
 */
export async function inkSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T | null> {
  const items: Item[] = options.map((opt) => ({
    label: opt.label || opt.value,
    value: opt.value,
  }));

  return new Promise((resolve) => {
    let unmountFn: (() => void) | undefined;

    const handleSelect = (value: string) => {
      unmountFn?.();
      resolve(value as T);
    };

    const handleCancel = () => {
      unmountFn?.();
      resolve(null);
    };

    const instance = render(
      <SelectApp message={message} items={items} onSelect={handleSelect} />
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

/**
 * 异步多选（包装函数）
 */
export async function inkMultiSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T[] | null> {
  const items: Item[] = options.map((opt) => ({
    label: opt.label || opt.value,
    value: opt.value,
  }));

  const selectedValues: T[] = [];

  return new Promise((resolve) => {
    let unmountFn: (() => void) | undefined;

    const handleSelect = (value: string) => {
      if (!selectedValues.includes(value as T)) {
        selectedValues.push(value as T);
      }
    };

    const handleCancel = () => {
      unmountFn?.();
      resolve(selectedValues.length > 0 ? selectedValues : null);
    };

    const instance = render(
      <SelectApp message={message} items={items} onSelect={handleSelect} />
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

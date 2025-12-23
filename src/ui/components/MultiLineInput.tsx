/**
 * ClaudeCode 风格的多行输入组件
 * 使用 Ink + useInput hook 实现
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput } from 'ink';
import chalk from 'chalk';

interface MultiLineInputProps {
  /** 提示信息 */
  message: string;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 提交回调 */
  onSubmit: (value: string) => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 最大行数 */
  maxLines?: number;
}

// ANSI 转义序列
const ARROW_UP = '\x1b[A';
const ARROW_DOWN = '\x1b[B';
const ARROW_RIGHT = '\x1b[C';
const ARROW_LEFT = '\x1b[D';
// Ctrl+Enter: 某些终端发送 \n，某些发送自定义序列
const CTRL_ENTER = '\n';

export function MultiLineInput({
  message,
  placeholder = '输入消息... (Enter 换行，Ctrl+Enter 提交，Ctrl+C 取消)',
  defaultValue = '',
  onSubmit,
  onCancel,
  maxLines = 50,
}: MultiLineInputProps) {
  const [lines, setLines] = useState<string[]>(
    defaultValue ? defaultValue.split('\n') : ['']
  );
  const [cursorY, setCursorY] = useState(0);
  const [cursorX, setCursorX] = useState(0);

  // 处理键盘输入
  useInput((input, key) => {
    const currentLine = lines[cursorY] || '';

    // Ctrl+C 取消
    if (input === '\x03') {
      onCancel?.();
      return;
    }

    // Ctrl+Enter 提交 (注意: key.ctrl + input === '\n')
    if (key.ctrl && input === '\n') {
      const value = lines.join('\n').trim();
      onSubmit(value);
      return;
    }

    // Ctrl+J 也可以提交
    if (key.ctrl && input === 'j') {
      const value = lines.join('\n').trim();
      onSubmit(value);
      return;
    }

    // Enter 换行 (key.return 是 \r)
    if (key.return) {
      const beforeCursor = currentLine.slice(0, cursorX);
      const afterCursor = currentLine.slice(cursorX);

      const newLines = [...lines];
      newLines[cursorY] = beforeCursor;
      newLines.splice(cursorY + 1, 0, afterCursor);

      setLines(newLines);
      setCursorY(cursorY + 1);
      setCursorX(0);
      return;
    }

    // Backspace
    if (key.backspace || key.delete) {
      if (cursorX > 0) {
        // 删除当前行字符
        const newLine = currentLine.slice(0, cursorX - 1) + currentLine.slice(cursorX);
        const newLines = [...lines];
        newLines[cursorY] = newLine;
        setLines(newLines);
        setCursorX(cursorX - 1);
      } else if (cursorY > 0) {
        // 合并上一行
        const prevLineLength = lines[cursorY - 1].length;
        const newLines = [...lines];
        newLines[cursorY - 1] += newLines[cursorY];
        newLines.splice(cursorY, 1);
        setLines(newLines);
        setCursorY(cursorY - 1);
        setCursorX(prevLineLength);
      }
      return;
    }

    // 方向键检测 (使用 ANSI 转义序列)
    if (input === ARROW_UP) {
      if (cursorY > 0) {
        setCursorY(cursorY - 1);
        setCursorX(Math.min(cursorX, lines[cursorY - 1].length));
      }
      return;
    }

    if (input === ARROW_DOWN) {
      if (cursorY < lines.length - 1) {
        setCursorY(cursorY + 1);
        setCursorX(Math.min(cursorX, lines[cursorY + 1].length));
      }
      return;
    }

    if (input === ARROW_LEFT) {
      if (cursorX > 0) {
        setCursorX(cursorX - 1);
      } else if (cursorY > 0) {
        setCursorY(cursorY - 1);
        setCursorX(lines[cursorY].length);
      }
      return;
    }

    if (input === ARROW_RIGHT) {
      const currentLineLength = (lines[cursorY] || '').length;
      if (cursorX < currentLineLength) {
        setCursorX(cursorX + 1);
      } else if (cursorY < lines.length - 1) {
        setCursorY(cursorY + 1);
        setCursorX(0);
      }
      return;
    }

    // 普通字符输入
    if (input && input.length === 1 && !key.ctrl && !key.meta) {
      const newLine = currentLine.slice(0, cursorX) + input + currentLine.slice(cursorX);
      const newLines = [...lines];
      newLines[cursorY] = newLine;
      setLines(newLines);
      setCursorX(cursorX + 1);
    }
  });

  // 限制最大行数
  useEffect(() => {
    if (lines.length > maxLines) {
      setLines(lines.slice(0, maxLines));
    }
  }, [lines.length, maxLines]);

  return (
    <Box flexDirection="column">
      {/* 提示信息 */}
      <Box>
        <Text color="cyan">{chalk.cyan('❯')} </Text>
        <Text>{message}</Text>
      </Box>

      {/* 输入区域 */}
      <Box flexDirection="column" marginLeft={2}>
        {lines.map((line, index) => {
          const isActive = index === cursorY;
          const displayLine = line || (isActive && placeholder ? chalk.dim(placeholder) : '');
          const cursorIndex = isActive ? cursorX : -1;

          return (
            <InputLine
              key={index}
              text={displayLine}
              cursorIndex={cursorIndex}
              lineNumber={index + 1}
              isActive={isActive}
              totalLines={lines.length}
            />
          );
        })}
      </Box>

      {/* 提示信息 */}
      <Box marginTop={1} marginLeft={2}>
        <Text color="gray">
          {chalk.dim('Enter ')}换行 {chalk.dim('|')} {chalk.dim('Ctrl+Enter')}提交 {chalk.dim('|')} {chalk.dim('Ctrl+C')}取消
        </Text>
      </Box>
    </Box>
  );
}

/**
 * 单行输入组件（带光标）
 */
function InputLine({
  text,
  cursorIndex,
  lineNumber,
  isActive,
  totalLines,
}: {
  text: string;
  cursorIndex: number;
  lineNumber: number;
  isActive: boolean;
  totalLines: number;
}) {
  // 渲染行号（如果多行）
  const showLineNumber = totalLines > 1;

  if (showLineNumber) {
    const lineNumStr = String(lineNumber).padStart(3);
    const lineNumColor = isActive ? 'cyan' : 'gray';
    const lineNum = chalk[lineNumColor](lineNumStr);

    if (isActive && cursorIndex >= 0) {
      const beforeCursor = text.slice(0, cursorIndex);
      const cursorChar = text[cursorIndex] || ' ';
      const afterCursor = text.slice(cursorIndex + 1);

      return (
        <Box>
          <Text>{lineNum} </Text>
          <Text>{beforeCursor}</Text>
          <Text inverse>{cursorChar}</Text>
          <Text>{afterCursor}</Text>
        </Box>
      );
    }

    return (
      <Box>
        <Text>{lineNum} </Text>
        <Text color={isActive ? undefined : 'gray'}>{text}</Text>
      </Box>
    );
  }

  // 单行模式
  if (isActive && cursorIndex >= 0) {
    const beforeCursor = text.slice(0, cursorIndex);
    const cursorChar = text[cursorIndex] || ' ';
    const afterCursor = text.slice(cursorIndex + 1);

    return (
      <Box>
        <Text>{beforeCursor}</Text>
        <Text inverse>{cursorChar}</Text>
        <Text>{afterCursor}</Text>
      </Box>
    );
  }

  return <Text color={isActive ? undefined : 'gray'}>{text}</Text>;
}

/**
 * 异步多行输入（包装函数）
 */
export async function multiLineInput(
  message: string,
  options?: {
    placeholder?: string;
    defaultValue?: string;
    maxLines?: number;
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
      <MultiLineInput
        message={message}
        placeholder={options?.placeholder}
        defaultValue={options?.defaultValue}
        maxLines={options?.maxLines}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    unmountFn = instance.unmount;
  });
}

import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
}

export const InkMultilineInput: React.FC<Props> = ({
    value: controlledValue,
    onChange,
    onSubmit,
    placeholder = "Type here... (Ctrl+S to submit)"
}) => {
    // 1. 内部状态 (UI渲染用)
    const [internalValue, setInternalValue] = useState('');
    const [cursorIndex, setCursorIndex] = useState(0);

    // 2. 关键修复：使用 Ref 存储“真实”的当前值，防止闭包陷阱
    // 因为 IME 输入时可能会在极短时间内触发多次 useInput，State 更新来不及
    const valueRef = useRef('');
    const cursorRef = useRef(0);

    const { exit } = useApp();

    // 3. 同步外部 Props 到 Ref
    const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

    // 每次渲染都确保 Ref 与当前的 Value 同步（处理外部修改的情况）
    useEffect(() => {
        valueRef.current = activeValue;
    }, [activeValue]);

    useEffect(() => {
        cursorRef.current = cursorIndex;
    }, [cursorIndex]);

    // 4. 输入处理逻辑
    useInput((input, key) => {
        // 从 Ref 获取最新的值，而不是从闭包中获取可能的旧值
        let nextValue = valueRef.current;
        let nextCursor = cursorRef.current;

        // --- A. 提交逻辑 (Ctrl+S) ---
        if (key.ctrl && input === 's') {
            onSubmit(nextValue);
            return;
        }

        // --- B. 退出逻辑 (Esc) ---
        if (key.escape) {
            exit();
            return;
        }

        // --- C. 导航逻辑 ---
        if (key.leftArrow) {
            nextCursor = Math.max(0, nextCursor - 1);
            setCursorIndex(nextCursor);
            return;
        }
        if (key.rightArrow) {
            nextCursor = Math.min(nextValue.length, nextCursor + 1);
            setCursorIndex(nextCursor);
            return;
        }
        // 上下移动逻辑略复杂，暂略，通常左右移动够用了
        if (key.upArrow || key.downArrow) return;

        // --- D. 编辑逻辑 ---
        if (key.return) {
            // 换行
            nextValue = nextValue.slice(0, nextCursor) + '\n' + nextValue.slice(nextCursor);
            nextCursor = nextCursor + 1;
        } else if (key.backspace || key.delete) {
            // 删除
            if (nextCursor > 0) {
                nextValue = nextValue.slice(0, nextCursor - 1) + nextValue.slice(nextCursor);
                nextCursor = nextCursor - 1;
            }
        } else {
            // 普通输入 (包括中文多字输入)
            // 注意：input 可能是 "你好" (length=2)
            nextValue = nextValue.slice(0, nextCursor) + input + nextValue.slice(nextCursor);
            nextCursor = nextCursor + input.length;
        }

        // --- E. 同步状态 ---
        // 1. 更新 Ref (保证下一次极其快速的输入能拿到最新值)
        valueRef.current = nextValue;
        cursorRef.current = nextCursor;

        // 2. 更新 React State (触发渲染)
        if (controlledValue === undefined) {
            setInternalValue(nextValue);
        }
        if (onChange) {
            onChange(nextValue);
        }
        setCursorIndex(nextCursor);
    });

    // --- 渲染部分 ---
    const renderTextWithCursor = () => {
        if (!activeValue) {
            return <Text color="gray">{placeholder}</Text>;
        }

        const chars = activeValue.split('');
        const output: React.ReactNode[] = [];
        const renderLength = Math.max(chars.length, cursorIndex);

        for (let i = 0; i <= renderLength; i++) {
            const char = chars[i];
            const isCursor = i === cursorIndex;

            if (isCursor) {
                // 光标渲染：如果当前位置有字，显示反色字；如果是末尾或换行，显示反色空格
                const charDisplay = (char === '\n' || char === undefined) ? ' ' : char;
                output.push(
                    <Text key={i} inverse color="cyan">
                        {charDisplay}
                    </Text>
                );
                // 如果光标盖住的是换行符，必须再补一个真实的换行，否则视觉上会少一行
                if (char === '\n') {
                    output.push(<Text key={`nl-${i}`}>{'\n'}</Text>);
                }
            } else {
                if (char !== undefined) {
                    output.push(<Text key={i}>{char}</Text>);
                }
            }
        }
        return output;
    };

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="blue" paddingX={1}>
            <Box marginBottom={0}>
                <Text bold color="blue"> 🤖 INPUT </Text>
            </Box>

            <Box flexDirection="column">
                <Text>{renderTextWithCursor()}</Text>
            </Box>

            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    [Enter] Newline • [Ctrl+S] Submit
                </Text>
            </Box>
        </Box>
    );
};


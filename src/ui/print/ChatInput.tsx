/**
 * 聊天输入
 */

import React, { useState, useEffect } from 'react';
import { render } from 'ink';
import { InkMultilineInput } from '../components/MultiLineInput.js';

/**
 * 聊天输入 - 使用 InkMultilineInput 组件
 *
 * 快捷键:
 * - Enter: 换行
 * - Ctrl+S: 提交
 * - Esc: 退出
 * - 方向键: 移动光标
 */
export async function chatInput(
	message: string,
	options?: {
		placeholder?: string;
	}
): Promise<string | null> {
	const opts = options ?? {};

	return new Promise((resolve) => {
		let unmountFn: (() => void) | undefined;

		const handleSubmit = (value: string) => {
			unmountFn?.();
			resolve(value);
		};

		const handleExit = () => {
			unmountFn?.();
			resolve(null);
		};

		const instance = render(
			<ChatInputWrapper
				message={message}
				placeholder={opts.placeholder}
				onSubmit={handleSubmit}
				onExit={handleExit}
			/>
		);

		unmountFn = instance.unmount;
	});
}

/**
 * 包装组件：处理提交和退出逻辑
 */
function ChatInputWrapper({
	message,
	placeholder,
	onSubmit,
	onExit,
}: {
	message: string;
	placeholder?: string;
	onSubmit: (value: string) => void;
	onExit: () => void;
}) {
	const [value, setValue] = useState('');

	const handleSubmit = (val: string) => {
		if (val.trim()) {
			onSubmit(val);
		}
	};

	// 监听 Esc 键退出
	useEffect(() => {
		const onKeyPress = (chunk: Buffer) => {
			const key = chunk.toString();
			if (key === '\u001b') {
				// ESC
				onExit();
			}
		};
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.on('data', onKeyPress);

		return () => {
			process.stdin.off('data', onKeyPress);
			process.stdin.pause();
		};
	}, [onExit]);

	return (
		<InkMultilineInput
			value={value}
			onChange={setValue}
			placeholder={placeholder || `${message} (Ctrl+S 提交, /exit 退出)`}
			onSubmit={handleSubmit}
		/>
	);
}

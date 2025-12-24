/**
 * 消息框组件
 * 提供统一的带边框消息展示风格
 */

import chalk from 'chalk';
import { boxContent } from './base.js';

type MessageType = 'info' | 'success' | 'error' | 'warning' | 'default';

interface MessageBoxOptions {
	type?: MessageType;
	title?: string;
	symbol?: string;
}

/**
 * 获取消息类型对应的颜色和符号
 */
function getMessageStyle(type: MessageType): { color: typeof chalk; symbol: string } {
	const styles: Record<MessageType, { color: typeof chalk; symbol: string }> = {
		info: { color: chalk.blue, symbol: 'ℹ' },
		success: { color: chalk.green, symbol: '✓' },
		error: { color: chalk.red, symbol: '✗' },
		warning: { color: chalk.yellow, symbol: '⚠' },
		default: { color: chalk.gray, symbol: '›' },
	};
	return styles[type] ?? styles.default;
}

/**
 * 创建消息框
 * @param content 消息内容
 * @param options 配置选项
 */
export function MessageBox(
	content: string,
	options: MessageBoxOptions = {}
): void {
	const { type = 'default', title } = options;
	const { color, symbol } = getMessageStyle(type);
	const styledSymbol = color(symbol);
	const styledContent = color(content);

	if (title) {
		console.log(boxContent(content, title));
	} else {
		console.log(`\n${styledSymbol} ${styledContent}\n`);
	}
}

/**
 * 成功消息
 */
export function Success(message: string, title?: string): void {
	MessageBox(message, { type: 'success', title });
}

/**
 * 错误消息
 */
export function Error(message: string, title?: string): void {
	MessageBox(message, { type: 'error', title });
}

/**
 * 警告消息
 */
export function Warning(message: string, title?: string): void {
	MessageBox(message, { type: 'warning', title });
}

/**
 * 信息消息
 */
export function Info(message: string, title?: string): void {
	MessageBox(message, { type: 'info', title });
}

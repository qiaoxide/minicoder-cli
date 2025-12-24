/**
 * 输入提示函数
 * 基于 Ink 的核心输入抽象
 */

import chalk from 'chalk';
import { symbols } from './base.js';
import { inkTextInput, inkSelect, inkMultiSelect, inkConfirm } from './index.js';

function prefix(message: string): string {
	return `${chalk.cyan(symbols.arrow)} ${message}`;
}

/**
 * 确认操作
 */
export async function confirm(message: string): Promise<boolean | null> {
	return inkConfirm(prefix(message));
}

/**
 * 文本输入
 */
export async function text(
	message: string,
	options?: { placeholder?: string }
): Promise<string | null> {
	return inkTextInput(prefix(message), options);
}

/**
 * 密码输入
 */
export async function password(message: string): Promise<string | null> {
	return inkTextInput(prefix(message), { placeholder: '••••••••' });
}

/**
 * 单选
 */
export function select<T extends string>(
	message: string,
	items: { value: T; label?: string; hint?: string }[]
): Promise<T | null> {
	return inkSelect(prefix(message), items);
}

/**
 * 多选
 */
export function multiSelect<T extends string>(
	message: string,
	items: { value: T; label?: string; hint?: string }[]
): Promise<T[] | null> {
	return inkMultiSelect(prefix(message), items);
}

/**
 * 键值对展示组件
 */

import chalk from 'chalk';

/**
 * 键值对选项
 */
interface KeyValueOptions {
	indent?: number;
	color?: typeof chalk.gray;
}

/**
 * 打印键值对
 */
export function KeyValue(key: string, value: string, options: KeyValueOptions = {}): void {
	const { indent = 0, color = chalk.gray } = options;
	const prefix = ' '.repeat(indent);
	console.log(`${prefix}${chalk.cyan(key)}: ${color(value)}`);
}

/**
 * 打印键值对列表
 */
export function KeyValueList(
	items: Record<string, string>,
	options: KeyValueOptions = {}
): void {
	for (const [key, value] of Object.entries(items)) {
		KeyValue(key, value, options);
	}
}

/**
 * 打印状态型键值对（值带状态颜色）
 */
export function KeyValueStatus(
	key: string,
	value: string,
	isOk: boolean,
	options: KeyValueOptions = {}
): void {
	const { indent = 0 } = options;
	const prefix = ' '.repeat(indent);
	const status = isOk ? chalk.green('✓') : chalk.red('✗');
	const statusColor = isOk ? chalk.green : chalk.red;
	console.log(`${prefix}${chalk.cyan(key)}: ${status} ${statusColor(value)}`);
}

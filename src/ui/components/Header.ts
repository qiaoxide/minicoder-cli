/**
 * 区块头部组件
 * 提供统一的区块标题样式
 */

import chalk from 'chalk';

interface HeaderOptions {
	indent?: number;
	symbol?: string;
}

/**
 * 打印带装饰线的区块标题
 */
export function Header(title: string, options: HeaderOptions = {}): void {
	const { indent = 0, symbol = '━' } = options;
	const prefix = ' '.repeat(indent);
	const line = symbol.repeat(Math.min(30, process.stdout.columns || 60) - title.length - 2);
	console.log(`\n${prefix}${chalk.cyan.bold(`━━ ${title} ━━`)}\n`);
}

/**
 * 打印分割线
 */
export function Divider(indent = 0): void {
	const prefix = ' '.repeat(indent);
	console.log(prefix + chalk.dim('─'.repeat(process.stdout.columns || 80)));
}

/**
 * 打印带边框的区块头部
 */
export function BoxHeader(title: string, subtitle?: string): void {
	const border = chalk.cyan('─'.repeat(Math.min(40, process.stdout.columns || 40)));
	console.log(`\n${border}`);
	console.log(chalk.cyan.bold(`  ${title}`));
	if (subtitle) {
		console.log(chalk.gray(`  ${subtitle}`));
	}
	console.log(`${border}\n`);
}

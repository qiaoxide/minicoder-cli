/**
 * 清空提示
 */

import chalk from 'chalk';
import { symbols, confirm } from '../components/index.js';

/**
 * 打印清空提示
 */
export function Cleared(): void {
	console.log(`\n${chalk.green(symbols.success)} ${chalk.bold('对话已清空')}\n`);
}

/**
 * 交互式确认清空（返回 true 表示确认清空）
 */
export async function confirmClear(): Promise<boolean> {
	const result = await confirm('确定要清空对话历史吗？');
	return result === true;
}

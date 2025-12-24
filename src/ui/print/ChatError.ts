/**
 * 错误消息
 */

import chalk from 'chalk';
import { symbols } from '../components/index.js';

/**
 * 打印错误消息
 */
export function ChatError(error: string): void {
	console.log(`\n${chalk.red(symbols.error)} ${chalk.bold('错误')}: ${error}\n`);
}

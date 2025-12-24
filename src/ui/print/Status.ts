/**
 * 状态消息
 */

import chalk from 'chalk';
import { symbols } from '../components/index.js';

/**
 * 打印状态消息
 */
export function Status(message: string): void {
	console.log(`\n${chalk.blue(symbols.info)} ${message}\n`);
}

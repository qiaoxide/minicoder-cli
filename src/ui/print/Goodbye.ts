/**
 * 退出信息
 */

import chalk from 'chalk';
import { symbols, boxContent } from '../components/index.js';

/**
 * 打印退出信息
 */
export function Goodbye(): void {
	const content = [chalk.cyan(symbols.sparkles), '感谢使用 MiniCoder', '再见！'].join('\n');

	console.log('');
	console.log(boxContent(content, '退出'));
	console.log('');
}

/**
 * 欢迎信息
 */

import chalk from 'chalk';
import { symbols, boxContent } from '../components/index.js';

/**
 * 打印欢迎信息
 */
export function Welcome(modelName?: string): void {
	const content = [
		`${chalk.cyan(symbols.sparkles)} 欢迎使用 MiniCoder Chat`,
		'',
		chalk.dim('输入你的问题，开始与 AI 对话'),
		'',
		chalk.cyan('命令:'),
		'  /exit    退出对话',
		'  /clear   清空对话历史',
		'  /help    显示帮助信息',
		'  /history 查看对话历史',
	].join('\n');

	console.log('');
	console.log(boxContent(content, modelName ? `MiniCoder (${modelName})` : 'MiniCoder'));
	console.log('');
}

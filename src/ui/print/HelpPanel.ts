/**
 * 帮助面板
 */

import chalk from 'chalk';
import { boxContent } from '../components/index.js';

const COMMANDS = [
	{ command: '/exit', description: '退出对话' },
	{ command: '/quit', description: '退出对话' },
	{ command: '/clear', description: '清空对话历史' },
	{ command: '/help', description: '显示帮助信息' },
	{ command: '/history', description: '查看对话历史' },
];

/**
 * 打印帮助面板
 */
export function HelpPanel(): void {
	const content = [
		chalk.cyan.bold('━━ 可用命令 ━━'),
		'',
		...COMMANDS.map((c) => `  ${chalk.cyan(c.command)}  ${chalk.dim(c.description)}`),
		'',
		chalk.dim('快捷键:'),
		chalk.dim('  Enter      换行'),
		chalk.dim('  Ctrl+S     提交'),
		chalk.dim('  Esc        退出输入'),
	].join('\n');

	console.log(boxContent(content, '帮助'));
}

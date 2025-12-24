/**
 * 用户消息气泡
 */

import chalk from 'chalk';

/**
 * 显示用户消息气泡
 */
export function UserMessage(content: string): void {
	const lines = content.split('\n');
	const displayContent =
		lines.length > 1 ? `\n${lines.map((l) => `  ${l}`).join('\n')}\n` : ` ${content}`;

	console.log(`\n${chalk.cyan('╭─ 用户')}${chalk.dim(' ──────────────────────')}`);
	console.log(`${chalk.cyan('│')}${displayContent}`);
	console.log(`${chalk.cyan('╰')}${chalk.dim('───────────────────────')}\n`);
}

/**
 * 对话历史
 */

import chalk from 'chalk';

interface Message {
	role: string;
	content: string;
}

/**
 * 打印对话历史
 */
export function History(messages: Message[]): void {
	const content = messages
		.map((msg, i) => {
			const role = msg.role === 'user' ? chalk.cyan('用户') : chalk.green('AI');
			const preview = msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : '');
			return `${chalk.dim(`${i + 1}.`)} ${role}: ${preview}`;
		})
		.join('\n');

	console.log(`\n${chalk.cyan.bold('━━ 对话历史 ━━')}\n`);
	console.log(content || chalk.dim('暂无对话记录'));
	console.log('');
}

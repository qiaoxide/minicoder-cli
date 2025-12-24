/**
 * 分隔线
 */

import chalk from 'chalk';

/**
 * 打印分隔线
 */
export function Divider(): void {
	console.log(chalk.dim('─'.repeat(process.stdout.columns || 80)));
}

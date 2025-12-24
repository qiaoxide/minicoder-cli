/**
 * AI 消息气泡
 */

import chalk from 'chalk';
import { colors, Dots, renderMarkdown } from '../components/index.js';

interface AiMessageOptions {
	showThinking?: boolean;
	modelName?: string;
}

/**
 * 显示 AI 消息气泡
 */
export async function AiMessage(content: string, options?: AiMessageOptions): Promise<void> {
	// 思考指示器
	if (options?.showThinking !== false) {
		const thinking = Dots(colors.muted('思考中'));
		thinking.start();
		await sleep(800);
		thinking.stop();
	}

	// AI 消息头部
	const modelBadge = options?.modelName ? chalk.bgCyan.white(` ${options.modelName} `) + ' ' : '';

	console.log(
		`\n${chalk.green('╭─')} ${modelBadge}${chalk.green('AI')}${chalk.dim(' ──────────────────────')}`
	);

	// 渲染 markdown
	const rendered = await renderMarkdown(content);
	const lines = rendered.split('\n');

	for (const line of lines) {
		console.log(`${chalk.green('│')} ${line}`);
	}

	console.log(`${chalk.green('╰')}${chalk.dim('───────────────────────')}\n`);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 基础 UI 常量和工具函数
 * 颜色、符号、markdown 渲染等
 */

import chalk from 'chalk';
import { marked } from 'marked';
import hljs from 'highlight.js';
import figures from 'figures';
import boxen, { type Options } from 'boxen';

// Configure marked options
marked.setOptions({
	gfm: true,
	breaks: true,
});

// Console color scheme
export const colors = {
	cyan: chalk.cyan,
	primary: chalk.cyan,
	secondary: chalk.gray,
	success: chalk.green,
	error: chalk.red,
	warning: chalk.yellow,
	info: chalk.blue,
	muted: chalk.dim,
	bold: chalk.bold,
	code: chalk.bgGray.white,
	green: chalk.green,
};

// Status symbols
export const symbols = {
	success: figures.tick,
	error: figures.cross,
	warning: figures.warning,
	info: figures.info,
	arrow: figures.arrowRight,
	bullet: figures.bullet,
	sparkles: figures.star,
};

/**
 * Render markdown to terminal
 */
export async function renderMarkdown(text: string): Promise<string> {
	const result = marked.parse(text, { async: false }) as string;
	return result
		.replace(/<p>/g, '')
		.replace(/<\/p>/g, '\n')
		.replace(/<strong>/g, '')
		.replace(/<\/strong>/g, '')
		.replace(/<em>/g, '')
		.replace(/<\/em>/g, '')
		.replace(/<br>/g, '\n')
		.trim();
}

/**
 * Highlight code block
 */
export function highlightCode(code: string, lang?: string): string {
	const highlighted =
		lang && hljs.getLanguage(lang)
			? hljs.highlight(code, { language: lang }).value
			: hljs.highlightAuto(code).value;
	return highlighted;
}

/**
 * Create a box around content
 */
export function boxContent(content: string, title = ''): string {
	const options: Options = {
		padding: 1,
		margin: 0,
		borderStyle: 'round',
		titleAlignment: 'center',
	};

	if (title) {
		return boxen(content, { ...options, title });
	}

	return boxen(content, options);
}

/**
 * Loading 组件库
 * 提供简洁的加载动画 API
 */

import Ora from 'ora';
import type OraType from 'ora';
import chalk from 'chalk';
import { symbols } from './base.js';

// 存储活跃的 spinner
const activeSpinners: ReturnType<typeof Ora>[] = [];

/**
 * Spinner 选项
 */
interface SpinnerOptions {
	frames?: string[];
	interval?: number;
	color?: string;
}

/**
 * Loading 选项
 */
interface LoadingOptions extends SpinnerOptions {
	prefixText?: string;
}

/**
 * 获取 spinner 实例
 */
function createSpinner(text: string, options?: SpinnerOptions): ReturnType<typeof Ora> {
	const spinner = Ora({
		text,
		spinner: {
			interval: options?.interval ?? 80,
			frames: options?.frames ?? ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▁'],
		},
	});

	activeSpinners.push(spinner);
	return spinner;
}

/**
 * 通用 Spinner
 */
export function Spinner(text: string, options?: SpinnerOptions): ReturnType<typeof Ora> {
	return createSpinner(text, options);
}

/**
 * 点点加载动画
 */
export function Dots(text: string): ReturnType<typeof Ora> {
	return createSpinner(text, {
		frames: ['   ', '•  ', '•• ', '•••', '•• ', '•  '],
		interval: 300,
	});
}

/**
 * 线条加载动画
 */
export function Line(text: string): ReturnType<typeof Ora> {
	return createSpinner(text, {
		frames: ['-', '▁', '▂', '▃', '▄', '▅', '▆', '█', '▆', '▅', '▄', '▃', '▂'],
		interval: 120,
	});
}

/**
 * 脉冲加载动画
 */
export function Pulse(text: string): ReturnType<typeof Ora> {
	return createSpinner(text, {
		frames: ['█', '▇', '▆', '▅', '▄', '▃', '▂'],
		interval: 150,
	});
}

/**
 * Loading 快捷函数（默认样式）
 */
export function Loading(text: string): ReturnType<typeof Ora> {
	return createSpinner(text);
}

/**
 * 成功状态
 */
export function LoadingSuccess(spinner: ReturnType<typeof Ora>, text?: string): void {
	spinner.stopAndPersist({
		symbol: chalk.green(symbols.success),
		text: text ? chalk.green(text) : undefined,
	});
}

/**
 * 失败状态
 */
export function LoadingFail(spinner: ReturnType<typeof Ora>, text?: string): void {
	spinner.stopAndPersist({
		symbol: chalk.red(symbols.error),
		text: text ? chalk.red(text) : undefined,
	});
}

/**
 * 警告状态
 */
export function LoadingWarn(spinner: ReturnType<typeof Ora>, text?: string): void {
	spinner.stopAndPersist({
		symbol: chalk.yellow(symbols.warning),
		text: text ? chalk.yellow(text) : undefined,
	});
}

/**
 * 停止并输出信息
 */
export function LoadingDone(spinner: ReturnType<typeof Ora>, text?: string): void {
	spinner.stopAndPersist({
		symbol: chalk.cyan(symbols.arrow),
		text: text ? chalk.cyan(text) : undefined,
	});
}

/**
 * Promise 包装器 - 自动显示 Loading
 */
export async function withLoading<T>(
	text: string,
	promise: Promise<T>,
	options?: {
		successText?: string;
		errorText?: string;
		spinner?: ReturnType<typeof Ora>;
	}
): Promise<T> {
	const loader = options?.spinner ?? Loading(text);
	loader.start();

	try {
		const result = await promise;
		LoadingSuccess(loader, options?.successText);
		return result;
	} catch (error) {
		LoadingFail(loader, options?.errorText ?? String(error));
		throw error;
	}
}

/**
 * 停止所有活跃的 Loading
 */
export function stopAll(): void {
	activeSpinners.forEach((s) => s.stop());
	activeSpinners.length = 0;
}

/**
 * Loading 思考中（用于 AI 响应）
 */
export async function Thinking(text = '思考中'): Promise<ReturnType<typeof Ora>> {
	const spinner = Dots(text);
	spinner.start();
	return spinner;
}

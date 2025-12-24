/**
 * Progress 进度条组件
 */

import chalk from 'chalk';
import { symbols } from './base.js';

/**
 * 进度条选项
 */
interface ProgressOptions {
	total?: number;
	title?: string;
	width?: number;
	fillChar?: string;
	emptyChar?: string;
}

/**
 * 进度条组件
 */
export class ProgressBar {
	private total: number;
	private current: number;
	private title: string;
	private width: number;
	private fillChar: string;
	private emptyChar: string;

	constructor(options?: ProgressOptions) {
		this.total = options?.total ?? 100;
		this.current = 0;
		this.title = options?.title ?? '';
		this.width = options?.width ?? 30;
		this.fillChar = options?.fillChar ?? '█';
		this.emptyChar = options?.emptyChar ?? '░';
	}

	/**
	 * 设置总数
	 */
	setTotal(total: number): void {
		this.total = total;
	}

	/**
	 * 更新进度
	 */
	update(current: number, extra?: string): void {
		this.current = Math.max(0, Math.min(current, this.total));
		this.render(extra);
	}

	/**
	 * 增加进度
	 */
	increment(extra?: string): void {
		this.current = Math.min(this.current + 1, this.total);
		this.render(extra);
	}

	/**
	 * 渲染进度条
	 */
	private render(extra?: string): void {
		const percent = this.total > 0 ? this.current / this.total : 0;
		const filledLen = Math.floor(percent * this.width);
		const filled = this.fillChar.repeat(filledLen);
		const empty = this.emptyChar.repeat(this.width - filledLen);
		const percentStr = (percent * 100).toFixed(0).padStart(3);

		const bar = `${chalk.cyan(filled)}${chalk.gray(empty)}`;
		const titleStr = this.title ? `${this.title}: ` : '';
		const info = extra ? ` ${chalk.gray(`| ${extra}`)}` : '';

		process.stdout.write(
			`\r${chalk.cyan(symbols.arrow)} ${titleStr}[${bar}] ${percent}%${info}\r`
		);

		if (this.current >= this.total) {
			process.stdout.write('\n');
		}
	}

	/**
	 * 完成
	 */
	done(message?: string): void {
		this.render();
		if (message) {
			console.log(` ${chalk.cyan(symbols.success)} ${chalk.cyan(message)}`);
		}
	}

	/**
	 * 格式化百分比字符串
	 */
	static percent(current: number, total: number, width = 30): string {
		const percent = total > 0 ? current / total : 0;
		const filled = Math.floor(percent * width);
		const empty = width - filled;
		return `${chalk.cyan('█'.repeat(filled))}${chalk.gray('░'.repeat(empty))} ${(percent * 100).toFixed(0)}%`;
	}
}

/**
 * 简单的百分比显示
 */
export function percent(current: number, total: number, width = 30): string {
	return ProgressBar.percent(current, total, width);
}

/**
 * 步骤进度
 */
export class StepProgress {
	private steps: string[];
	private currentStep: number;
	private width: number;

	constructor(steps: string[], options?: { width?: number }) {
		this.steps = steps;
		this.currentStep = 0;
		this.width = options?.width ?? 20;
	}

	/**
	 * 进入下一步
	 */
	next(): void {
		this.currentStep = Math.min(this.currentStep + 1, this.steps.length);
		this.render();
	}

	/**
	 * 显示当前步骤
	 */
	show(): void {
		this.render();
	}

	/**
	 * 渲染
	 */
	private render(): void {
		const total = this.steps.length;
		const percent = total > 0 ? this.currentStep / total : 0;
		const filled = Math.floor(percent * this.width);
		const empty = this.width - filled;

		const bar = `${chalk.cyan('█'.repeat(filled))}${chalk.gray('░'.repeat(empty))}`;
		const stepInfo = this.currentStep < total
			? `(${this.currentStep + 1}/${total}) ${this.steps[this.currentStep]}`
			: `(✓) 完成`;

		process.stdout.write(`\r${chalk.cyan(symbols.arrow)} ${bar} ${stepInfo}\r`);

		if (this.currentStep >= total) {
			process.stdout.write('\n');
		}
	}

	/**
	 * 完成
	 */
	done(): void {
		this.currentStep = this.steps.length;
		this.render();
	}
}

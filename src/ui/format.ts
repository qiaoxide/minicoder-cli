/**
 * UI Formatting Utilities
 * Color output, markdown rendering, code highlighting
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

// Status symbols - using figures for cross-platform compatibility
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
 * Render markdown to terminal with syntax highlighting
 */
export async function renderMarkdown(text: string): Promise<string> {
  const result = marked.parse(text, {
    async: false, // 同步解析
  }) as string;

  // 简单处理：移除 HTML 标签（临时方案）
  // 完整方案需要使用 marked-terminal 或自定义渲染器
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
  const highlighted = lang && hljs.getLanguage(lang)
    ? hljs.highlight(code, { language: lang }).value
    : hljs.highlightAuto(code).value;
  return highlighted;
}

/**
 * Print a formatted header
 */
export function printHeader(title: string, subtitle?: string): void {
  const border = '═'.repeat(Math.min(40, process.stdout.columns || 40));
  console.log(`\n${chalk.cyan(border)}`);
  console.log(chalk.cyan.bold(`  ${title}`));
  if (subtitle) {
    console.log(chalk.gray(`  ${subtitle}`));
  }
  console.log(chalk.cyan(border));
}

/**
 * Print a formatted section
 */
export function printSection(title: string): void {
  console.log(`\n${chalk.cyan.bold(`━━ ${title} ━━`)}\n`);
}

/**
 * Print key-value pairs in a formatted way
 */
export function printKeyValue(key: string, value: string, indent = 0): void {
  const prefix = ' '.repeat(indent);
  console.log(`${prefix}${chalk.cyan(key)}: ${value}`);
}

/**
 * Print a success message with icon
 */
export function printSuccess(message: string): void {
  console.log(` ${chalk.green(symbols.success)} ${message}`);
}

/**
 * Print an error message with icon
 */
export function printError(message: string): void {
  console.log(` ${chalk.red(symbols.error)} ${message}`);
}

/**
 * Print a warning message with icon
 */
export function printWarning(message: string): void {
  console.log(` ${chalk.yellow(symbols.warning)} ${message}`);
}

/**
 * Print an info message with icon
 */
export function printInfo(message: string): void {
  console.log(` ${chalk.blue(symbols.info)} ${message}`);
}

/**
 * Print a divider line
 */
export function printDivider(): void {
  console.log(chalk.dim('─'.repeat(process.stdout.columns || 80)));
}

/**
 * Print code block with language label
 */
export function printCodeBlock(code: string, lang = 'code'): void {
  const label = ` ${lang.toUpperCase()} `;
  const padding = ' '.repeat(Math.max(0, label.length - 2));
  console.log(chalk.bgGray.white(label) + padding);
  console.log(chalk.gray(code));
}

/**
 * Print a list of items with bullets
 */
export function printList(items: string[], indent = 2): void {
  const prefix = ' '.repeat(indent);
  items.forEach(item => {
    console.log(`${prefix}${chalk.cyan(symbols.bullet)} ${item}`);
  });
}

/**
 * Create a box around content using boxen
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

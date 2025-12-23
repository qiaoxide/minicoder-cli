/**
 * Chat UI Module - ClaudeCode Style
 *
 * 提供类似 ClaudeCode 的生动聊天交互体验
 */

import chalk from 'chalk';
import { text, isCancel } from '@clack/prompts';
import { colors, symbols, boxContent } from './format.js';
import { createDotsSpinner, typewriter } from './spinner.js';

// 可用命令列表
const AVAILABLE_COMMANDS = [
  { command: '/exit', description: '退出对话' },
  { command: '/quit', description: '退出对话' },
  { command: '/clear', description: '清空对话历史' },
  { command: '/help', description: '显示帮助信息' },
  { command: '/history', description: '查看对话历史' },
];

/**
 * 聊天输入 - @clack/prompts 实现
 */
export async function chatInput(
  message: string,
  options?: {
    placeholder?: string;
  }
): Promise<string | null> {
  const opts = options ?? {};

  const result = await text({
    message: colors.primary(message),
    placeholder: opts.placeholder || '输入消息... (支持多行)',
  });

  if (isCancel(result) || result === undefined) {
    return null;
  }

  return result as string;
}

/**
 * 显示用户消息气泡
 */
export function printUserMessage(content: string): void {
  const lines = content.split('\n');
  const displayContent = lines.length > 1
    ? `\n${lines.map(l => `  ${l}`).join('\n')}\n`
    : ` ${content}`;

  console.log(`\n${chalk.cyan('╭─ 用户')}${chalk.dim(' ──────────────────────')}`);
  console.log(`${chalk.cyan('│')}${displayContent}`);
  console.log(`${chalk.cyan('╰')}${chalk.dim('───────────────────────')}\n`);
}

/**
 * 显示 AI 消息气泡
 */
export async function printAiMessage(
  content: string,
  options?: {
    showThinking?: boolean;
    modelName?: string;
  }
): Promise<void> {
  // 思考指示器
  if (options?.showThinking !== false) {
    const thinking = createDotsSpinner(colors.muted('思考中'));
    thinking.start();
    await sleep(800);
    thinking.stop();
  }

  // AI 消息头部
  const modelBadge = options?.modelName
    ? chalk.bgCyan.white(` ${options.modelName} `) + ' '
    : '';

  console.log(`\n${chalk.green('╭─')} ${modelBadge}${chalk.green('AI')}${chalk.dim(' ──────────────────────')}`);

  // 渲染 markdown 并打字输出
  const { renderMarkdown } = await import('./format.js');
  const rendered = await renderMarkdown(content);
  const lines = rendered.split('\n');

  for (const line of lines) {
    console.log(`${chalk.green('│')} ${line}`);
  }

  console.log(`${chalk.green('╰')}${chalk.dim('───────────────────────')}\n`);
}

/**
 * 打印分隔线
 */
export function printChatDivider(): void {
  console.log(chalk.dim('─'.repeat(process.stdout.columns || 80)));
}

/**
 * 打印帮助面板
 */
export function printHelpPanel(): void {
  const content = [
    chalk.cyan.bold('━━ 可用命令 ━━'),
    '',
    ...AVAILABLE_COMMANDS.map(c =>
      `  ${chalk.cyan(c.command)}  ${chalk.dim(c.description)}`
    ),
    '',
    chalk.dim('快捷键:'),
    chalk.dim('  Ctrl+C   取消输入'),
  ].join('\n');

  console.log(boxContent(content, '帮助'));
}

/**
 * 打印历史记录
 */
export function printHistory(messages: Array<{ role: string; content: string }>): void {
  const content = messages.map((msg, i) => {
    const role = msg.role === 'user'
      ? chalk.cyan('用户')
      : chalk.green('AI');
    const preview = msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : '');
    return `${chalk.dim(`${i + 1}.`)} ${role}: ${preview}`;
  }).join('\n');

  console.log(`\n${chalk.cyan.bold('━━ 对话历史 ━━')}\n`);
  console.log(content || chalk.dim('暂无对话记录'));
  console.log('');
}

/**
 * 打印欢迎信息
 */
export function printWelcome(modelName?: string): void {
  const welcome = [
    `${chalk.cyan(symbols.sparkles)} 欢迎使用 MiniCoder Chat`,
    '',
    chalk.dim('输入你的问题，开始与 AI 对话'),
    '',
    chalk.cyan('命令:'),
    ...AVAILABLE_COMMANDS.map(c => `  ${c.command}`),
  ].join('\n');

  console.log('');
  console.log(boxContent(welcome, modelName ? `MiniCoder (${modelName})` : 'MiniCoder'));
  console.log('');
}

/**
 * 打印退出信息
 */
export function printGoodbye(): void {
  const goodbye = [
    chalk.cyan(symbols.sparkles),
    '感谢使用 MiniCoder',
    '再见！',
  ].join('\n');

  console.log('');
  console.log(boxContent(goodbye, '退出'));
  console.log('');
}

/**
 * 打印清空提示
 */
export function printCleared(): void {
  console.log(`\n${chalk.green(symbols.success)} ${chalk.bold('对话已清空')}\n`);
}

/**
 * 打印错误消息
 */
export function printChatError(error: string): void {
  console.log(`\n${chalk.red(symbols.error)} ${chalk.bold('错误')}: ${error}\n`);
}

/**
 * 打印状态消息
 */
export function printStatus(message: string): void {
  console.log(`\n${chalk.blue(symbols.info)} ${message}\n`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

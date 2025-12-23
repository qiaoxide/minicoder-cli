/**
 * Interactive Input Utilities
 * Prompts, selections, and user input using Ink
 */

import chalk from 'chalk';
import { symbols } from './format.js';
import { inkTextInput, inkSelect, inkMultiSelect, inkConfirm } from './components/index.js';

// Ink 没有 intro/outro/cancel，直接打印
export function showIntro(name: string, version: string): void {
  console.log(chalk.cyan(`${chalk.bold(name)} v${version}`));
  console.log('');
}

export function showOutro(message: string): void {
  console.log(chalk.green(message));
}

export function showCancel(message: string): void {
  console.log(chalk.yellow(message));
}

/**
 * Confirm action - returns true/false or null if cancelled
 */
export async function confirmAction(message: string): Promise<boolean | null> {
  const result = await inkConfirm(`${chalk.cyan(symbols.arrow)} ${message}`);
  return result;
}

/**
 * Text input with optional placeholder and default value
 */
export async function textInput(
  message: string,
  options?: {
    placeholder?: string;
    defaultValue?: string;
    validate?: (value: string) => string | Error | undefined;
  }
): Promise<string | null> {
  return inkTextInput(`${chalk.cyan(symbols.arrow)} ${message}`, options);
}

/**
 * Single select from a list
 */
export async function singleSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T | null> {
  return inkSelect(`${chalk.cyan(symbols.arrow)} ${message}`, options);
}

/**
 * Multi-select from a list
 */
export async function multiSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T[] | null> {
  return inkMultiSelect(`${chalk.cyan(symbols.arrow)} ${message}`, options);
}

/**
 * Secure password input
 */
export async function passwordInput(message: string): Promise<string | null> {
  // Ink 的 TextInput 支持 password 模式
  return inkTextInput(`${chalk.cyan(symbols.arrow)} ${message}`, {
    placeholder: '••••••••',
  });
}

/**
 * Interactive configuration wizard
 */
export async function configWizard(
  config: Record<string, unknown>,
  fields: {
    key: string;
    label: string;
    type: 'text' | 'password' | 'confirm' | 'select';
    options?: { value: string; label: string }[];
    defaultValue?: string;
  }[]
): Promise<Record<string, unknown> | null> {
  const result = { ...config };

  for (const field of fields) {
    let value: string | boolean | null;

    switch (field.type) {
      case 'password':
        value = await passwordInput(field.label);
        break;
      case 'confirm':
        const confirmed = await confirmAction(field.label);
        if (confirmed === null) return null;
        value = confirmed;
        break;
      case 'select':
        const selected = await singleSelect(field.label, field.options!);
        if (selected === null) return null;
        value = selected;
        break;
      default:
        value = await textInput(field.label, {
          defaultValue: field.defaultValue,
        });
        if (value === null) return null;
    }

    result[field.key] = value;
  }

  return result;
}

/**
 * Table-like selection menu
 */
export async function tableSelect<T extends string>(
  title: string,
  rows: { value: T; cells: string[] }[]
): Promise<T | null> {
  const options = rows.map(row => ({
    value: row.value,
    label: row.cells.join('  '),
  }));

  return singleSelect(title, options);
}

/**
 * Command history selector
 */
export async function selectHistory(
  history: string[]
): Promise<string | null> {
  if (history.length === 0) {
    return null;
  }

  const options = history.map((cmd, index) => ({
    value: cmd,
    label: `  ${index + 1}.  ${cmd.length > 50 ? cmd.slice(0, 47) + '...' : cmd}`,
  }));

  return singleSelect('Recent commands:', options);
}

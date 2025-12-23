/**
 * Interactive Input Utilities
 * Prompts, selections, and user input using @clack/prompts
 */

import {
  confirm,
  select,
  multiselect,
  text,
  password,
  intro,
  outro,
  cancel,
  isCancel,
} from '@clack/prompts';
import chalk from 'chalk';
import { symbols } from './format.js';

export { intro, outro, cancel, isCancel };

/**
 * Display an intro banner
 */
export function showIntro(name: string, version: string): void {
  intro(chalk.cyan(`${chalk.bold(name)} v${version}`));
}

/**
 * Display an outro message
 */
export function showOutro(message: string): void {
  outro(message);
}

/**
 * Cancel operation with message
 */
export function showCancel(message: string): void {
  cancel(message);
}

/**
 * Confirm action - returns true/false or null if cancelled
 */
export async function confirmAction(message: string): Promise<boolean | null> {
  const result = await confirm({
    message: `${chalk.cyan(symbols.arrow)} ${message}`,
    active: chalk.green('Yes'),
    inactive: chalk.gray('No'),
  });
  return isCancel(result) ? null : result;
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
  const result = await text({
    message: `${chalk.cyan(symbols.arrow)} ${message}`,
    placeholder: options?.placeholder,
    defaultValue: options?.defaultValue,
    validate: options?.validate,
  });

  return isCancel(result) ? null : (result as string);
}

/**
 * Single select from a list
 */
export async function singleSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T | null> {
  const result = await select<T>({
    message: `${chalk.cyan(symbols.arrow)} ${message}`,
    options: options as any,
  });

  return isCancel(result) ? null : result;
}

/**
 * Multi-select from a list
 */
export async function multiSelect<T extends string>(
  message: string,
  options: { value: T; label?: string; hint?: string }[]
): Promise<T[] | null> {
  const result = await multiselect<T>({
    message: `${chalk.cyan(symbols.arrow)} ${message}`,
    options: options as any,
    required: false,
  });

  return isCancel(result) ? null : result;
}

/**
 * Secure password input
 */
export async function passwordInput(message: string): Promise<string | null> {
  const result = await password({
    message: `${chalk.cyan(symbols.arrow)} ${message}`,
  });

  return isCancel(result) ? null : (result as string);
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

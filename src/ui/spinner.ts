/**
 * Animation & Spinner Utilities
 * Loading animations, progress bars, typewriter effects
 */

import Ora from 'ora';
import { colors, symbols } from './format.js';

// Spinner instances storage for cleanup
const activeSpinners: ReturnType<typeof Ora>[] = [];

/**
 * Create a loading spinner
 */
export function createSpinner(text: string) {
  const spinner = Ora({
    text,
    spinner: {
      interval: 80,
      frames: [
        '▁',
        '▂',
        '▃',
        '▄',
        '▅',
        '▆',
        '▇',
        '█',
        '▇',
        '▆',
        '▅',
        '▄',
        '▃',
        '▁',
      ],
    },
    color: 'cyan',
  });

  activeSpinners.push(spinner);
  return spinner;
}

/**
 * Create a loading spinner with dots animation
 */
export function createDotsSpinner(text: string) {
  const spinner = Ora({
    text,
    spinner: {
      interval: 300,
      frames: ['   ', '•  ', '•• ', '•••', '•• ', '•  '],
    },
    color: 'cyan',
  });

  activeSpinners.push(spinner);
  return spinner;
}

/**
 * Create a line spinner
 */
export function createLineSpinner(text: string) {
  const spinner = Ora({
    text,
    spinner: {
      interval: 120,
      frames: ['-', '▁', '▂', '▃', '▄', '▅', '▆', '█', '▆', '▅', '▄', '▃', '▂'],
    },
    color: 'cyan',
  });

  activeSpinners.push(spinner);
  return spinner;
}

/**
 * Start a simple loading animation
 */
export function startLoading(text: string) {
  return createSpinner(text).start();
}

/**
 * Stop all active spinners
 */
export function stopAllSpinners(): void {
  activeSpinners.forEach(spinner => spinner.stop());
}

/**
 * Stop a specific spinner with success state
 */
export function stopSuccess(spinner: ReturnType<typeof Ora>, text?: string): void {
  spinner.stopAndPersist({
    symbol: colors.success(symbols.success),
    text: text ? colors.success(text) : undefined,
  });
}

/**
 * Stop a spinner with error state
 */
export function stopError(spinner: ReturnType<typeof Ora>, text?: string): void {
  spinner.stopAndPersist({
    symbol: colors.error(symbols.error),
    text: text ? colors.error(text) : undefined,
  });
}

/**
 * Stop a spinner with warning state
 */
export function stopWarning(spinner: ReturnType<typeof Ora>, text?: string): void {
  spinner.stopAndPersist({
    symbol: colors.warning(symbols.warning),
    text: text ? colors.warning(text) : undefined,
  });
}

/**
 * Simple promise-based loading wrapper
 */
export async function withLoading<T>(
  text: string,
  promise: Promise<T>,
  options?: {
    successText?: string;
    errorText?: string;
  }
): Promise<T> {
  const spinner = startLoading(text);

  try {
    const result = await promise;
    stopSuccess(spinner, options?.successText);
    return result;
  } catch (error) {
    stopError(spinner, options?.errorText ?? String(error));
    throw error;
  }
}

/**
 * Progress bar for multi-step tasks
 */
export class ProgressBar {
  private total: number;
  private current: number;
  private title: string;
  private width: number;
  private chars: { fill: string; empty: string };

  constructor(options?: {
    total?: number;
    title?: string;
    width?: number;
    chars?: { fill?: string; empty?: string };
  }) {
    this.total = options?.total ?? 100;
    this.current = 0;
    this.title = options?.title ?? 'Progress';
    this.width = options?.width ?? 30;
    this.chars = {
      fill: options?.chars?.fill ?? '█',
      empty: options?.chars?.empty ?? '░',
    };
  }

  setTotal(total: number): void {
    this.total = total;
  }

  update(current: number, extra?: string): void {
    this.current = current;
    this.render(extra);
  }

  increment(extra?: string): void {
    this.current = Math.min(this.current + 1, this.total);
    this.render(extra);
  }

  private render(extra?: string): void {
    const percent = this.total > 0 ? this.current / this.total : 0;
    const filledLen = Math.floor(percent * this.width);
    const filled = this.chars.fill.repeat(filledLen);
    const empty = this.chars.empty.repeat(this.width - filledLen);
    const percentStr = (percent * 100).toFixed(0).padStart(3);

    const bar = `${colors.primary(filled)}${colors.muted(empty)}`;
    const info = extra ? ` ${colors.muted(`| ${extra}`)}` : '';

    process.stdout.write(
      `\r${colors.primary(symbols.arrow)} ${this.title}: [${bar}] ${percent}%${info}\r`
    );

    if (this.current >= this.total) {
      process.stdout.write('\n');
    }
  }

  done(message?: string): void {
    this.render();
    if (message) {
      console.log(` ${colors.success(symbols.success)} ${message}`);
    }
  }
}

/**
 * Typewriter effect for printing text
 */
export async function typewriter(
  text: string | Promise<string>,
  options?: {
    speed?: number;
    charDelay?: number;
    lineDelay?: number;
    stream?: NodeJS.WriteStream;
  }
): Promise<void> {
  const resolvedText = await text;
  const stream = options?.stream ?? process.stdout;
  const charDelay = options?.charDelay ?? 30;
  const lineDelay = options?.lineDelay ?? 300;
  const speed = options?.speed ?? 50;

  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';

  const lines = resolvedText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim() || 'code';
        stream.write(line + '\n');
        continue;
      } else {
        // End code block - print highlighted code
        inCodeBlock = false;
        await typeLine('', { stream, charDelay: 10, speed });
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockContent = line;
      // Simplified - just print code blocks normally
      stream.write(line + '\n');
      await sleep(lineDelay);
    } else {
      await typeLine(line, { stream, charDelay, speed });
    }
  }
}

async function typeLine(
  text: string,
  options: { speed?: number; charDelay?: number; stream?: NodeJS.WriteStream }
): Promise<void> {
  const stream = options.stream ?? process.stdout;
  const charDelay = options.charDelay ?? 30;
  const speed = options.speed ?? 50;

  // Process ANSI escape codes for colors
  let i = 0;
  while (i < text.length) {
    if (text[i] === '\x1b') {
      // ANSI escape sequence
      let end = i + 1;
      while (end < text.length && !/[A-Za-z]/.test(text[end])) {
        end++;
      }
      if (end < text.length) {
        stream.write(text.slice(i, end + 1));
        i = end + 1;
      }
    } else {
      stream.write(text[i]);
      i++;
      await sleep(charDelay + Math.random() * speed);
    }
  }
  stream.write('\n');
  await sleep(options.charDelay ? options.charDelay * 5 : 150);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Animated status indicator
 */
export function animateStatus(
  status: string,
  states: string[],
  interval = 500
): NodeJS.Timeout {
  let index = 0;

  const timer = setInterval(() => {
    process.stdout.write(`\r${colors.muted(states[index])} ${status}   \r`);
    index = (index + 1) % states.length;
  }, interval);

  return timer;
}

/**
 * Stop status animation
 */
export function stopStatus(timer: NodeJS.Timeout, finalStatus: string): void {
  clearInterval(timer);
  process.stdout.write(`\r${colors.success(symbols.success)} ${finalStatus}\n`);
}

/**
 * Pulse animation for important messages
 */
export async function pulse(
  text: string,
  iterations = 3,
  speed = 500
): Promise<void> {
  for (let i = 0; i < iterations; i++) {
    console.log(` ${colors.primary(symbols.sparkles)} ${text}`);
    await sleep(speed);
  }
}

/**
 * Loading sequence for tasks
 */
export async function runSequence(
  tasks: { text: string; duration: number }[]
): Promise<void> {
  for (const task of tasks) {
    const spinner = startLoading(task.text);
    await sleep(task.duration);
    stopSuccess(spinner, 'Done');
  }
}

/**
 * Stream response with typewriter effect
 */
export async function streamWithTypewriter(
  chunkGenerator: AsyncGenerator<string>,
  onComplete?: () => void
): Promise<void> {
  let isFirst = true;

  for await (const chunk of chunkGenerator) {
    if (isFirst) {
      process.stdout.write('\n');
      isFirst = false;
    }

    // Split chunk into lines and type each line
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        await typeLine(line, { stream: process.stdout, charDelay: 20, speed: 30 });
      } else {
        process.stdout.write('\n');
      }
    }
  }

  if (onComplete) {
    onComplete();
  }
}

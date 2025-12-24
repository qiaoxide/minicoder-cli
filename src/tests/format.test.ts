/**
 * Format 模块测试
 */
import { describe, it, expect } from 'vitest';
import { colors, symbols, boxContent, renderMarkdown, highlightCode } from '../ui/components/index.js';

describe('colors', () => {
  it('should export color functions', () => {
    expect(typeof colors.cyan).toBe('function');
    expect(typeof colors.green).toBe('function');
    expect(typeof colors.error).toBe('function');
    expect(typeof colors.bold).toBe('function');
  });

  it('should apply cyan color', () => {
    const result = colors.cyan('hello');
    expect(result).toContain('hello');
  });
});

describe('symbols', () => {
  it('should export symbol strings', () => {
    expect(typeof symbols.success).toBe('string');
    expect(typeof symbols.error).toBe('string');
    expect(typeof symbols.arrow).toBe('string');
    expect(typeof symbols.bullet).toBe('string');
  });

  it('should have non-empty symbols', () => {
    expect(symbols.success.length).toBeGreaterThan(0);
    expect(symbols.arrow.length).toBeGreaterThan(0);
  });
});

describe('boxContent', () => {
  it('should create a box with content', () => {
    const result = boxContent('test content');
    expect(result).toContain('test content');
  });

  it('should create a box with title', () => {
    const result = boxContent('test content', 'My Title');
    expect(result).toContain('test content');
    expect(result).toContain('My Title');
  });
});

describe('renderMarkdown', () => {
  it('should render plain text', async () => {
    const result = await renderMarkdown('Hello World');
    expect(result).toContain('Hello World');
  });

  it('should render bold text', async () => {
    const result = await renderMarkdown('**bold**');
    expect(result).toContain('bold');
  });

  it('should render italic text', async () => {
    const result = await renderMarkdown('*italic*');
    expect(result).toContain('italic');
  });

  it('should render multiline text', async () => {
    const result = await renderMarkdown('line1\nline2');
    expect(result).toContain('line1');
    expect(result).toContain('line2');
  });

  it('should handle empty string', async () => {
    const result = await renderMarkdown('');
    expect(result).toBe('');
  });
});

describe('highlightCode', () => {
  it('should highlight code', () => {
    const result = highlightCode('const x = 1;', 'typescript');
    expect(result).toContain('const');
  });

  it('should handle unknown language', () => {
    const result = highlightCode('some code', 'unknown-lang');
    // highlight.js wraps content in spans, strip to verify original content exists
    const stripped = result.replace(/<[^>]*>/g, '');
    expect(stripped).toContain('some code');
  });

  it('should handle empty code', () => {
    const result = highlightCode('', 'typescript');
    expect(result).toBe('');
  });
});

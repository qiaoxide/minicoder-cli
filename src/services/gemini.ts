/**
 * Gemini API 客户端
 *
 * 职责：
 * 1. 封装 Gemini REST API 调用
 * 2. 处理认证、请求、响应
 * 3. 错误处理与重试
 * 4. 代理支持
 */

import { getConfig } from '../config/config.js';

// 使用 undici 实现代理支持（Node.js 18+ 原生 fetch 不支持代理）
import { fetch, ProxyAgent, setGlobalDispatcher } from 'undici';

/**
 * Gemini 请求内容
 */
export interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

/**
 * Gemini 生成请求
 */
export interface GeminiGenerateRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
}

/**
 * Gemini 响应
 */
export interface GeminiGenerateResponse {
  candidates?: Array<{
    content: GeminiContent;
    finishReason?: string;
    safetyRatings?: unknown[];
  }>;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: unknown[];
  };
}

/**
 * Gemini API 错误
 */
export class GeminiApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly rawResponse?: unknown
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

/**
 * Gemini 客户端
 */
export class GeminiClient {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model: string;
  private apiKey: string;
  private proxyUrl: string | undefined;

  constructor(model?: string) {
    const config = getConfig();
    this.model = model || config.get('model') || 'gemini-pro';
    this.apiKey = config.get('apiKey') || '';
    this.proxyUrl = config.get('proxy') as string | undefined;

    // 如果配置了代理，设置全局代理
    if (this.proxyUrl) {
      const proxyAgent = new ProxyAgent(this.proxyUrl);
      setGlobalDispatcher(proxyAgent);
    }

    if (!this.apiKey) {
      throw new GeminiApiError(
        '未配置 API Key。请设置 MINICODER_API_KEY 环境变量或运行 mini init 进行配置。'
      );
    }
  }

  /**
   * 生成内容
   */
  async generate(prompt: string): Promise<string> {
    const response = await this.callApi({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback?.blockReason) {
        throw new GeminiApiError(`内容被阻止: ${response.promptFeedback.blockReason}`);
      }
      throw new GeminiApiError('API 返回空响应');
    }

    const candidate = response.candidates[0];
    const text = candidate.content.parts.map((p) => p.text).join('');
    return text;
  }

  /**
   * 对话模式
   */
  async chat(
    messages: Array<{ role: 'user' | 'model'; content: string }>,
    systemPrompt?: string
  ): Promise<string> {
    const contents: GeminiContent[] = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const request: GeminiGenerateRequest = { contents };
    if (systemPrompt) {
      request.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const response = await this.callApi(request);

    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback?.blockReason) {
        throw new GeminiApiError(`内容被阻止: ${response.promptFeedback.blockReason}`);
      }
      throw new GeminiApiError('API 返回空响应');
    }

    const candidate = response.candidates[0];
    const text = candidate.content.parts.map((p) => p.text).join('');
    return text;
  }

  /**
   * 调用 Gemini API
   */
  private async callApi(request: GeminiGenerateRequest): Promise<GeminiGenerateResponse> {
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new GeminiApiError(
          `API 请求失败: ${response.status} ${response.statusText}`,
          response.status,
          errorBody
        );
      }

      return (await response.json()) as GeminiGenerateResponse;
    } catch (error) {
      if (error instanceof GeminiApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new GeminiApiError('网络请求失败，请检查网络连接或代理设置。');
      }
      throw new GeminiApiError(`请求异常: ${error}`);
    }
  }

  /** 获取当前模型 */
  getModel(): string {
    return this.model;
  }

  /** 设置模型 */
  setModel(model: string): void {
    this.model = model;
  }
}

/**
 * 创建 Gemini 客户端的便捷函数
 */
export function createGeminiClient(model?: string): GeminiClient {
  return new GeminiClient(model);
}

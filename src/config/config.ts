/**
 * 配置管理器
 *
 * 职责：
 * 1. 加载配置文件 (~/.minicoderrc 或项目目录 .minicoderrc.json)
 * 2. 读取环境变量
 * 3. 提供配置获取接口
 */

import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/**
 * MiniCoder 配置结构
 */
export interface MiniCoderConfig {
  /** Gemini API Key */
  apiKey?: string;
  /** 默认模型 */
  model?: string;
  /** HTTP 代理地址 */
  proxy?: string;
  /** 跳过代理的主机名（逗号分隔） */
  noProxy?: string;
  /** 项目根目录 */
  projectRoot?: string;
  /** 系统提示词文件路径 */
  systemPromptPath?: string;
  /** 其他配置 */
  [key: string]: unknown;
}

/**
 * 配置管理器单例
 */
export class ConfigManager {
  private static instance: ConfigManager | null = null;
  private config: MiniCoderConfig = {};

  private constructor() {
    this.load();
  }

  /** 获取单例实例 */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /** 加载配置 */
  private load(): void {
    // 1. 优先读取环境变量
    if (process.env.MINICODER_API_KEY) {
      this.config.apiKey = process.env.MINICODER_API_KEY;
    }
    if (process.env.MINICODER_MODEL) {
      this.config.model = process.env.MINICODER_MODEL;
    }
    if (process.env.MINICODER_PROXY) {
      this.config.proxy = process.env.MINICODER_PROXY;
    }
    if (process.env.MINICODER_NO_PROXY) {
      this.config.noProxy = process.env.MINICODER_NO_PROXY;
    }

    // 2. 读取用户主目录配置文件
    const userConfigPath = this.getUserConfigPath();
    if (userConfigPath && existsSync(userConfigPath)) {
      try {
        const content = readFileSync(userConfigPath, 'utf-8');
        const userConfig = JSON.parse(content) as MiniCoderConfig;
        this.merge(userConfig);
      } catch {
        console.warn(`[ConfigManager] 警告：无法读取配置文件 ${userConfigPath}`);
      }
    }

    // 3. 读取项目目录配置文件
    const projectConfigPath = this.getProjectConfigPath();
    if (projectConfigPath && existsSync(projectConfigPath)) {
      try {
        const content = readFileSync(projectConfigPath, 'utf-8');
        const projectConfig = JSON.parse(content) as MiniCoderConfig;
        this.merge(projectConfig);
      } catch {
        console.warn(`[ConfigManager] 警告：无法读取配置文件 ${projectConfigPath}`);
      }
    }
  }

  /** 合并配置（项目配置覆盖全局配置） */
  private merge(newConfig: MiniCoderConfig): void {
    this.config = { ...this.config, ...newConfig };
  }

  /** 获取用户级配置文件路径 */
  private getUserConfigPath(): string | null {
    const home = homedir();
    return join(home, '.minicoderrc.json');
  }

  /** 获取项目级配置文件路径 */
  private getProjectConfigPath(): string | null {
    const cwd = process.cwd();
    const projectRoot = this.config.projectRoot || cwd;
    return join(projectRoot, '.minicoderrc.json');
  }

  /** 获取配置值 */
  get<K extends keyof MiniCoderConfig>(key: K): MiniCoderConfig[K] | undefined {
    return this.config[key];
  }

  /** 获取全部配置 */
  getAll(): MiniCoderConfig {
    return { ...this.config };
  }

  /** 设置配置值 */
  set<K extends keyof MiniCoderConfig>(key: K, value: MiniCoderConfig[K]): void {
    this.config[key] = value;
  }

  /** 保存配置到用户目录 */
  saveToUser(): void {
    const path = this.getUserConfigPath();
    if (!path) {
      throw new Error('无法确定用户配置路径');
    }
    this.save(path);
  }

  /** 保存配置到项目目录 */
  saveToProject(): void {
    const path = this.getProjectConfigPath();
    if (!path) {
      throw new Error('无法确定项目配置路径');
    }
    this.save(path);
  }

  /** 保存配置到指定路径 */
  private save(path: string): void {
    try {
      const content = JSON.stringify(this.config, null, 2);
      writeFileSync(path, content, 'utf-8');
    } catch (error) {
      throw new Error(`无法保存配置文件到 ${path}: ${error}`);
    }
  }

  /** 检查 API Key 是否已配置 */
  hasApiKey(): boolean {
    return !!this.config.apiKey;
  }
}

/**
 * 获取配置管理器实例的便捷函数
 */
export function getConfig(): ConfigManager {
  return ConfigManager.getInstance();
}

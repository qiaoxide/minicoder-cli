/**
 * init 命令
 *
 * 职责：初始化 MiniCoder 配置
 */

import type { Command, CommandArgs } from '../types/command.js';
import { ConfigManager, getConfig } from '../config/config.js';
import { text, password, select, confirm } from '../ui/components/index.js';
import {
	Header,
	Divider,
	KeyValue,
	Success,
	Error as ErrorMsg,
	Info,
	Warning,
	MessageBox,
	withLoading,
} from '../ui/components/index.js';

/**
 * 初始化命令
 */
export class InitCommand implements Command {
  name = 'init';
  description = '初始化 MiniCoder 配置';
  alias = 'i';

  async execute(args: CommandArgs): Promise<void> {
    const config = getConfig();
    const apiKey = args['api-key'] as string | undefined;
    const model = args['model'] as string | undefined;
    const proxy = args['proxy'] as string | undefined;
    const saveToUser = !(args['local'] as boolean);

    Header('MiniCoder 配置初始化', { symbol: '━' });

    // 1. 设置 API Key
    if (apiKey) {
      config.set('apiKey', apiKey);
      Success('API Key 已设置');
    } else if (config.hasApiKey()) {
      Success('已检测到现有 API Key 配置');
    } else {
      Header('API Key 配置');
      Info('请从 https://aistudio.google.com/app/apikey 获取你的 API Key');
      Info('或设置环境变量: export MINICODER_API_KEY="your-key"');

      const newApiKey = await password('输入你的 Gemini API Key');
      if (newApiKey === null || !newApiKey) {
        Info('跳过 API Key 配置，可稍后通过环境变量设置');
        config.set('apiKey', 'YOUR_API_KEY_HERE');
      } else {
        config.set('apiKey', newApiKey);
        Success('API Key 已配置');
      }
    }

    // 2. 设置模型
    Header('模型选择');
    if (model) {
      config.set('model', model);
      Success(`模型已设置为: ${model}`);
    } else if (config.get('model')) {
      KeyValue('当前模型', String(config.get('model')));
    } else {
      const modelChoice = await select('选择模型', [
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', hint: '快速响应，推荐日常使用' },
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', hint: '高质量输出，适合复杂任务' },
        { value: 'gemini-pro', label: 'Gemini Pro', hint: '平衡性能和成本' },
      ]);

      if (modelChoice !== null && modelChoice) {
        config.set('model', modelChoice);
        Success(`模型已设置为: ${modelChoice}`);
      } else {
        config.set('model', 'gemini-2.5-flash');
        Info('使用默认模型: gemini-2.5-flash');
      }
    }

    // 3. 设置代理
    Header('代理配置');
    if (proxy) {
      config.set('proxy', proxy);
      Success(`代理已设置为: ${proxy}`);
    } else if (config.get('proxy')) {
      KeyValue('当前代理', String(config.get('proxy')));
    } else {
      const useProxy = await confirm('需要配置代理吗?');
      if (useProxy === true) {
        const proxyUrl = await text('输入代理地址', {
          placeholder: 'http://127.0.0.1:7890',
        });
        if (proxyUrl !== null && proxyUrl) {
          config.set('proxy', proxyUrl);
          Success(`代理已设置为: ${proxyUrl}`);
        }
      } else {
        Info('使用直连模式');
      }
    }

    // 4. 保存配置
    Header('保存配置');
    try {
      if (saveToUser) {
        config.saveToUser();
        Success('配置已保存到用户目录');
        Info('可通过环境变量 MINICODER_API_KEY 覆盖');
      } else {
        config.saveToProject();
        Success('配置已保存到项目目录 (.minicoderrc.json)');
      }
    } catch (error) {
      throw new Error(`保存配置失败: ${error}`);
    }

    // 5. 显示配置摘要
    Header('配置摘要');
    MessageBox(
      [
        `API Key: ${config.hasApiKey() ? '✓ 已配置' : '✗ 未配置'}`,
        `模型: ${String(config.get('model'))}`,
        `代理: ${config.get('proxy') ? String(config.get('proxy')) : '✗ 未配置'}`,
      ].join('\n'),
      { type: 'default', title: '当前配置' }
    );

    // 6. 测试 API 连接
    if (config.hasApiKey() && config.get('apiKey') !== 'YOUR_API_KEY_HERE') {
      Header('API 连接测试');

      const connected = await withLoading(
        '测试 API 连接...',
        (async () => {
          try {
            const { GeminiClient } = await import('../services/gemini.js');
            const client = new GeminiClient();
            await client.generate('Hello');
            return true;
          } catch {
            return false;
          }
        })(),
        { successText: '连接成功', errorText: '连接失败' }
      );

      if (connected) {
        Success('API 连接测试通过');
        Info('你可以开始使用 MiniCoder 了！');
      } else {
        ErrorMsg('API 连接失败');
        Info('请检查 API Key 或代理设置');
      }
    } else {
      Warning('请设置有效的 API Key 后再测试连接');
    }

    Divider();
    Success('初始化完成！运行 mini chat 开始对话');
  }
}

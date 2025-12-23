/**
 * init 命令
 *
 * 职责：初始化 MiniCoder 配置
 */

import type { Command, CommandArgs } from '../types/command.js';
import { ConfigManager, getConfig } from '../config/config.js';
import {
  colors,
  symbols,
  printHeader,
  printSection,
  printKeyValue,
  printSuccess,
  printError,
  printInfo,
  printWarning,
  printDivider,
  boxContent,
} from '../ui/format.js';
import {
  textInput,
  passwordInput,
  singleSelect,
  confirmAction,
} from '../ui/input.js';
import {
  withLoading,
} from '../ui/spinner.js';

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

    printHeader('MiniCoder 配置初始化', '设置你的 API Key 和偏好');

    // 1. 设置 API Key
    if (apiKey) {
      config.set('apiKey', apiKey);
      printSuccess(`API Key 已设置`);
    } else if (config.hasApiKey()) {
      printSuccess(`已检测到现有 API Key 配置`);
    } else {
      printSection('API Key 配置');
      printInfo('请从 https://aistudio.google.com/app/apikey 获取你的 API Key');
      printInfo('或设置环境变量: export MINICODER_API_KEY="your-key"');

      const newApiKey = await passwordInput('输入你的 Gemini API Key');
      if (newApiKey === null || !newApiKey) {
        printInfo('跳过 API Key 配置，可稍后通过环境变量设置');
        config.set('apiKey', 'YOUR_API_KEY_HERE');
      } else {
        config.set('apiKey', newApiKey);
        printSuccess('API Key 已配置');
      }
    }

    // 2. 设置模型
    printSection('模型选择');
    if (model) {
      config.set('model', model);
      printSuccess(`模型已设置为: ${model}`);
    } else if (config.get('model')) {
      printKeyValue('当前模型', String(config.get('model')));
    } else {
      const modelChoice = await singleSelect('选择模型', [
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', hint: '快速响应，推荐日常使用' },
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', hint: '高质量输出，适合复杂任务' },
        { value: 'gemini-pro', label: 'Gemini Pro', hint: '平衡性能和成本' },
      ]);

      if (modelChoice !== null && modelChoice) {
        config.set('model', modelChoice);
        printSuccess(`模型已设置为: ${modelChoice}`);
      } else {
        config.set('model', 'gemini-1.5-flash');
        printInfo('使用默认模型: gemini-1.5-flash');
      }
    }

    // 3. 设置代理
    printSection('代理配置');
    if (proxy) {
      config.set('proxy', proxy);
      printSuccess(`代理已设置为: ${proxy}`);
    } else if (config.get('proxy')) {
      printKeyValue('当前代理', String(config.get('proxy')));
    } else {
      const useProxy = await confirmAction('需要配置代理吗?');
      if (useProxy === true) {
        const proxyUrl = await textInput('输入代理地址', {
          placeholder: 'http://127.0.0.1:7890',
        });
        if (proxyUrl !== null && proxyUrl) {
          config.set('proxy', proxyUrl);
          printSuccess(`代理已设置为: ${proxyUrl}`);
        }
      } else {
        printInfo('使用直连模式');
      }
    }

    // 4. 保存配置
    printSection('保存配置');
    try {
      if (saveToUser) {
        config.saveToUser();
        printSuccess('配置已保存到用户目录');
        printInfo('可通过环境变量 MINICODER_API_KEY 覆盖');
      } else {
        config.saveToProject();
        printSuccess('配置已保存到项目目录 (.minicoderrc.json)');
      }
    } catch (error) {
      throw new Error(`保存配置失败: ${error}`);
    }

    // 5. 显示配置摘要
    printSection('配置摘要');
    const configBox = boxContent(
      [
        `API Key: ${config.hasApiKey() ? colors.success('✓ 已配置') : colors.warning('✗ 未配置')}`,
        `模型: ${String(config.get('model'))}`,
        `代理: ${config.get('proxy') ? String(config.get('proxy')) : colors.muted('✗ 未配置')}`,
      ].join('\n'),
      '当前配置'
    );
    console.log(configBox);

    // 6. 测试 API 连接
    if (config.hasApiKey() && config.get('apiKey') !== 'YOUR_API_KEY_HERE') {
      printSection('API 连接测试');

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
        printSuccess('API 连接测试通过');
        printInfo('你可以开始使用 MiniCoder 了！');
      } else {
        printError('API 连接失败');
        printInfo('请检查 API Key 或代理设置');
      }
    } else {
      printWarning('请设置有效的 API Key 后再测试连接');
    }

    printDivider();
    printSuccess('初始化完成！运行 ' + colors.cyan('mini chat') + ' 开始对话');
  }
}

/**
 * chat 命令
 *
 * 职责：交互式对话模式 - ClaudeCode 风格
 */

import type { Command, CommandArgs } from '../types/command.js';
import { createGeminiClient } from '../services/gemini.js';
import {
	chatInput,
	UserMessage,
	AiMessage,
	Welcome,
	HelpPanel,
	History,
	Goodbye,
	Cleared,
	ChatError,
} from '../ui/print/index.js';

/**
 * 对话消息
 */
interface ChatMessage {
	role: 'user' | 'model';
	content: string;
}

/**
 * 对话命令
 */
export class ChatCommand implements Command {
	name = 'chat';
	description = '交互式对话模式';
	alias = 'c';

	async execute(args: CommandArgs): Promise<void> {
		const model = args['model'] as string | undefined;

		// 欢迎界面
		Welcome(model);

		const messages: ChatMessage[] = [];
		const client = createGeminiClient(model);

		// 交互循环
		while (true) {
			const input = await chatInput('你:');

			if (input === null) {
				Goodbye();
				break;
			}

			const trimmed = input.trim();

			// 处理命令
			if (trimmed === '/exit' || trimmed === '/quit') {
				Goodbye();
				break;
			}
			if (trimmed === '/clear') {
				messages.length = 0;
				Cleared();
				continue;
			}
			if (trimmed === '/help') {
				HelpPanel();
				continue;
			}
			if (trimmed === '/history') {
				History(messages);
				continue;
			}

			if (!trimmed) continue;

			// 显示用户消息
			UserMessage(trimmed);
			messages.push({ role: 'user', content: trimmed });

			try {
				// AI 响应
				const response = await client.chat(messages);
				await AiMessage(response, { modelName: model, showThinking: true });

				messages.push({ role: 'model', content: response });
			} catch (error) {
				ChatError(String(error));
				messages.pop(); // 移除失败的用户消息
			}
		}
	}
}

/**
 * 单次对话命令（非交互模式）
 */
export class AskCommand implements Command {
	name = 'ask';
	description = '单次问答';
	alias = 'a';

	async execute(args: CommandArgs): Promise<void> {
		const positional = args._;
		const prompt = positional?.[0];
		if (!prompt) {
			throw new Error('请提供问题，例如: mini ask "你好"');
		}

		const model = args['model'] as string | undefined;

		console.log('');
		const client = createGeminiClient(model);

		try {
			const response = await client.generate(prompt);
			await AiMessage(response, { modelName: model, showThinking: false });
		} catch (error) {
			throw new Error(`生成失败: ${error}`);
		}
	}
}

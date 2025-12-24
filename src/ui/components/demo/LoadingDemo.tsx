/**
 * Loading 组件演示
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import {
	Loading,
	Dots,
	Line,
	Pulse,
	LoadingSuccess,
	LoadingFail,
	LoadingWarn,
	ProgressBar,
	StepProgress,
	Thinking,
	withLoading,
} from '../index.js';

interface DemoProps {
	onComplete: () => void;
}

/**
 * Loading 演示组件
 */
export function LoadingDemo({ onComplete }: DemoProps) {
	const [step, setStep] = useState(0);
	const [output, setOutput] = useState<string[]>([]);

	const addOutput = (text: string) => {
		setOutput((prev) => [...prev, text]);
	};

	useEffect(() => {
		const runDemo = async () => {
			// Step 1: 基础 Loading
			addOutput('--- 1. 基础 Loading ---');
			const loader1 = Loading('正在初始化...').start();
			await sleep(1000);
			LoadingSuccess(loader1, '初始化完成');
			addOutput('✓ 初始化完成\n');

			// Step 2: Dots 动画
			addOutput('--- 2. Dots 动画 (思考中) ---');
			const loader2 = Dots('AI 思考中').start();
			await sleep(1500);
			LoadingSuccess(loader2, '思考完成');
			addOutput('✓ 思考完成\n');

			// Step 3: Line 动画
			addOutput('--- 3. Line 动画 ---');
			const loader3 = Line('数据传输中').start();
			await sleep(1000);
			LoadingWarn(loader3, '连接缓慢');
			addOutput('⚠ 连接缓慢\n');

			// Step 4: Pulse 动画
			addOutput('--- 4. Pulse 动画 ---');
			const loader4 = Pulse('脉冲加载').start();
			await sleep(1000);
			LoadingFail(loader4, '加载失败');
			addOutput('✗ 加载失败\n');

			// Step 5: 进度条
			addOutput('--- 5. 进度条 ---');
			const bar = new ProgressBar({ total: 20, title: '下载' });
			for (let i = 0; i <= 20; i++) {
				bar.update(i, `${i * 5}%`);
				await sleep(50);
			}
			bar.done('下载完成');
			addOutput('✓ 下载完成\n');

			// Step 6: 步骤进度
			addOutput('--- 6. 步骤进度 ---');
			const steps = new StepProgress(['下载文件', '解压', '安装依赖', '配置完成']);
			await sleep(500);
			steps.next();
			await sleep(500);
			steps.next();
			await sleep(500);
			steps.next();
			await sleep(500);
			steps.done();
			addOutput('✓ 配置完成\n');

			// Step 7: Thinking (AI 场景)
			addOutput('--- 7. AI Thinking (用于 AiMessage) ---');
			const thinking = await Thinking('思考中...');
			await sleep(1500);
			LoadingSuccess(thinking, '思考完成');
			addOutput('✓ 思考完成\n');

			// Step 8: withLoading Promise 包装
			addOutput('--- 8. withLoading Promise 包装 ---');
			try {
				await withLoading('保存数据...', saveDataFake(), {
					successText: '保存成功',
					errorText: '保存失败',
				});
				addOutput('✓ 保存成功\n');
			} catch {
				addOutput('✗ 保存失败\n');
			}

			setStep(8);
			onComplete();
		};

		runDemo();
	}, []);

	return (
		<Box flexDirection="column" margin={1}>
			<Text color="cyan" bold>
				━━ Loading 组件演示 ━━
			</Text>

			{output.map((line, i) => (
				<Text key={i} color="gray">
					{line}
				</Text>
			))}

			{step < 8 && (
				<Box marginTop={1}>
					<Text color="yellow">运行中... ({step}/8)</Text>
				</Box>
			)}

			{step >= 8 && (
				<Box marginTop={1}>
					<Text color="green">✓ 演示完成！</Text>
				</Box>
			)}
		</Box>
	);
}

async function saveDataFake(): Promise<void> {
	await sleep(500);
}

/**
 * 模拟延迟
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

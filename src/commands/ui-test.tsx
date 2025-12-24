/**
 * UI 测试命令
 *
 * 职责：在真实终端环境中测试 ink 组件
 *
 * 使用方法:
 *   mini ui-test          # 交互式选择要测试的组件
 *   mini ui-test input    # 直接测试 TextInput
 *   mini ui-test select   # 直接测试 Select
 *   mini ui-test confirm  # 直接测试 Confirm
 *   mini ui-test all      # 测试全部组件
 */

import type { Command, CommandArgs } from '../types/command.js';
import { inkSelect } from '../ui/components/index.js';
import { renderAsync } from '../ui/components/render.js';
import {
  DemoInput,
  DemoSelect,
  DemoConfirm,
  DemoAll,
  MultiDemo,
  printOtherUIDemo,
  LoadingDemo,
} from '../ui/components/demo/index.js';
import chalk from 'chalk';

/**
 * UI 测试命令
 */
export class UiTestCommand implements Command {
  name = 'ui-test';
  alias = 'ut';
  description = '交互式测试 ink 组件';

  async execute(args: CommandArgs): Promise<void> {
    // 直接指定组件类型
    const component = args._?.[0] as string | undefined;

    if (component) {
      await this.runComponent(component);
      return;
    }

    // 交互式选择
    await this.interactiveSelect();
  }

  /**
   * 运行指定组件
   */
  private async runComponent(type: string): Promise<void> {
    switch (type.toLowerCase()) {
      case 'input':
      case 'text':
        await renderAsync(<DemoInput />);
        break;

      case 'multi':
      case 'multiline':
        await renderAsync(<MultiDemo />);
        break;

      case 'select':
      case 'choice':
        await renderAsync(<DemoSelect />);
        break;

      case 'confirm':
      case 'yesno':
        await renderAsync(<DemoConfirm />);
        break;

      case 'all':
      case 'full':
        await renderAsync(<DemoAll />);
        break;

      case 'ui':
        printOtherUIDemo();
        break;

      case 'loading':
        await renderAsync(<LoadingDemo onComplete={() => { console.log('使用 --help 查看帮助') }} />);
        break;

      default:
        console.log(`\n${chalk.red('✗')} 未知组件类型: ${type}`);
        console.log(chalk.gray('可用类型: input, multi, select, confirm, all\n'));
        console.log('使用 --help 查看帮助');
        break;
    }
  }

  /**
   * 交互式选择组件
   */
  private async interactiveSelect(): Promise<void> {
    // 打印欢迎信息
    console.log('');
    console.log(chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan.bold('     MiniCoder UI 组件测试工具'));
    console.log(chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(chalk.gray('在真实终端环境中测试 ink 组件交互'));
    console.log('');

    const choice = await inkSelect('选择要测试的组件:', [
      {
        value: 'input',
        label: 'TextInput（单行输入）',
        hint: '测试基础输入、光标移动、删除',
      },
      {
        value: 'multi',
        label: 'MultiLineInput（多行输入）',
        hint: '测试多行编辑、行号显示',
      },
      {
        value: 'select',
        label: 'Select（单选/多选）',
        hint: '测试键盘导航、选择回调',
      },
      {
        value: 'confirm',
        label: 'Confirm（确认对话框）',
        hint: '测试快捷键、状态切换',
      },
      {
        value: 'all',
        label: '全部组件（组合测试）',
        hint: '测试多个组件的状态隔离',
      },
    ]);

    if (!choice) {
      console.log(`\n${chalk.yellow('⚠')} 已取消测试`);
      return;
    }

    console.log('');

    switch (choice) {
      case 'input':
        await renderAsync(<DemoInput />);
        break;
      case 'multi':
        await renderAsync(<MultiDemo />);
        break;
      case 'select':
        await renderAsync(<DemoSelect />);
        break;
      case 'confirm':
        await renderAsync(<DemoConfirm />);
        break;
      case 'all':
        await renderAsync(<DemoAll />);
        break;
    }

    console.log('');
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('测试完成！'));
    console.log(chalk.gray('运行 mini ui-test 继续测试其他组件'));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
  }
}

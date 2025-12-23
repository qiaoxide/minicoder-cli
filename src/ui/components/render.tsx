/**
 * Ink 渲染工具
 * 提供在现有 CLI 中使用 Ink 组件的方式
 */

import React from 'react';
import { render } from 'ink';

/**
 * 渲染 Ink 组件并等待退出
 * @param component 要渲染的 React 组件
 */
export async function renderAsync(component: React.ReactElement): Promise<void> {
  const instance = render(component);
  await instance.waitUntilExit();
}

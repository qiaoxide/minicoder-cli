import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',

    // 全局 API（类似 Jest）
    globals: true,

    // 包含的测试文件
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],

    // 排除的文件
    exclude: ['node_modules', 'dist'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
    },

    // UI 模式
    ui: true,

    // TypeScript 支持
    typecheck: {
      enabled: true,
      tsconfig: 'tsconfig.json',
    },
  },

  // TypeScript 路径别名支持
  plugins: [tsconfigPaths()],
});

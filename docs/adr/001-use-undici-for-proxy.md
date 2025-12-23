# 001 - 使用 undici 实现代理支持

## 状态

已采纳

## 背景

Node.js 18+ 原生 `fetch` API 不支持直接配置 HTTP 代理，而用户环境需要通过代理访问 Gemini API。环境变量代理设置不够可靠，需要在程序内配置。

## 决策

使用 [undici](https://github.com/nodejs/undici) 库的 `ProxyAgent` 和 `setGlobalDispatcher` 实现代理支持。

```typescript
import { fetch, ProxyAgent, setGlobalDispatcher } from 'undici';

const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);
const response = await fetch(url);
```

### 备选方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| undici | Node.js 官方高性能客户端，直接支持代理 | 需要额外依赖 |
| https-proxy-agent | 成熟方案，支持多种代理 | 依赖较老 |
| 环境变量 | 无代码改动 | 不够可靠 |

## 后果

### 正面
- 支持 HTTP、SOCKS5 等多种代理协议
- 配置与代码分离，通过配置文件或环境变量控制
- undici 性能优于原生 fetch

### 负面
- 增加 `undici` 依赖（约 1MB）
- 需要在项目初始化时安装

## 引用

- 相关 issue: 代理配置需求
- undici 文档: https://undici.nodejs.org/

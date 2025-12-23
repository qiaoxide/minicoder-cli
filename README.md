# MiniCoder CLI

A CLI tool for coding, writing, and thinking notes. Built with Node.js + TypeScript, powered by Gemini API.

## Features

- Simple and extensible command architecture
- TypeScript for type safety
- Gemini API integration ready

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Development
npm run dev -- <command>

# Build
npm run build

# Install globally
npm install -g .
mini <command>
```

## Commands

- `hello` - Say hello (example command)

## Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with tsx |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | Type check only |
| `npm run lint` | Run ESLint |
| `npm run fmt` | Format with Prettier |

## Project Structure

```
src/
├── cli/           # CLI entry point
├── commands/      # Command implementations
├── core/          # Core framework
├── services/      # API services
├── utils/         # Utilities
├── types/         # Type definitions
└── index.ts       # Main entry
```

## Philosophy

Built with [第一性原理](CLAUDE.md) - simple code, solve real problems.

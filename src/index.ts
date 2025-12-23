#!/usr/bin/env node

import { Cli } from './cli/index.js';
import { HelloCommand } from './commands/hello.js';
import { InitCommand } from './commands/init.js';
import { ChatCommand, AskCommand } from './commands/chat.js';

const cli = new Cli('mini');

// 注册命令
cli.register(new HelloCommand());
cli.register(new InitCommand());
cli.register(new ChatCommand());
cli.register(new AskCommand());

// 运行 CLI
cli.run(process.argv);

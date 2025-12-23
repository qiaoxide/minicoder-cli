#!/usr/bin/env node

import { CommandDispatcher } from '../core/dispatcher.js';
import type { CommandArgs, Command } from '../types/command.js';

export class Cli {
  private dispatcher: CommandDispatcher;
  private readonly binName: string;

  constructor(binName = 'mini') {
    this.dispatcher = new CommandDispatcher();
    this.binName = binName;
  }

  register<T extends Command>(command: T): void {
    this.dispatcher.register(command);
  }

  async run(argv: string[]): Promise<void> {
    const commandName = argv[2];

    if (!commandName || commandName === '--help' || commandName === '-h') {
      this.printHelp();
      return;
    }

    const args = this.parseArgs(argv);
    await this.dispatcher.dispatch(commandName, args);
  }

  private parseArgs(argv: string[]): CommandArgs {
    const args: CommandArgs = {};
    const rawArgs = argv.slice(3);
    const positional: string[] = [];

    for (let i = 0; i < rawArgs.length; i++) {
      const arg = rawArgs[i];
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const next = rawArgs[i + 1];
        args[key] = !next || next.startsWith('-') ? true : next;
        i += next && !next.startsWith('-') ? 1 : 0;
      } else if (arg.startsWith('-')) {
        args[arg.slice(1)] = true;
      } else {
        positional.push(arg);
      }
    }

    if (positional.length > 0) {
      args['_'] = positional;
    }

    return args;
  }

  private printHelp(): void {
    const commands = this.dispatcher.getAllCommands();
    const unique = new Map<string, Command>();
    for (const c of commands) {
      if (!unique.has(c.name)) {
        unique.set(c.name, c);
      }
    }
    console.log(`
Usage: ${this.binName} <command> [options]

Commands:
${Array.from(unique.values())
        .map((c) => `  ${c.name.padEnd(12)} ${c.description}`)
        .join('\n')}

Options:
  --help, -h     Show this help message
  --verbose      Enable verbose output
`);
  }
}

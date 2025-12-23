import type { Command, CommandArgs } from '../types/command.js';

/**
 * 命令分发器
 */
export class CommandDispatcher {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
    if (command.alias) {
      this.commands.set(command.alias, command);
    }
  }

  async dispatch(name: string, args: CommandArgs): Promise<void> {
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Unknown command: ${name}`);
    }
    await command.execute(args);
  }

  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}

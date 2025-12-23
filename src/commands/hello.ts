import type { Command, CommandArgs } from '../types/command.js';

/**
 * 示例命令
 */
export class HelloCommand implements Command {
  name = 'hello';
  description = 'Say hello';
  alias = 'hi';

  execute(args: CommandArgs): void {
    const name = (args.name as string) || 'World';
    console.log(`Hello, ${name}!`);
  }
}

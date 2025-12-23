/**
 * 命令接口定义
 */
export interface Command {
  name: string;
  description: string;
  alias?: string;
  args?: CommandArg[];
  execute(_args: CommandArgs): Promise<void> | void;
}

export interface CommandArg {
  name: string;
  required?: boolean;
  description: string;
}

export interface CommandArgs {
  /** 位置参数 */
  _?: string[];
  /** 选项参数 */
  [key: string]: string | boolean | string[] | undefined;
}

export interface AgentConfig {
  name: string;
  permissions: ('read' | 'write' | 'execute')[];
  model?: string;
}

export abstract class BaseAgent {
  public readonly config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract getPromptPrefix(): string;

  canRead(): boolean { return this.config.permissions.includes('read'); }
  canWrite(): boolean { return this.config.permissions.includes('write'); }
  canExecute(): boolean { return this.config.permissions.includes('execute'); }
}

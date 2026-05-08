import { BaseAgent } from './base';

export class BuildAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Build Agent',
      permissions: ['read', 'write', 'execute'],
    });
  }

  getPromptPrefix(): string {
    return 'You are the Build Agent. You have full access to read, write, and execute commands. Generate production-quality code.';
  }
}

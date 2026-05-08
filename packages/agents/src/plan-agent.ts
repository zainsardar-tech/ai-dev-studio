import { BaseAgent } from './base';

export class PlanAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Plan Agent',
      permissions: ['read'],
    });
  }

  getPromptPrefix(): string {
    return 'You are the Plan Agent. You have read-only access. Analyze, plan, and suggest architecture. Do not modify any files.';
  }
}

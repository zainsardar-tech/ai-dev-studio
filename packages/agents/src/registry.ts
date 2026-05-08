import { BaseAgent } from './base';
import { BuildAgent } from './build-agent';
import { PlanAgent } from './plan-agent';

export class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  constructor() {
    this.register(new BuildAgent());
    this.register(new PlanAgent());
  }

  register(agent: BaseAgent): void {
    this.agents.set(agent.config.name.toLowerCase(), agent);
  }

  get(name: string): BaseAgent | undefined {
    return this.agents.get(name.toLowerCase());
  }

  list(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
}

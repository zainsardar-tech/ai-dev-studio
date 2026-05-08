export type Permission = 'file:read' | 'file:write' | 'terminal:execute' | 'network:access';

export interface PermissionPrompt {
  id: string;
  permission: Permission;
  target: string;
  agent: string;
  resolved: boolean;
  granted?: boolean;
}

export class PermissionManager {
  private prompts: Map<string, PermissionPrompt> = new Map();

  request(permission: Permission, target: string, agent: string): PermissionPrompt {
    const prompt: PermissionPrompt = {
      id: crypto.randomUUID(),
      permission,
      target,
      agent,
      resolved: false,
    };
    this.prompts.set(prompt.id, prompt);
    return prompt;
  }

  resolve(id: string, granted: boolean): void {
    const prompt = this.prompts.get(id);
    if (prompt) {
      prompt.resolved = true;
      prompt.granted = granted;
    }
  }

  isGranted(permission: Permission, target: string): boolean {
    for (const [, prompt] of this.prompts) {
      if (prompt.permission === permission && prompt.target === target && prompt.resolved) {
        return prompt.granted ?? false;
      }
    }
    return false;
  }
}

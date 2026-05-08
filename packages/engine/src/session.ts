import { execSync } from 'child_process';
import type { SessionInfo } from './types';

export class SessionManager {
  create(projectId: string): SessionInfo {
    const output = execSync(`opencode session create --json`, { encoding: 'utf-8' });
    const data = JSON.parse(output);
    return {
      id: data.id,
      projectId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  list(): SessionInfo[] {
    const output = execSync(`opencode session list --json`, { encoding: 'utf-8' });
    return JSON.parse(output);
  }

  continue(sessionId: string): void {
    execSync(`opencode session continue ${sessionId}`, { stdio: 'inherit' });
  }

  delete(sessionId: string): void {
    execSync(`opencode session delete ${sessionId}`, { stdio: 'inherit' });
  }
}

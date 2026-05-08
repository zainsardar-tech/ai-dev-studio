import { execSync } from 'child_process';
import type { SystemDeps } from './types';

export class SystemDetector {
  async detect(): Promise<SystemDeps> {
    return {
      node: this.check('node --version'),
      pnpm: this.check('pnpm --version'),
      opencode: this.check('opencode --version'),
      git: this.check('git --version'),
    };
  }

  private check(command: string): { installed: boolean; version?: string } {
    try {
      const output = execSync(command, { encoding: 'utf-8', timeout: 5000 }).trim();
      return { installed: true, version: output.split('\n')[0] };
    } catch {
      return { installed: false };
    }
  }
}

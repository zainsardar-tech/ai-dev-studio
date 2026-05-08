import { execSync } from 'child_process';

export class Installer {
  async installPnpm(): Promise<void> {
    execSync('npm install -g pnpm', { stdio: 'inherit' });
  }

  async installOpenCode(): Promise<void> {
    execSync('npm install -g opencode', { stdio: 'inherit' });
  }

  async upgradeOpenCode(): Promise<void> {
    execSync('opencode upgrade', { stdio: 'inherit' });
  }

  async createWorkspace(dir: string): Promise<void> {
    execSync(`mkdir -p "${dir}"`, { stdio: 'inherit' });
  }
}

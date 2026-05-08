import { ChildProcess, spawn } from 'child_process';
import { OpenCodeClient } from '@zarixsol/engine';

export class LifecycleManager {
  private processes: Map<string, ChildProcess> = new Map();
  private opencodeClient?: OpenCodeClient;

  async startOpenCode(port = 9876): Promise<void> {
    const proc = spawn('opencode', ['serve', '--port', String(port), '--hostname', '127.0.0.1'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    proc.stdout?.on('data', (data) => process.stdout.write(`[opencode] ${data}`));
    proc.stderr?.on('data', (data) => process.stderr.write(`[opencode:err] ${data}`));

    this.processes.set('opencode', proc);
    this.opencodeClient = new OpenCodeClient(port);

    await this.waitForServer(port);
  }

  async stopAll(): Promise<void> {
    for (const [name, proc] of this.processes) {
      proc.kill();
      this.processes.delete(name);
    }
  }

  private async waitForServer(port: number, maxRetries = 30): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const resp = await fetch(`http://127.0.0.1:${port}/health`);
        if (resp.ok) return;
      } catch {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    throw new Error('OpenCode server failed to start');
  }

  getOpenCodeClient(): OpenCodeClient {
    if (!this.opencodeClient) throw new Error('OpenCode not started');
    return this.opencodeClient;
  }
}

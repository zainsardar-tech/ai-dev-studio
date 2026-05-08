import express from 'express';
import cors from 'cors';
import { createServer, get as httpGet } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketHandler } from './websocket';
import setupRoutes from './routes/setup';
import healthRoutes from './routes/health';
import { spawn, ChildProcess } from 'child_process';

export class BridgeServer {
  private app = express();
  private httpServer = createServer(this.app);
  private wss = new WebSocketServer({ server: this.httpServer });
  private port: number;
  private opencodePort = 9876;
  private opencodeProcess?: ChildProcess;

  constructor(port = 3456) {
    this.port = port;
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/api/setup', setupRoutes);
    this.app.use('/api', healthRoutes);

    this.wss.on('connection', (ws) => new WebSocketHandler(ws, this.opencodePort));
  }

  async start(): Promise<void> {
    await this.startOpenCode();
    this.httpServer.listen(this.port, '127.0.0.1', () => {
      console.log(`[bridge] Server running on http://127.0.0.1:${this.port}`);
    });
  }

  private async startOpenCode(): Promise<void> {
    console.log('[bridge] Starting OpenCode server...');

    this.opencodeProcess = spawn('opencode', [
      'serve', '--port', String(this.opencodePort),
      '--hostname', '127.0.0.1',
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.opencodeProcess.stdout?.on('data', (d: Buffer) => process.stdout.write(`[opencode] ${d}`));
    this.opencodeProcess.stderr?.on('data', (d: Buffer) => process.stderr.write(`[opencode:err] ${d}`));
    this.opencodeProcess.on('exit', (code) => console.log(`[opencode] Exited with code ${code}`));

    await this.waitForOpenCode();
    console.log('[bridge] OpenCode server ready');
  }

  private async waitForOpenCode(retries = 60): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const alive = await new Promise<boolean>((resolve) => {
          const req = httpGet(
            `http://127.0.0.1:${this.opencodePort}/health`,
            (res) => {
              resolve(true);
              res.resume();
            },
          );
          req.on('error', () => resolve(false));
          req.setTimeout(2000, () => { req.destroy(); resolve(false); });
        });
        if (alive) return;
      } catch { /* server not ready yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error('OpenCode server failed to start within 60s');
  }

  stop(): void {
    this.opencodeProcess?.kill();
    this.httpServer.close();
    this.wss.close();
  }
}

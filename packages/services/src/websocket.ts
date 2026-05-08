import { WebSocket } from 'ws';
import { OpenCodeClient } from '@zarixsol/engine';

interface ChatRequest {
  type: 'chat';
  message: string;
  sessionId?: string;
  agent?: string;
}

export class WebSocketHandler {
  private ws: WebSocket;
  private opencode: OpenCodeClient;

  constructor(ws: WebSocket, opencodePort: number = 9876) {
    this.ws = ws;
    this.opencode = new OpenCodeClient(opencodePort);
    this.setup();
  }

  private setup(): void {
    this.ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        this.handleMessage(msg);
      } catch {
        this.send({ type: 'error', data: 'Invalid message format' });
      }
    });

    this.ws.on('close', () => {
      console.log('[ws] Client disconnected');
    });

    this.send({ type: 'connected', message: 'Bridge connected' });
  }

  private async handleMessage(msg: Record<string, unknown>): Promise<void> {
    switch (msg.type) {
      case 'ping':
        this.send({ type: 'pong' });
        break;

      case 'chat': {
        const req = msg as unknown as ChatRequest;
        if (!req.message) {
          this.send({ type: 'error', data: 'Message is required' });
          return;
        }
        await this.handleChat(req);
        break;
      }

      default:
        this.send({ type: 'echo', data: msg });
    }
  }

  private async handleChat(req: ChatRequest): Promise<void> {
    try {
      await this.opencode.sendMessage(
        req.message,
        req.sessionId,
        req.agent,
        (chunk) => {
          this.send({
            type: 'token',
            data: chunk.data,
            chunkType: chunk.type,
          });
        },
      );
      this.send({ type: 'done' });
    } catch (err) {
      this.send({ type: 'error', data: (err as Error).message });
    }
  }

  send(data: Record<string, unknown>): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

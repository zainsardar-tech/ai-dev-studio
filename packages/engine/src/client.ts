import { request as httpRequest } from 'http';
import type { StreamChunk } from './types';

interface SessionResponse {
  id: string;
  slug: string;
  projectID: string;
}

interface MessagePart {
  type: string;
  text?: string;
}

interface MessageResponse {
  info: Record<string, unknown>;
  parts: MessagePart[];
}

function authHeaders(): Record<string, string> {
  const user = process.env.OPENCODE_SERVER_USERNAME || 'opencode';
  const pass = process.env.OPENCODE_SERVER_PASSWORD || '';
  const encoded = Buffer.from(`${user}:${pass}`).toString('base64');
  return { Authorization: `Basic ${encoded}` };
}

function httpJson<T>(url: string, method: string, body?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers: Record<string, string> = {
      ...authHeaders(),
      'Content-Type': 'application/json',
    };
    const data = body ? JSON.stringify(body) : undefined;
    if (data) headers['Content-Length'] = String(Buffer.byteLength(data));

    const req = httpRequest(
      {
        hostname: u.hostname,
        port: Number(u.port),
        path: u.pathname,
        method,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk: Buffer) => { raw += chunk.toString('utf-8'); });
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw) as T);
          } catch {
            reject(new Error(`Invalid JSON response: ${raw.slice(0, 200)}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Request timed out')); });
    if (data) req.write(data);
    req.end();
  });
}

export class OpenCodeClient {
  private baseUrl: string;

  constructor(port: number) {
    this.baseUrl = `http://127.0.0.1:${port}`;
  }

  async getSessionId(sessionId?: string): Promise<string> {
    if (sessionId) return sessionId;
    const session = await httpJson<SessionResponse>(
      `${this.baseUrl}/session`,
      'POST',
      {},
    );
    return session.id;
  }

  async sendMessage(
    message: string,
    sessionId?: string,
    agent?: string,
    onChunk?: (chunk: StreamChunk) => void,
  ): Promise<string> {
    const sid = await this.getSessionId(sessionId);

    const body: Record<string, unknown> = {
      parts: [{ type: 'text', text: message }],
    };

    const response = await httpJson<MessageResponse>(
      `${this.baseUrl}/session/${sid}/message`,
      'POST',
      body,
    );

    const textParts = response.parts
      .filter((p) => p.type === 'text' && p.text)
      .map((p) => p.text as string);

    const content = textParts.join('\n');

    onChunk?.({ type: 'token', data: content });

    return content;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await new Promise<boolean>((resolve) => {
        const req = httpRequest(
          {
            hostname: '127.0.0.1',
            port: this.baseUrl.split(':').pop()!,
            path: '/health',
            method: 'GET',
            headers: authHeaders(),
          },
          () => { resolve(true); },
        );
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => { req.destroy(); resolve(false); });
      });
      return res;
    } catch {
      return false;
    }
  }
}

import type { StreamChunk } from './types';

export class StreamParser {
  private buffer = '';
  private onChunk?: (chunk: StreamChunk) => void;

  constructor(onChunk?: (chunk: StreamChunk) => void) {
    this.onChunk = onChunk;
  }

  feed(data: string): StreamChunk[] {
    this.buffer += data;
    const chunks: StreamChunk[] = [];
    const lines = this.buffer.split('\n');

    this.buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const chunk: StreamChunk = JSON.parse(line);
        chunks.push(chunk);
        this.onChunk?.(chunk);
      } catch {
        chunks.push({ type: 'token', data: line });
        this.onChunk?.({ type: 'token', data: line });
      }
    }

    return chunks;
  }

  flush(): StreamChunk[] {
    const chunks = this.feed('\n');
    this.buffer = '';
    return chunks;
  }
}

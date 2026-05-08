import type { StreamChunk } from './types';
export declare class OpenCodeClient {
    private baseUrl;
    constructor(port: number);
    sendMessage(message: string, sessionId?: string, agent?: string, onChunk?: (chunk: StreamChunk) => void): Promise<string>;
    checkHealth(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map
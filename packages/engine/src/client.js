import { StreamParser } from './stream';
export class OpenCodeClient {
    baseUrl;
    constructor(port) {
        this.baseUrl = `http://127.0.0.1:${port}`;
    }
    async sendMessage(message, sessionId, agent, onChunk) {
        const parser = new StreamParser(onChunk);
        const params = new URLSearchParams({ message });
        if (sessionId)
            params.set('session', sessionId);
        if (agent)
            params.set('agent', agent);
        const response = await fetch(`${this.baseUrl}/api/chat?${params}`);
        if (!response.ok)
            throw new Error(`OpenCode request failed: ${response.statusText}`);
        const reader = response.body?.getReader();
        if (!reader)
            throw new Error('No response body');
        const decoder = new TextDecoder();
        let fullResponse = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const text = decoder.decode(value, { stream: true });
            fullResponse += text;
            parser.feed(text);
        }
        return fullResponse;
    }
    async checkHealth() {
        try {
            const resp = await fetch(`${this.baseUrl}/health`);
            return resp.ok;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=client.js.map
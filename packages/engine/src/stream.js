export class StreamParser {
    buffer = '';
    onChunk;
    constructor(onChunk) {
        this.onChunk = onChunk;
    }
    feed(data) {
        this.buffer += data;
        const chunks = [];
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() ?? '';
        for (const line of lines) {
            if (!line.trim())
                continue;
            try {
                const chunk = JSON.parse(line);
                chunks.push(chunk);
                this.onChunk?.(chunk);
            }
            catch {
                chunks.push({ type: 'token', data: line });
                this.onChunk?.({ type: 'token', data: line });
            }
        }
        return chunks;
    }
    flush() {
        const chunks = this.feed('\n');
        this.buffer = '';
        return chunks;
    }
}
//# sourceMappingURL=stream.js.map
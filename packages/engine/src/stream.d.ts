import type { StreamChunk } from './types';
export declare class StreamParser {
    private buffer;
    private onChunk?;
    constructor(onChunk?: (chunk: StreamChunk) => void);
    feed(data: string): StreamChunk[];
    flush(): StreamChunk[];
}
//# sourceMappingURL=stream.d.ts.map
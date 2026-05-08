import type { SessionInfo } from './types';
export declare class SessionManager {
    create(projectId: string): SessionInfo;
    list(): SessionInfo[];
    continue(sessionId: string): void;
    delete(sessionId: string): void;
}
//# sourceMappingURL=session.d.ts.map
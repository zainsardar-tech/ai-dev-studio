import { execSync } from 'child_process';
export class SessionManager {
    create(projectId) {
        const output = execSync(`opencode session create --json`, { encoding: 'utf-8' });
        const data = JSON.parse(output);
        return {
            id: data.id,
            projectId,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }
    list() {
        const output = execSync(`opencode session list --json`, { encoding: 'utf-8' });
        return JSON.parse(output);
    }
    continue(sessionId) {
        execSync(`opencode session continue ${sessionId}`, { stdio: 'inherit' });
    }
    delete(sessionId) {
        execSync(`opencode session delete ${sessionId}`, { stdio: 'inherit' });
    }
}
//# sourceMappingURL=session.js.map
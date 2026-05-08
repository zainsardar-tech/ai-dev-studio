import { SystemDetector } from './detector';
import { Installer } from './installer';
import type { AIProviderConfig, SetupState, SystemDeps } from './types';

export class SetupWizard {
  private detector = new SystemDetector();
  private installer = new Installer();

  onProgress?: (state: SetupState) => void;

  private emit(state: Partial<SetupState>): void {
    this.onProgress?.({
      phase: 'detecting',
      progress: 0,
      message: '',
      deps: {} as SystemDeps,
      providers: [],
      workspaceDir: '',
      ...state,
    } as SetupState);
  }

  async run(): Promise<void> {
    this.emit({ phase: 'detecting', progress: 10, message: 'Detecting system environment...' });
    const deps = await this.detector.detect();

    if (!deps.node.installed) throw new Error('Node.js is required but not found');

    if (!deps.pnpm.installed) {
      this.emit({ phase: 'installing', progress: 30, message: 'Installing pnpm...' });
      await this.installer.installPnpm();
    }

    if (!deps.opencode.installed) {
      this.emit({ phase: 'installing', progress: 50, message: 'Installing OpenCode CLI...' });
      await this.installer.installOpenCode();
    }

    this.emit({ phase: 'configuring', progress: 70, message: 'Configuring workspace...' });
    const workspaceDir = `${process.env.HOME}/ZarixsolWorkspace`;
    await this.installer.createWorkspace(workspaceDir);

    this.emit({
      phase: 'ready',
      progress: 100,
      message: 'Setup complete. Launching Zarixsol AI Dev Studio...',
      deps,
      workspaceDir,
    });
  }

  async configureProviders(providers: AIProviderConfig[]): Promise<void> {
    for (const p of providers) {
      if (p.apiKey) {
        const { execSync } = await import('child_process');
        execSync(
          `opencode providers set --provider ${p.provider} --key ${p.apiKey}`,
          { stdio: 'inherit' }
        );
      }
    }
  }
}

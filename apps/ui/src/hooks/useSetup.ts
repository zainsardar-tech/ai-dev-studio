import { useSetupStore, type AIProviderConfig, type SystemDeps, type SetupStepId } from '../stores/setup-store';

const API_BASE = 'http://127.0.0.1:3456/api/setup';

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function useSetup() {
  const store = useSetupStore();

  async function detectSystem(): Promise<SystemDeps> {
    store.setStepStatus('deps', 'running');
    store.setMessage('Detecting system environment...');
    store.setProgress(10);

    try {
      const data = await api<{ deps: SystemDeps }>('/detect');
      store.setDeps(data.deps);
      store.setStepStatus('deps', 'done');
      store.setProgress(25);
      return data.deps;
    } catch (err) {
      store.setStepStatus('deps', 'error');
      store.setError((err as Error).message);
      throw err;
    }
  }

  async function installTool(tool: string): Promise<void> {
    store.setStepStatus('install', 'running');
    store.setMessage(`Installing ${tool}...`);
    store.setProgress(40);

    try {
      await api('/install', {
        method: 'POST',
        body: JSON.stringify({ tool }),
      });
      return;
    } catch (err) {
      store.setStepStatus('install', 'error');
      store.setError((err as Error).message);
      throw err;
    }
  }

  async function createWorkspace(dir: string): Promise<void> {
    store.setMessage(`Creating workspace at ${dir}...`);
    store.setProgress(60);
    store.setWorkspaceDir(dir);

    try {
      await api('/workspace', {
        method: 'POST',
        body: JSON.stringify({ dir }),
      });
      return;
    } catch (err) {
      store.setError((err as Error).message);
      throw err;
    }
  }

  async function configureProviders(providers: AIProviderConfig[]): Promise<void> {
    store.setStepStatus('providers', 'running');
    store.setMessage('Configuring AI providers...');
    store.setProgress(75);

    try {
      await api('/providers', {
        method: 'POST',
        body: JSON.stringify({ providers }),
      });
      store.setStepStatus('providers', 'done');
      store.setProgress(85);
    } catch (err) {
      store.setStepStatus('providers', 'error');
      store.setError((err as Error).message);
      throw err;
    }
  }

  async function runFullSetup(providers: AIProviderConfig[]): Promise<void> {
    store.reset();
    store.setPhase('detecting');

    try {
      const deps = await detectSystem();

      store.setStepStatus('install', 'running');
      store.setPhase('installing');

      if (!deps.pnpm.installed) {
        store.setMessage('Installing pnpm...');
        store.setProgress(30);
        await installTool('pnpm');
      }

      if (!deps.opencode.installed) {
        store.setMessage('Installing OpenCode CLI...');
        store.setProgress(50);
        await installTool('opencode');
      }

      store.setStepStatus('install', 'done');
      store.setPhase('configuring');

      const workspaceDir = '/home/zain-sardar/ZarixsolWorkspace';
      await createWorkspace(workspaceDir);
      store.setStepStatus('workspace', 'done');

      if (providers.length > 0) {
        await configureProviders(providers);
      }

      store.setProgress(100);
      store.setMessage('Setup complete!');
      store.setPhase('ready');
      store.setCompleted(true);
    } catch (err) {
      store.setError((err as Error).message);
    }
  }

  return {
    ...store,
    detectSystem,
    installTool,
    createWorkspace,
    configureProviders,
    runFullSetup,
  };
}

import { create } from 'zustand';

export type SetupPhase = 'detecting' | 'installing' | 'configuring' | 'ready' | 'error';
export type SetupStepId = 'deps' | 'install' | 'providers' | 'workspace';

export interface SystemDeps {
  node: { installed: boolean; version?: string };
  pnpm: { installed: boolean; version?: string };
  opencode: { installed: boolean; version?: string };
  git: { installed: boolean; version?: string };
}

export interface AIProviderConfig {
  provider: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;
  model: string;
  baseUrl?: string;
}

export interface SetupStep {
  id: SetupStepId;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export interface SetupState {
  phase: SetupPhase;
  progress: number;
  message: string;
  deps: SystemDeps | null;
  providers: AIProviderConfig[];
  workspaceDir: string;
  steps: SetupStep[];
  error: string | null;
  completed: boolean;

  setPhase: (phase: SetupPhase) => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  setDeps: (deps: SystemDeps) => void;
  setProviders: (providers: AIProviderConfig[]) => void;
  setWorkspaceDir: (dir: string) => void;
  setStepStatus: (id: SetupStepId, status: SetupStep['status']) => void;
  setError: (error: string | null) => void;
  setCompleted: (completed: boolean) => void;
  reset: () => void;
}

const initialSteps: SetupStep[] = [
  { id: 'deps', label: 'System Dependencies', description: 'Checking Node.js, pnpm, OpenCode...', status: 'pending' },
  { id: 'install', label: 'Install Missing Tools', description: 'Setting up required tools...', status: 'pending' },
  { id: 'providers', label: 'AI Providers', description: 'Configure OpenAI, Claude, or Ollama', status: 'pending' },
  { id: 'workspace', label: 'Workspace Setup', description: 'Initializing ~/ZarixsolWorkspace', status: 'pending' },
];

export const useSetupStore = create<SetupState>((set) => ({
  phase: 'detecting',
  progress: 0,
  message: 'Preparing...',
  deps: null,
  providers: [],
  workspaceDir: '',
  steps: initialSteps,
  error: null,
  completed: false,

  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setMessage: (message) => set({ message }),
  setDeps: (deps) => set({ deps }),
  setProviders: (providers) => set({ providers }),
  setWorkspaceDir: (dir) => set({ workspaceDir: dir }),
  setStepStatus: (id, status) =>
    set((state) => ({
      steps: state.steps.map((s) => (s.id === id ? { ...s, status } : s)),
    })),
  setError: (error) => set({ error, phase: error ? 'error' : 'detecting' }),
  setCompleted: (completed) => set({ completed }),
  reset: () =>
    set({
      phase: 'detecting',
      progress: 0,
      message: 'Preparing...',
      deps: null,
      steps: initialSteps,
      error: null,
      completed: false,
    }),
}));

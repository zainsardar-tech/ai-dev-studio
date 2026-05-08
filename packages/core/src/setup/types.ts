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

export interface SetupState {
  phase: 'detecting' | 'installing' | 'configuring' | 'ready';
  progress: number;
  message: string;
  deps: SystemDeps;
  providers: AIProviderConfig[];
  workspaceDir: string;
}

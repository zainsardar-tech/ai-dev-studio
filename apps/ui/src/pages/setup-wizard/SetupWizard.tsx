import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Zap, Terminal, Key, FolderOpen, AlertCircle } from 'lucide-react';
import { useSetup } from '../../hooks/useSetup';
import type { AIProviderConfig, SetupStepId } from '../../stores/setup-store';

const stepIcons: Record<SetupStepId, React.ReactNode> = {
  deps: <Terminal className="w-5 h-5 text-text-muted" />,
  install: <Zap className="w-5 h-5 text-text-muted" />,
  providers: <Key className="w-5 h-5 text-text-muted" />,
  workspace: <FolderOpen className="w-5 h-5 text-text-muted" />,
};

export function SetupWizard() {
  const navigate = useNavigate();
  const { steps, phase, progress, message, completed, error, runFullSetup, setProviders, providers } = useSetup();
  const [started, setStarted] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [formKeys, setFormKeys] = useState<AIProviderConfig[]>([
    { provider: 'openai', apiKey: '', model: 'gpt-4o' },
    { provider: 'anthropic', apiKey: '', model: 'claude-sonnet-4' },
    { provider: 'ollama', apiKey: '', model: 'llama3', baseUrl: 'http://localhost:11434' },
  ]);

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [completed, navigate]);

  const handleStart = async () => {
    setStarted(true);
    const configuredProviders = (formKeys || []).filter((p) => p.apiKey && p.apiKey.length > 0);
    setProviders(configuredProviders);
    await runFullSetup(configuredProviders);
  };

  const updateKey = (provider: string, field: string, value: string) => {
    setFormKeys((prev) =>
      prev.map((p) => (p.provider === provider ? { ...p, [field]: value } : p)),
    );
  };

  return (
    <div className="h-screen w-screen bg-bg-primary flex items-center justify-center">
      <div className="w-[480px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <img
            src="/branding/logos/zarixsol-splash.svg"
            alt="Zarixsol"
            className="h-32 mx-auto mb-6"
          />
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            {completed ? 'Ready to Launch' : error ? 'Setup Failed' : started ? 'Setting Up Your Studio' : 'Welcome to Zarixsol'}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {completed
              ? 'Redirecting to dashboard...'
              : error
              ? error
              : started
              ? message
              : 'One-click setup for your AI development environment.'}
          </p>
        </div>

        {/* Progress bar */}
        {started && !completed && !error && (
          <div className="w-full h-1.5 bg-bg-elevated rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                step.status === 'running'
                  ? 'border-accent-primary/50 bg-accent-primary/5'
                  : step.status === 'done'
                  ? 'border-success/30 bg-success/5'
                  : step.status === 'error'
                  ? 'border-danger/30 bg-danger/5'
                  : 'border-border bg-bg-surface'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                step.status === 'done'
                  ? 'bg-success/10'
                  : step.status === 'running'
                  ? 'bg-accent-primary/10'
                  : step.status === 'error'
                  ? 'bg-danger/10'
                  : 'bg-bg-elevated'
              }`}>
                {step.status === 'done' ? (
                  <Check className="w-5 h-5 text-success" />
                ) : step.status === 'running' ? (
                  <Loader2 className="w-5 h-5 text-accent-secondary animate-spin" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-danger" />
                ) : (
                  stepIcons[step.id] || <Terminal className="w-5 h-5 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'done' ? 'text-success' : step.status === 'running' ? 'text-accent-secondary' : step.status === 'error' ? 'text-danger' : 'text-text-muted'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
              </div>
              {step.status === 'done' && <div className="w-2 h-2 rounded-full bg-success" />}
              {step.status === 'error' && <div className="w-2 h-2 rounded-full bg-danger" />}
            </div>
          ))}
        </div>

        {/* AI Provider Key Form */}
        {!started && (
          <div className="mb-6">
            <button
              onClick={() => setShowProviderForm(!showProviderForm)}
              className="flex items-center gap-2 text-sm text-accent-secondary hover:text-accent-highlight transition-colors mb-4"
            >
              <Key className="w-4 h-4" />
              {showProviderForm ? 'Hide API key fields' : 'Configure AI provider API keys (optional)'}
            </button>

            {showProviderForm && (
              <div className="space-y-3 animate-fade-in">
                {(formKeys || []).map((p) => (
                  <div key={p.provider} className="p-3 bg-bg-surface border border-border rounded-xl">
                    <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-2">
                      {p.provider === 'openai' ? 'OpenAI' : p.provider === 'anthropic' ? 'Anthropic' : 'Ollama (Local)'}
                    </label>
                    <input
                      type="password"
                      placeholder={p.provider === 'ollama' ? 'http://localhost:11434' : 'sk-...'}
                      value={p.apiKey || ''}
                      onChange={(e) => updateKey(p.provider, 'apiKey', e.target.value)}
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
                    />
                    {p.provider === 'ollama' && (
                      <input
                        type="text"
                        placeholder="Base URL"
                        value={p.baseUrl || ''}
                        onChange={(e) => updateKey(p.provider, 'baseUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        {!started && (
          <button
            onClick={handleStart}
            className="w-full py-3.5 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-150 shadow-xl shadow-accent-primary/20"
          >
            Start Setup
          </button>
        )}

        {completed && (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <p className="text-sm text-text-muted">Redirecting to dashboard...</p>
          </div>
        )}

        {error && !started && (
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-bg-elevated text-text-secondary rounded-xl font-medium text-sm hover:bg-border transition-all"
          >
            Retry Setup
          </button>
        )}
      </div>
    </div>
  );
}

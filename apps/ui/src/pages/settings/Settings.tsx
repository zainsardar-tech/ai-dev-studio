import { useState } from 'react';
import { Key, Palette, Users, Shield, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'providers', label: 'AI Providers', icon: Key, description: 'OpenAI, Anthropic, Ollama API keys' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme, font size, layout' },
  { id: 'team', label: 'Team', icon: Users, description: 'Invite codes, roles, permissions' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Encryption, sandbox settings' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('providers');

  return (
    <div className="flex-1 flex h-full">
      {/* Sidebar */}
      <div className="w-56 bg-bg-secondary border-r border-border p-3">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2">
          Settings
        </h2>
        <nav className="space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === s.id
                  ? 'bg-accent-primary/10 text-accent-secondary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl">
          <h3 className="text-lg font-heading font-bold text-text-primary mb-1">AI Providers</h3>
          <p className="text-sm text-text-muted mb-6">Configure your AI provider API keys and models.</p>

          {/* OpenAI */}
          <div className="p-4 bg-bg-surface border border-border rounded-xl mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm font-medium text-text-primary">OpenAI</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
            />
            <p className="text-xs text-text-muted mt-2">Models: GPT-4o, GPT-4.1, o3, o4-mini</p>
          </div>

          {/* Anthropic */}
          <div className="p-4 bg-bg-surface border border-border rounded-xl mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-sm font-medium text-text-primary">Anthropic</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
            />
            <p className="text-xs text-text-muted mt-2">Models: Claude Sonnet 4, Claude Opus</p>
          </div>

          {/* Ollama */}
          <div className="p-4 bg-bg-surface border border-border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-accent-secondary" />
                </div>
                <span className="text-sm font-medium text-text-primary">Ollama (Local)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="http://localhost:11434"
              value="http://localhost:11434"
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50"
            />
            <p className="text-xs text-text-muted mt-2">Models: Llama 3, Mistral, CodeGemma</p>
          </div>
        </div>
      </div>
    </div>
  );
}

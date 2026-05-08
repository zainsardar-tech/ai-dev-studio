import { useState } from 'react';
import { Plus, Clock, Bot, Users } from 'lucide-react';

const recentProjects = [
  { id: '1', name: 'web-app', type: 'React', lastOpened: '2 min ago' },
  { id: '2', name: 'api-service', type: 'Node', lastOpened: '1 hour ago' },
  { id: '3', name: 'data-pipeline', type: 'Python', lastOpened: '3 days ago' },
];

const activeSessions = [
  { id: '1', project: 'web-app', agent: 'Build Agent', status: 'active' },
  { id: '2', project: 'api-service', agent: 'Plan Agent', status: 'idle' },
];

export function Dashboard() {
  const [projects] = useState(recentProjects);
  const [sessions] = useState(activeSessions);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Welcome back to Zarixsol AI Dev Studio</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-accent-primary/20">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <QuickStatCard icon={Bot} label="Active Sessions" value={sessions.length.toString()} />
        <QuickStatCard icon={Clock} label="Total Projects" value={projects.length.toString()} />
        <QuickStatCard icon={Users} label="Team Members" value="1" />
      </div>

      {/* Recent Projects */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Recent Projects
        </h2>
        <div className="space-y-2">
          {(projects || []).map((p) => (
            <a
              key={p.id}
              href={`/workspace/${p.id}`}
              className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded-xl hover:bg-bg-elevated hover:border-accent-primary/30 transition-all duration-150 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent-secondary transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-text-muted">{p.type}</p>
                </div>
              </div>
              <span className="text-xs text-text-muted">{p.lastOpened}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Active Sessions */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Active Sessions
        </h2>
        <div className="space-y-2">
          {(sessions || []).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 bg-bg-surface border border-border rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-success animate-glow-pulse' : 'bg-text-muted'}`} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{s.project}</p>
                  <p className="text-xs text-text-muted">{s.agent}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickStatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-5 bg-bg-surface border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent-secondary" />
        </div>
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="text-3xl font-heading font-bold text-text-primary">{value}</p>
    </div>
  );
}

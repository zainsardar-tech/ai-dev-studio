import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Command } from 'lucide-react';

const commands = [
  { id: 'new-workspace', label: 'New Workspace', shortcut: 'Ctrl+N' },
  { id: 'open-project', label: 'Open Project', shortcut: 'Ctrl+O' },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
  { id: 'search-files', label: 'Search Files', shortcut: 'Ctrl+P' },
  { id: 'run-command', label: 'Run Command', shortcut: 'Ctrl+Shift+P' },
  { id: 'switch-agent', label: 'Switch Agent', shortcut: 'Ctrl+A' },
  { id: 'settings', label: 'Settings', shortcut: 'Ctrl+,' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const handleSelect = useCallback((id: string) => {
    setOpen(false);
    setQuery('');
  }, []);

  return open ? (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[560px] bg-bg-elevated border border-border rounded-xl shadow-2xl shadow-accent-primary/10 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-sm"
          />
          <kbd className="px-1.5 py-0.5 text-xs text-text-muted bg-bg-surface rounded">
            <Command className="w-3 h-3 inline" />K
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleSelect(cmd.id)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-accent-primary/10 hover:text-text-primary transition-all duration-100"
            >
              <span>{cmd.label}</span>
              <kbd className="px-1.5 py-0.5 text-xs text-text-muted bg-bg-surface rounded">
                {cmd.shortcut}
              </kbd>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-8 text-sm text-text-muted text-center">
              No results for "{query}"
            </p>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

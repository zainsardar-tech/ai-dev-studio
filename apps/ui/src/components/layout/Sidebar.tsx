import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FolderCode,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workspace/default', icon: Bot, label: 'AI Workspace' },
  { to: '/workspace/default/editor', icon: FolderCode, label: 'Projects' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-bg-secondary border-r border-border transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border">
        {collapsed ? (
          <img
            src="/branding/logos/zarixsol-favicon.svg"
            alt="Z"
            className="w-8 h-8"
          />
        ) : (
          <img
            src="/branding/logos/zarixso-logo-lite.svg"
            alt="Zarixsol AI Dev Studio"
            className="h-7"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent-primary/10 text-accent-secondary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border py-3 px-2 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-accent-primary/10 text-accent-secondary'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
            }`
          }
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-all duration-150"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Quick action */}
      <div className="px-3 pb-3">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-medium hover:opacity-90 transition-all duration-150 shadow-lg shadow-accent-primary/20">
          <Zap className="w-4 h-4" />
          {!collapsed && <span>New Workspace</span>}
        </button>
      </div>
    </aside>
  );
}

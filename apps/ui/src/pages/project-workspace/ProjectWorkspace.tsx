import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, MoreHorizontal } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'components', type: 'folder', children: [
        { name: 'Header.tsx', type: 'file' },
        { name: 'Sidebar.tsx', type: 'file' },
      ]},
      { name: 'pages', type: 'folder', children: [
        { name: 'Dashboard.tsx', type: 'file' },
        { name: 'Settings.tsx', type: 'file' },
      ]},
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
];

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => node.type === 'folder' && setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-text-muted hover:text-text-secondary hover:bg-bg-elevated rounded-lg transition-all"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Folder className="w-4 h-4 text-accent-secondary" />
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File className="w-4 h-4 text-text-muted" />
          </>
        )}
        <span>{node.name}</span>
      </button>
      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeItem key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectWorkspace() {
  const [activeFile, setActiveFile] = useState('App.tsx');

  return (
    <div className="flex-1 flex h-full">
      {/* File Explorer */}
      <div className="w-56 bg-bg-secondary border-r border-border flex flex-col">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Explorer</span>
          <button className="p-1 text-text-muted hover:text-text-secondary rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {mockFileTree.map((node, i) => (
            <FileTreeItem key={i} node={node} />
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex items-center bg-bg-secondary border-b border-border">
          <div className="flex items-center px-3 py-2 border-r border-border bg-bg-surface cursor-pointer">
            <span className="text-sm text-text-primary">{activeFile}</span>
          </div>
        </div>
        {/* Editor placeholder */}
        <div className="flex-1 flex items-center justify-center bg-bg-primary">
          <div className="text-center">
            <File className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-sm text-text-muted">
              Monaco Editor will be fully integrated here
            </p>
            <p className="text-xs text-text-muted mt-1">with syntax highlighting, multi-cursor, and AI inline suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

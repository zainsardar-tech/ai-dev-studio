import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Hammer, ClipboardList, Power, Trash2 } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import type { ChatMessage } from '../../stores/chat-store';

const placeholderPrompts = [
  'Build a React component for a data table',
  'Explain this code architecture',
  'Debug the login flow',
  'Plan the database schema',
];

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-bg-secondary [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_code]:text-accent-secondary [&_code]:text-xs [&_pre_code]:text-text-secondary [&_strong]:text-text-primary [&_h1]:text-text-primary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_a]:text-accent-primary [&_blockquote]:border-accent-primary [&_blockquote]:text-text-muted [&_hr]:border-border [&_ul]:text-text-secondary [&_ol]:text-text-secondary [&_li]:text-text-secondary [&_p]:text-text-secondary [&_th]:text-text-primary [&_td]:text-text-secondary]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-accent-secondary" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-accent-primary text-white'
            : 'bg-bg-surface border border-border text-text-secondary'
        }`}
      >
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <MarkdownContent content={msg.content} />
        )}
        <span className={`text-xs mt-2 block opacity-60 ${isUser ? 'text-white/70' : 'text-text-muted'}`}>
          {new Date(msg.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent-secondary/10 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-accent-secondary" />
        </div>
      )}
    </div>
  );
}

export function AIWorkspace() {
  const {
    messages,
    streaming,
    agent,
    error,
    sessionId,
    connected,
    sendMessage,
    setAgent,
    clearMessages,
    reconnect,
  } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-secondary/50">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-text-primary">AI Workspace</h2>
          <div className="flex bg-bg-surface rounded-lg p-0.5">
            <button
              onClick={() => setAgent('build')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                agent === 'build'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Hammer className="w-3 h-3" />
              Build Agent
            </button>
            <button
              onClick={() => setAgent('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                agent === 'plan'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <ClipboardList className="w-3 h-3" />
              Plan Agent
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sessionId && (
            <span className="text-[10px] text-text-muted bg-bg-surface px-2 py-1 rounded font-mono">
              {sessionId.slice(0, 8)}...
            </span>
          )}
          <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded ${
            connected ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              connected ? 'bg-green-400' : 'bg-amber-400 animate-pulse'
            }`} />
            {connected ? 'Connected' : 'Connecting...'}
          </div>
          {!connected && (
            <button
              onClick={reconnect}
              className="p-1.5 text-text-muted hover:text-text-secondary transition-colors rounded-lg hover:bg-bg-surface"
              title="Reconnect"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={clearMessages}
            className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-bg-surface"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
              What would you like to build?
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-md">
              Ask me to write code, plan architecture, debug issues, or explain any part of your project.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {placeholderPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-4 py-3 text-sm text-text-muted bg-bg-surface border border-border rounded-xl hover:border-accent-primary/30 hover:text-text-secondary transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {(messages || []).map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {streaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-secondary" />
            </div>
            <div className="px-4 py-3 bg-bg-surface border border-border rounded-2xl">
              <span className="animate-pulse text-text-muted text-sm">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-bg-secondary/50">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your code..."
              rows={1}
              className="w-full px-4 py-3 bg-bg-surface border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 resize-none min-h-[44px] max-h-32"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming || !connected}
            className="px-4 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

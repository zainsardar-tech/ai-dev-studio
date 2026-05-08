import { create } from 'zustand';

export type AgentType = 'build' | 'plan';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  streaming: boolean;
  sessionId: string | null;
  agent: AgentType;
  error: string | null;

  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setSessionId: (sessionId: string) => void;
  setAgent: (agent: AgentType) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streaming: false,
  sessionId: null,
  agent: 'build',
  error: null,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      if (msgs.length > 0) {
        const last = { ...msgs[msgs.length - 1], content };
        msgs[msgs.length - 1] = last;
      }
      return { messages: msgs };
    }),

  setStreaming: (streaming) => set({ streaming }),
  setSessionId: (sessionId) => set({ sessionId }),
  setAgent: (agent) => set({ agent }),
  setError: (error) => set({ error }),
  clearMessages: () =>
    set({ messages: [], sessionId: null, error: null }),
}));

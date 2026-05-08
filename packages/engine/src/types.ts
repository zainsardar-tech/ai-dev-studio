export interface OpenCodeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface StreamChunk {
  type: 'token' | 'error' | 'done' | 'tool' | 'file';
  data: string;
  metadata?: Record<string, unknown>;
}

export interface SessionInfo {
  id: string;
  projectId: string;
  messages: OpenCodeMessage[];
  createdAt: number;
  updatedAt: number;
}

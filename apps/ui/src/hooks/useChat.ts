import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore, type ChatMessage } from '../stores/chat-store';

const WS_URL = 'ws://127.0.0.1:3456';
const RECONNECT_DELAY = 3000;

export function useChat() {
  const messages = useChatStore((s) => s.messages);
  const streaming = useChatStore((s) => s.streaming);
  const sessionId = useChatStore((s) => s.sessionId);
  const agent = useChatStore((s) => s.agent);
  const error = useChatStore((s) => s.error);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const setAgent = useChatStore((s) => s.setAgent);

  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const tokenRef = useRef('');
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    function connect() {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted) { ws.close(); return; }
        setConnected(true);
        useChatStore.getState().setError(null);
      };

      ws.onmessage = (event) => {
        if (!mounted) return;
        try {
          const msg = JSON.parse(event.data);
          const store = useChatStore.getState();

          switch (msg.type) {
            case 'token':
              store.setStreaming(true);
              tokenRef.current += msg.data;
              store.updateLastMessage(tokenRef.current);
              break;
            case 'done':
              store.setStreaming(false);
              tokenRef.current = '';
              break;
            case 'error':
              store.setStreaming(false);
              store.setError(msg.data);
              tokenRef.current = '';
              break;
          }
        } catch {}
      };

      ws.onclose = () => {
        if (!mounted) return;
        setConnected(false);
        useChatStore.getState().setStreaming(false);
        retryRef.current = setTimeout(connect, RECONNECT_DELAY);
      };

      ws.onerror = () => {};
    }

    connect();

    return () => {
      mounted = false;
      if (retryRef.current) clearTimeout(retryRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      useChatStore.getState().setError('Not connected to bridge server');
      return;
    }

    const store = useChatStore.getState();

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    store.addMessage(userMsg);
    store.addMessage(assistantMsg);
    store.setError(null);
    tokenRef.current = '';

    const sid = store.sessionId || crypto.randomUUID();
    if (!store.sessionId) store.setSessionId(sid);

    ws.send(JSON.stringify({
      type: 'chat',
      message: content,
      sessionId: sid,
      agent: store.agent,
    }));
  }, []);

  const reconnect = useCallback(() => {
    if (retryRef.current) clearTimeout(retryRef.current);
    wsRef.current?.close();
    wsRef.current = null;
    useChatStore.getState().setError(null);
  }, []);

  return {
    messages,
    streaming,
    sessionId,
    agent,
    error,
    connected,
    sendMessage,
    setAgent,
    clearMessages,
    reconnect,
  };
}

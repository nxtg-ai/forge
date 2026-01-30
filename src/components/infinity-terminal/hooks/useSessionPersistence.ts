/**
 * Session Persistence Hook for Infinity Terminal
 * Manages persistent terminal sessions with Zellij + ttyd
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SessionState {
  sessionId: string;
  sessionName: string;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  layout: string;
  projectRoot: string;
  createdAt: Date | null;
  lastActivity: Date | null;
  reconnectAttempts: number;
}

export interface SessionConfig {
  ttydPort: number;
  ttydHost: string;
  sessionPrefix: string;
  autoReconnect: boolean;
  maxReconnectAttempts: number;
  reconnectDelay: number; // ms
}

const DEFAULT_CONFIG: SessionConfig = {
  ttydPort: 7681,
  ttydHost: '127.0.0.1',
  sessionPrefix: 'forge',
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 2000,
};

interface UseSessionPersistenceOptions {
  projectName?: string;
  layout?: string;
  config?: Partial<SessionConfig>;
  onSessionRestore?: (sessionId: string) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

interface StoredSession {
  sessionId: string;
  sessionName: string;
  layout: string;
  projectRoot: string;
  createdAt: string;
  lastAccess: string;
}

const STORAGE_KEY = 'infinity-terminal-sessions';

export function useSessionPersistence(options: UseSessionPersistenceOptions = {}) {
  const {
    projectName = 'nxtg-forge',
    layout = 'default',
    config: userConfig = {},
    onSessionRestore,
    onConnectionChange,
    onError,
  } = options;

  const config = { ...DEFAULT_CONFIG, ...userConfig };

  const [state, setState] = useState<SessionState>({
    sessionId: '',
    sessionName: '',
    connected: false,
    connecting: false,
    error: null,
    layout,
    projectRoot: '',
    createdAt: null,
    lastActivity: null,
    reconnectAttempts: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session name from project
  const generateSessionName = useCallback(() => {
    const sanitized = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${config.sessionPrefix}-${sanitized}`;
  }, [projectName, config.sessionPrefix]);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Get stored sessions from localStorage
  const getStoredSessions = useCallback((): StoredSession[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((session: Partial<StoredSession>) => {
    const sessions = getStoredSessions();
    const existing = sessions.findIndex(s => s.sessionName === session.sessionName);

    const updated: StoredSession = {
      sessionId: session.sessionId || generateSessionId(),
      sessionName: session.sessionName || generateSessionName(),
      layout: session.layout || layout,
      projectRoot: session.projectRoot || '',
      createdAt: session.createdAt || new Date().toISOString(),
      lastAccess: new Date().toISOString(),
    };

    if (existing >= 0) {
      sessions[existing] = updated;
    } else {
      sessions.push(updated);
    }

    // Keep only last 10 sessions
    const trimmed = sessions.slice(-10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    return updated;
  }, [getStoredSessions, generateSessionId, generateSessionName, layout]);

  // Remove session from localStorage
  const removeSession = useCallback((sessionName: string) => {
    const sessions = getStoredSessions();
    const filtered = sessions.filter(s => s.sessionName !== sessionName);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }, [getStoredSessions]);

  // Get ttyd WebSocket URL
  const getTtydUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${config.ttydHost}:${config.ttydPort}/ws`;
  }, [config.ttydHost, config.ttydPort]);

  // Connect to ttyd
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING ||
        wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[InfinityTerminal] Already connected');
      return;
    }

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const sessionName = generateSessionName();
    const sessionId = generateSessionId();
    const url = getTtydUrl();

    console.log(`[InfinityTerminal] Connecting to ${url}`);

    try {
      const ws = new WebSocket(url);

      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('[InfinityTerminal] Connected');

        const session = saveSession({
          sessionId,
          sessionName,
          layout,
          projectRoot: window.location.pathname,
        });

        setState(prev => ({
          ...prev,
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          connected: true,
          connecting: false,
          error: null,
          createdAt: new Date(session.createdAt),
          lastActivity: new Date(),
          reconnectAttempts: 0,
        }));

        onConnectionChange?.(true);
      };

      ws.onclose = (event) => {
        console.log(`[InfinityTerminal] Disconnected: ${event.code}`);

        setState(prev => ({ ...prev, connected: false, connecting: false }));
        onConnectionChange?.(false);

        // Auto-reconnect if enabled
        if (config.autoReconnect && state.reconnectAttempts < config.maxReconnectAttempts) {
          const delay = config.reconnectDelay * Math.pow(2, state.reconnectAttempts);
          console.log(`[InfinityTerminal] Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('[InfinityTerminal] WebSocket error:', error);
        const errorMsg = 'Connection failed. Is ttyd running?';
        setState(prev => ({ ...prev, error: errorMsg, connecting: false }));
        onError?.(errorMsg);
      };

      wsRef.current = ws;
    } catch (error) {
      const errorMsg = `Failed to connect: ${error}`;
      setState(prev => ({ ...prev, error: errorMsg, connecting: false }));
      onError?.(errorMsg);
    }
  }, [
    generateSessionName,
    generateSessionId,
    getTtydUrl,
    saveSession,
    layout,
    config.autoReconnect,
    config.maxReconnectAttempts,
    config.reconnectDelay,
    state.reconnectAttempts,
    onConnectionChange,
    onError,
  ]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      connected: false,
      connecting: false,
      reconnectAttempts: 0,
    }));
  }, []);

  // Restore session
  const restoreSession = useCallback((sessionName: string) => {
    const sessions = getStoredSessions();
    const session = sessions.find(s => s.sessionName === sessionName);

    if (session) {
      console.log(`[InfinityTerminal] Restoring session: ${sessionName}`);

      setState(prev => ({
        ...prev,
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        layout: session.layout,
        projectRoot: session.projectRoot,
        createdAt: new Date(session.createdAt),
      }));

      onSessionRestore?.(session.sessionId);
      connect();
    }
  }, [getStoredSessions, connect, onSessionRestore]);

  // Get available sessions
  const getAvailableSessions = useCallback(() => {
    return getStoredSessions().sort(
      (a, b) => new Date(b.lastAccess).getTime() - new Date(a.lastAccess).getTime()
    );
  }, [getStoredSessions]);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setState(prev => ({ ...prev, lastActivity: new Date() }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Don't close WebSocket on unmount - session persists
    };
  }, []);

  // Expose WebSocket for terminal component
  const getWebSocket = useCallback(() => wsRef.current, []);

  return {
    state,
    config,
    connect,
    disconnect,
    restoreSession,
    removeSession,
    getAvailableSessions,
    updateActivity,
    getWebSocket,
    getTtydUrl,
  };
}

export type UseSessionPersistenceReturn = ReturnType<typeof useSessionPersistence>;

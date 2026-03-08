import { env } from '@/lib/env';

export type WebSocketEventHandler = (data: unknown) => void;

interface WebSocketClientOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

/**
 * Lightweight WebSocket client with:
 * - Auto-reconnect with exponential backoff
 * - Event-based message routing
 * - Connection state tracking
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Map<string, Set<WebSocketEventHandler>>();
  private _isConnected = false;

  constructor(options: WebSocketClientOptions = {}) {
    this.url = options.url ?? env.NEXT_PUBLIC_WS_URL;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this._isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection:open', null);
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            type?: string;
            payload?: unknown;
          };
          if (data.type) {
            this.emit(data.type, data.payload);
          }
          this.emit('message', data);
        } catch {
          this.emit('message:raw', event.data);
        }
      };

      this.ws.onclose = () => {
        this._isConnected = false;
        this.emit('connection:close', null);
        this.attemptReconnect();
      };

      this.ws.onerror = () => {
        this._isConnected = false;
        this.emit('connection:error', null);
      };
    } catch {
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
    this.ws = null;
    this._isConnected = false;
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(event: string, handler: WebSocketEventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  off(event: string, handler: WebSocketEventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`WebSocket handler error for "${event}":`, err);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('connection:max-retries', null);
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.emit('connection:reconnecting', { attempt: this.reconnectAttempts });
      this.connect();
    }, delay);
  }
}

// Singleton
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    wsClient = new WebSocketClient();
  }
  return wsClient;
}

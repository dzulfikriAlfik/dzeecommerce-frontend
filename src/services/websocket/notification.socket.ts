import {
  getWebSocketClient,
  type WebSocketEventHandler,
} from '@/lib/websocket';
import {
  useNotificationStore,
  type AppNotification,
} from '@/store/notification.store';

/**
 * Notification WebSocket service.
 * Listens for:
 * - notification:new — new in-app notification
 * - invoice:updated — payment/invoice status change
 */

let unsubscribers: (() => void)[] = [];

export function connectNotificationSocket(): void {
  const ws = getWebSocketClient();
  disconnectNotificationSocket();
  ws.connect();

  const handleNewNotification: WebSocketEventHandler = (data) => {
    const notification = data as AppNotification;
    if (notification?.id && notification?.message) {
      useNotificationStore.getState().addNotification({
        ...notification,
        read: false,
        createdAt: notification.createdAt ?? new Date().toISOString(),
      });
    }
  };

  const handleInvoiceUpdate: WebSocketEventHandler = (data) => {
    const invoice = data as { orderId?: string; status?: string };
    if (invoice?.orderId) {
      useNotificationStore.getState().addNotification({
        id: `invoice-${invoice.orderId}-${Date.now()}`,
        title: 'Payment Update',
        message: `Order ${invoice.orderId} payment status: ${invoice.status ?? 'updated'}`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  unsubscribers.push(ws.on('notification:new', handleNewNotification));
  unsubscribers.push(ws.on('invoice:updated', handleInvoiceUpdate));
}

export function disconnectNotificationSocket(): void {
  unsubscribers.forEach((unsub) => unsub());
  unsubscribers = [];
}

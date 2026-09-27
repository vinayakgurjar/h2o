// Custom event-based toast notification system without window.alert()
export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const listeners: ToastListener[] = [];

export const showToast = (message: string, type: ToastType = 'info', duration: number = 3800) => {
  const toast: ToastItem = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    message,
    type,
    duration,
  };
  listeners.forEach((listener) => listener(toast));
};

export const subscribeToast = (listener: ToastListener) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

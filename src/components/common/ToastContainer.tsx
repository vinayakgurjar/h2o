import React, { useEffect, useState } from 'react';
import { subscribeToast, ToastItem } from '../../utils/toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3800);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl glass-cyber border backdrop-blur-2xl shadow-2xl flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              isSuccess
                ? 'border-[#39FF14]/50 bg-[#050505]/95 text-white shadow-[0_0_25px_rgba(57,255,20,0.25)]'
                : isError
                ? 'border-rose-500/50 bg-[#050505]/95 text-white shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                : 'border-[#BD00FF]/50 bg-[#050505]/95 text-white shadow-[0_0_25px_rgba(189,0,255,0.25)]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#00F0FF]" />}
            </div>

            <div className="flex-1 text-xs font-space font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

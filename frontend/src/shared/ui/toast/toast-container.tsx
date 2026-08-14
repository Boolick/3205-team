import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-[4px] border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3',
            t.type === 'success' && 'bg-[#182a1d]/95 border-[#22c55e]/40 text-[#eeeeee]',
            t.type === 'error' && 'bg-[#2a1818]/95 border-[#ef4444]/40 text-[#eeeeee]',
            t.type === 'info' && 'bg-[#1f1f1f]/95 border-[#323232] text-[#eeeeee]'
          )}
        >
          <div className="flex items-start gap-2.5">
            {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" /> : null}
            {t.type === 'error' ? <AlertCircle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" /> : null}
            {t.type === 'info' ? <Info className="w-4 h-4 text-[#2b7fff] shrink-0 mt-0.5" /> : null}
            <span className="text-[13px] font-sans leading-snug">{t.message}</span>
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="text-[#a4a19b] hover:text-[#eeeeee] transition-colors p-0.5 shrink-0 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

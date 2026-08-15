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
    <div className="pointer-events-none fixed right-5 bottom-5 z-50 flex w-full max-w-md flex-col gap-2 px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'animate-in fade-in slide-in-from-bottom-3 pointer-events-auto flex items-start justify-between gap-3 rounded-[4px] border p-3.5 shadow-lg backdrop-blur-md transition-all duration-200',
            t.type === 'success' && 'border-[#22c55e]/40 bg-[#182a1d]/95 text-[#eeeeee]',
            t.type === 'error' && 'border-[#ef4444]/40 bg-[#2a1818]/95 text-[#eeeeee]',
            t.type === 'info' && 'border-[#323232] bg-[#1f1f1f]/95 text-[#eeeeee]',
          )}
        >
          <div className="flex items-start gap-2.5">
            {t.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4ade80]" />
            ) : null}
            {t.type === 'error' ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f87171]" />
            ) : null}
            {t.type === 'info' ? <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2b7fff]" /> : null}
            <span className="font-sans text-[13px] leading-snug">{t.message}</span>
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="shrink-0 cursor-pointer p-0.5 text-[#a4a19b] transition-colors hover:text-[#eeeeee]"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/ui';

interface CancelDialogProps {
  isOpen: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelDialog({ isOpen, isCancelling, onConfirm, onClose }: CancelDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md space-y-4 rounded-[8px] border border-[#323232] bg-[#1f1f1f] p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-full border border-[#5c1d24] bg-[#2b1416] p-2 text-[#f87171]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-[16px] font-medium text-[#eeeeee]">
              Прервать проверку ссылок?
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#a4a19b]">
              Все проверенные до этого момента URL останутся сохранены в результатах. Оставшиеся в
              очереди ссылки получат статус «Отменено».
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#262626] pt-3">
          <Button variant="subtle" size="sm" onClick={onClose} disabled={isCancelling}>
            Продолжить проверку
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={isCancelling}
            className="gap-1.5"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Отмена...</span>
              </>
            ) : (
              <span>Да, отменить</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

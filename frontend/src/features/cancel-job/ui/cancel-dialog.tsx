import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/ui';

interface CancelDialogProps {
  isOpen: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelDialog({
  isOpen,
  isCancelling,
  onConfirm,
  onClose,
}: CancelDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#1f1f1f] border border-[#323232] rounded-[8px] p-6 max-w-md w-full shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-[#2b1416] border border-[#5c1d24] text-[#f87171] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-[16px] text-[#eeeeee] font-medium">
              Прервать проверку ссылок?
            </h3>
            <p className="text-[13px] text-[#a4a19b] mt-1.5 leading-relaxed">
              Все проверенные до этого момента URL останутся сохранены в результатах.
              Оставшиеся в очереди ссылки получат статус «Отменено».
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
          <Button
            variant="subtle"
            size="sm"
            onClick={onClose}
            disabled={isCancelling}
          >
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
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

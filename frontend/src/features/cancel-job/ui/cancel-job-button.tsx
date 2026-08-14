import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useJobStore } from '../../../entities/job';
import { Button } from '../../../shared/ui';
import { CancelDialog } from './cancel-dialog';

interface CancelJobButtonProps {
  className?: string;
}

export function CancelJobButton({ className }: CancelJobButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeJob, isCancellingJob, cancelActiveJob } = useJobStore();

  const canCancel = activeJob?.status === 'pending' || activeJob?.status === 'in_progress';
  if (!canCancel) return null;

  const handleConfirm = async () => {
    await cancelActiveJob();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isCancellingJob}
        className={className || 'gap-1.5 shrink-0 self-start sm:self-auto'}
      >
        <ShieldAlert className="w-4 h-4" />
        <span>Отменить проверку</span>
      </Button>

      <CancelDialog
        isOpen={isOpen}
        isCancelling={isCancellingJob}
        onConfirm={handleConfirm}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

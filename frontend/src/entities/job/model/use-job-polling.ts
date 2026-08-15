import { useEffect, useRef } from 'react';
import { JobStatus } from './types';
import { useJobStore } from './use-job-store';

const TERMINAL_STATUSES: JobStatus[] = ['completed', 'cancelled', 'failed'];

export function useJobPolling(): void {
  const activeJobId = useJobStore((state) => state.activeJobId);
  const activeJob = useJobStore((state) => state.activeJob);
  const activeJobStatus = activeJob?.status;
  const fetchActiveJob = useJobStore((state) => state.fetchActiveJob);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const addToast = useJobStore((state) => state.addToast);

  const prevStatusRef = useRef<JobStatus | undefined>(activeJobStatus);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (
      activeJobStatus &&
      TERMINAL_STATUSES.includes(activeJobStatus) &&
      prevStatusRef.current &&
      !TERMINAL_STATUSES.includes(prevStatusRef.current)
    ) {
      fetchJobs();

      const shortId = activeJobId?.slice(0, 8) || '';
      if (activeJobStatus === 'completed') {
        const successCount = activeJob?.items.filter((i) => i.status === 'success').length ?? 0;
        const totalCount = activeJob?.items.length ?? 0;
        addToast(
          'success',
          `Задание #${shortId} завершено: ${successCount} из ${totalCount} URL успешно`,
        );
      } else if (activeJobStatus === 'failed') {
        addToast('error', `Задание #${shortId} завершилось с ошибками`);
      } else if (activeJobStatus === 'cancelled') {
        addToast('info', `Задание #${shortId} отменено`);
      }
    }
    prevStatusRef.current = activeJobStatus;
  }, [activeJobStatus, activeJob, activeJobId, fetchJobs, addToast]);

  useEffect(() => {
    if (!activeJobId) {
      return;
    }

    const isTerminal = activeJobStatus && TERMINAL_STATUSES.includes(activeJobStatus);
    if (isTerminal) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const poll = () => {
      if (document.hidden) {
        return;
      }
      fetchActiveJob(activeJobId, abortController.signal, true);
    };

    const intervalId = setInterval(poll, 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden && activeJobId) {
        fetchActiveJob(activeJobId, abortController.signal, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      abortController.abort();
    };
  }, [activeJobId, activeJobStatus, fetchActiveJob]);
}

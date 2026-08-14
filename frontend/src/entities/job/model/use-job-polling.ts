import { useEffect, useRef } from 'react';
import { JobStatus } from './types';
import { useJobStore } from './use-job-store';

const TERMINAL_STATUSES: JobStatus[] = ['completed', 'cancelled', 'failed'];

/**
 * Custom hook for live interval-based polling of the active job.
 * - 1000ms interval while pending / in_progress.
 * - Aborts in-flight requests on activeJobId change or unmount.
 * - Pauses polling when the browser tab is hidden and refetches when visible.
 * - Stops polling when reaching terminal status (completed, cancelled, failed).
 * - Triggers background fetchJobs() and Toast notifications when active job finishes.
 */
export function useJobPolling(): void {
  const activeJobId = useJobStore((state) => state.activeJobId);
  const activeJob = useJobStore((state) => state.activeJob);
  const activeJobStatus = activeJob?.status;
  const fetchActiveJob = useJobStore((state) => state.fetchActiveJob);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const addToast = useJobStore((state) => state.addToast);

  const prevStatusRef = useRef<JobStatus | undefined>(activeJobStatus);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Background sync and notification on status transition to terminal
  useEffect(() => {
    if (
      activeJobStatus &&
      TERMINAL_STATUSES.includes(activeJobStatus) &&
      prevStatusRef.current &&
      !TERMINAL_STATUSES.includes(prevStatusRef.current)
    ) {
      // Transitioned into terminal state -> refresh global jobs list
      fetchJobs();

      // Show completion toast notification
      const shortId = activeJobId?.slice(0, 8) || '';
      if (activeJobStatus === 'completed') {
        const successCount = activeJob?.items.filter((i) => i.status === 'success').length ?? 0;
        const totalCount = activeJob?.items.length ?? 0;
        addToast(
          'success',
          `Задание #${shortId} завершено: ${successCount} из ${totalCount} URL успешно`
        );
      } else if (activeJobStatus === 'failed') {
        addToast('error', `Задание #${shortId} завершилось с ошибками`);
      } else if (activeJobStatus === 'cancelled') {
        addToast('info', `Задание #${shortId} отменено`);
      }
    }
    prevStatusRef.current = activeJobStatus;
  }, [activeJobStatus, activeJob, activeJobId, fetchJobs, addToast]);

  // Polling loop
  useEffect(() => {
    if (!activeJobId) {
      return;
    }

    const isTerminal = activeJobStatus && TERMINAL_STATUSES.includes(activeJobStatus);
    if (isTerminal) {
      return;
    }

    // Cancel previous in-flight request if any
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

    // 1000ms polling interval
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

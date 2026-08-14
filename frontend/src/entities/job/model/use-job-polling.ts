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
 * - Triggers background fetchJobs() when active job finishes.
 */
export function useJobPolling(): void {
  const activeJobId = useJobStore((state) => state.activeJobId);
  const activeJobStatus = useJobStore((state) => state.activeJob?.status);
  const fetchActiveJob = useJobStore((state) => state.fetchActiveJob);
  const fetchJobs = useJobStore((state) => state.fetchJobs);

  const prevStatusRef = useRef<JobStatus | undefined>(activeJobStatus);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Background sync on status transition to terminal
  useEffect(() => {
    if (
      activeJobStatus &&
      TERMINAL_STATUSES.includes(activeJobStatus) &&
      prevStatusRef.current &&
      !TERMINAL_STATUSES.includes(prevStatusRef.current)
    ) {
      // Transitioned into terminal state -> refresh global jobs list
      fetchJobs();
    }
    prevStatusRef.current = activeJobStatus;
  }, [activeJobStatus, fetchJobs]);

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

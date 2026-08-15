import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ApiError } from '../../../shared/api';
import { ToastItem } from '../../../shared/ui/toast';
import { jobApi } from '../api/job-api';
import { Job, JobSummary } from './types';

interface JobState {
  jobs: JobSummary[];
  activeJob: Job | null;
  activeJobId: string | null;
  isLoadingJobs: boolean;
  isLoadingActiveJob: boolean;
  isSubmittingJob: boolean;
  isCancellingJob: boolean;
  error: string | null;
  toasts: ToastItem[];

  setActiveJobId: (id: string | null) => void;
  fetchJobs: (signal?: AbortSignal) => Promise<void>;
  fetchActiveJob: (id?: string, signal?: AbortSignal, silent?: boolean) => Promise<void>;
  createJob: (urls: string[]) => Promise<string>;
  cancelActiveJob: () => Promise<void>;
  clearError: () => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      activeJob: null,
      activeJobId: null,
      isLoadingJobs: false,
      isLoadingActiveJob: false,
      isSubmittingJob: false,
      isCancellingJob: false,
      error: null,
      toasts: [],

      setActiveJobId: (id: string | null) => {
        const currentId = get().activeJobId;
        if (currentId === id) return;

        set({
          activeJobId: id,
          activeJob: null,
          error: null,
        });

        if (id) {
          get().fetchActiveJob(id);
        }
      },

      fetchJobs: async (signal?: AbortSignal) => {
        set({ isLoadingJobs: true, error: null });
        try {
          const jobs = await jobApi.getJobs(signal);
          set({ jobs, isLoadingJobs: false });
        } catch (err) {
          if (signal?.aborted) return;
          const msg = err instanceof ApiError ? err.message : 'Не удалось загрузить список заданий';
          set({ isLoadingJobs: false, error: msg });
        }
      },

      fetchActiveJob: async (id?: string, signal?: AbortSignal, silent: boolean = false) => {
        const targetId = id || get().activeJobId;
        if (!targetId) return;

        if (!silent && (!get().activeJob || get().activeJob?.id !== targetId)) {
          set({ isLoadingActiveJob: true });
        }
        try {
          const activeJob = await jobApi.getJobById(targetId, signal);
          if (get().activeJobId === targetId) {
            set({ activeJob, isLoadingActiveJob: false, error: null });
          }
        } catch (err) {
          if (signal?.aborted) return;
          if (get().activeJobId === targetId) {
            const msg =
              err instanceof ApiError ? err.message : 'Не удалось получить данные задания';
            set({ isLoadingActiveJob: false, error: msg });
          }
        }
      },

      createJob: async (urls: string[]): Promise<string> => {
        set({ isSubmittingJob: true, error: null });
        try {
          const { jobId } = await jobApi.createJob(urls);
          set({
            isSubmittingJob: false,
            activeJobId: jobId,
          });

          get().addToast('success', `Задание #${jobId.slice(0, 8)} успешно создано`);
          await Promise.all([get().fetchJobs(), get().fetchActiveJob(jobId)]);
          return jobId;
        } catch (err) {
          const msg =
            err instanceof ApiError
              ? `${err.message}${err.errors.length > 0 ? ` (${err.errors.join(', ')})` : ''}`
              : 'Ошибка при создании задания';
          set({ isSubmittingJob: false, error: msg });
          get().addToast('error', msg);
          throw err;
        }
      },

      cancelActiveJob: async () => {
        const activeId = get().activeJobId;
        if (!activeId) return;

        set({ isCancellingJob: true });
        try {
          const updatedJob = await jobApi.cancelJob(activeId);
          if (get().activeJobId === activeId) {
            set({ activeJob: updatedJob, isCancellingJob: false });
          }
          get().addToast('info', `Задание #${activeId.slice(0, 8)} отменено`);
          await get().fetchJobs();
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Не удалось отменить задание';
          set({ isCancellingJob: false, error: msg });
          get().addToast('error', msg);
        }
      },

      clearError: () => set({ error: null }),

      addToast: (type, message) => {
        const id = Math.random().toString(36).slice(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      removeToast: (id: string) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: 'altitude-active-job',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeJobId: state.activeJobId }),
    },
  ),
);

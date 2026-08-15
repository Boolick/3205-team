import { useMemo } from 'react';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { JobItem, JobStatus } from '../../../entities/job';

interface ProgressBarProps {
  items: JobItem[];
  jobStatus: JobStatus;
}

export function ProgressBar({ items, jobStatus }: ProgressBarProps) {
  const total = items.length;

  const stats = useMemo(() => {
    let success = 0;
    let error = 0;
    let inProgress = 0;
    let pending = 0;
    let cancelled = 0;

    for (const item of items) {
      if (item.status === 'success') success++;
      else if (item.status === 'error') error++;
      else if (item.status === 'in_progress') inProgress++;
      else if (item.status === 'cancelled') cancelled++;
      else pending++;
    }

    const processed = success + error + cancelled;
    const percent = total > 0 ? Math.round((processed / total) * 100) : 0;

    const successPct = total > 0 ? (success / total) * 100 : 0;
    const errorPct = total > 0 ? (error / total) * 100 : 0;
    const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;

    return {
      success,
      error,
      inProgress,
      pending,
      cancelled,
      processed,
      percent,
      successPct,
      errorPct,
      inProgressPct,
    };
  }, [items, total]);

  const isActive = jobStatus === 'pending' || jobStatus === 'in_progress';

  return (
    <div className="space-y-3 rounded-[6px] border border-[#262626] bg-[#111111] p-4">
      <div className="flex items-center justify-between font-mono text-[12px]">
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2b7fff] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2b7fff]" />
            </span>
          )}
          <span className="text-[#a4a19b]">
            Прогресс:{' '}
            <strong className="font-medium text-[#eeeeee]">
              {stats.processed} из {total} URL
            </strong>
          </span>
        </div>
        <span
          className={`font-mono text-[13px] font-bold ${
            jobStatus === 'completed'
              ? 'text-[#4ade80]'
              : jobStatus === 'failed'
                ? 'text-[#f87171]'
                : 'text-[#2b7fff]'
          }`}
        >
          {stats.percent}%
        </span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-[#262626]/50 bg-[#1f1f1f]">
        <div
          className="h-full bg-[#4ade80] transition-all duration-300 ease-out"
          style={{ width: `${stats.successPct}%` }}
          title={`Успешно: ${stats.success}`}
        />
        <div
          className="h-full bg-[#f87171] transition-all duration-300 ease-out"
          style={{ width: `${stats.errorPct}%` }}
          title={`Ошибки: ${stats.error}`}
        />
        <div
          className="h-full animate-pulse bg-[#2b7fff] transition-all duration-300 ease-out"
          style={{ width: `${stats.inProgressPct}%` }}
          title={`В процессе: ${stats.inProgress}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px]">
        <div className="flex flex-wrap items-center gap-3 text-[#a4a19b]">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-[#4ade80]" />
            <span>Успех: {stats.success}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="h-3 w-3 text-[#f87171]" />
            <span>Ошибки: {stats.error}</span>
          </span>
          {stats.inProgress > 0 && (
            <span className="inline-flex items-center gap-1 text-[#2b7fff]">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Проверяется: {stats.inProgress}</span>
            </span>
          )}
          {stats.pending > 0 && (
            <span className="inline-flex items-center gap-1 text-[#5e5d59]">
              <Clock className="h-3 w-3" />
              <span>Очередь: {stats.pending}</span>
            </span>
          )}
        </div>

        <span className="hidden text-[#5e5d59] sm:inline">Параллельность: 5 потоков</span>
      </div>
    </div>
  );
}

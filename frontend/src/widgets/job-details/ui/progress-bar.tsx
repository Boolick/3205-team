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
    <div className="bg-[#111111] p-4 rounded-[6px] border border-[#262626] space-y-3">
      {/* Top Header: Progress Counter & Percentage */}
      <div className="flex items-center justify-between text-[12px] font-mono">
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2b7fff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2b7fff]" />
            </span>
          )}
          <span className="text-[#a4a19b]">
            Прогресс:{' '}
            <strong className="text-[#eeeeee] font-medium">
              {stats.processed} из {total} URL
            </strong>
          </span>
        </div>
        <span
          className={`font-mono font-bold text-[13px] ${
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

      {/* Multi-Segment Track */}
      <div className="w-full bg-[#1f1f1f] h-2.5 rounded-full overflow-hidden flex border border-[#262626]/50">
        {/* Success segment */}
        <div
          className="h-full bg-[#4ade80] transition-all duration-300 ease-out"
          style={{ width: `${stats.successPct}%` }}
          title={`Успешно: ${stats.success}`}
        />
        {/* Error segment */}
        <div
          className="h-full bg-[#f87171] transition-all duration-300 ease-out"
          style={{ width: `${stats.errorPct}%` }}
          title={`Ошибки: ${stats.error}`}
        />
        {/* In-progress segment */}
        <div
          className="h-full bg-[#2b7fff] animate-pulse transition-all duration-300 ease-out"
          style={{ width: `${stats.inProgressPct}%` }}
          title={`В процессе: ${stats.inProgress}`}
        />
      </div>

      {/* Segment Breakdown Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-3 text-[#a4a19b]">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#4ade80]" />
            <span>Успех: {stats.success}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-[#f87171]" />
            <span>Ошибки: {stats.error}</span>
          </span>
          {stats.inProgress > 0 && (
            <span className="inline-flex items-center gap-1 text-[#2b7fff]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Проверяется: {stats.inProgress}</span>
            </span>
          )}
          {stats.pending > 0 && (
            <span className="inline-flex items-center gap-1 text-[#5e5d59]">
              <Clock className="w-3 h-3" />
              <span>Очередь: {stats.pending}</span>
            </span>
          )}
        </div>

        <span className="text-[#5e5d59] hidden sm:inline">Параллельность: 5 потоков</span>
      </div>
    </div>
  );
}

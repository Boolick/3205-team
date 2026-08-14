import { JobSummary, JobStatus } from '../../../entities/job';
import { Badge } from '../../../shared/ui';
import { cn, formatRelativeTime } from '../../../shared/lib/utils';

interface JobCardProps {
  job: JobSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'В очереди',
  in_progress: 'В процессе',
  completed: 'Завершено',
  cancelled: 'Отменено',
  failed: 'Ошибка',
};

export function JobCard({ job, isActive, onSelect }: JobCardProps) {
  const processedCount = job.successCount + job.errorCount;
  const isFinished = ['completed', 'cancelled', 'failed'].includes(job.status);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(job.id);
        }
      }}
      className={cn(
        'relative p-3.5 rounded-[6px] border transition-all text-left cursor-pointer select-none outline-none group',
        isActive
          ? 'bg-[#262626] border-[#2b7fff] shadow-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#2b7fff] before:rounded-l-[6px]'
          : 'bg-[#1a1a1a] border-[#262626] hover:border-[#383838] hover:bg-[#222222]'
      )}
    >
      {/* Top Row: ID + Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-mono font-medium text-[#eeeeee]">
            #{job.id.slice(0, 8)}
          </span>
        </div>
        <Badge status={job.status} className="text-[10px] px-1.5 py-0">
          {STATUS_LABELS[job.status] || job.status}
        </Badge>
      </div>

      {/* Middle Row: Progress and Counts */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <div className="text-[#a4a19b]">
          Прогресс:{' '}
          <span className="text-[#eeeeee] font-medium">
            {processedCount}/{job.totalUrls}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          {job.successCount > 0 && (
            <span className="text-[#4ade80]" title="Успешные проверки">
              +{job.successCount} OK
            </span>
          )}
          {job.errorCount > 0 && (
            <span className="text-[#f87171]" title="Ошибки проверки">
              {job.errorCount} ERR
            </span>
          )}
        </div>
      </div>

      {/* Bottom Progress Bar Indicator for ongoing jobs */}
      {!isFinished && (
        <div className="mt-2.5 w-full bg-[#111111] h-1 rounded-full overflow-hidden">
          <div
            className="bg-[#2b7fff] h-full transition-all duration-300 rounded-full"
            style={{
              width: `${Math.min(100, Math.round((processedCount / (job.totalUrls || 1)) * 100))}%`,
            }}
          />
        </div>
      )}

      {/* Footer: Date */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-[#5e5d59]">
        <span title={new Date(job.createdAt).toLocaleString('ru-RU')}>
          {formatRelativeTime(job.createdAt)}
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2b7fff] text-[10px]">
          Открыть →
        </span>
      </div>
    </div>
  );
}

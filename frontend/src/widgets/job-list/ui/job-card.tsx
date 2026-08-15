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
        'group relative cursor-pointer rounded-[6px] border p-3.5 text-left transition-all outline-none select-none',
        isActive
          ? 'border-[#2b7fff] bg-[#262626] shadow-sm before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[3px] before:rounded-l-[6px] before:bg-[#2b7fff]'
          : 'border-[#262626] bg-[#1a1a1a] hover:border-[#383838] hover:bg-[#222222]',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[12px] font-medium text-[#eeeeee]">
            #{job.id.slice(0, 8)}
          </span>
        </div>
        <Badge status={job.status} className="px-1.5 py-0 text-[10px]">
          {STATUS_LABELS[job.status] || job.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px]">
        <div className="text-[#a4a19b]">
          Прогресс:{' '}
          <span className="font-medium text-[#eeeeee]">
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

      {!isFinished && (
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-[#111111]">
          <div
            className="h-full rounded-full bg-[#2b7fff] transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.round((processedCount / (job.totalUrls || 1)) * 100))}%`,
            }}
          />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-[10px] text-[#5e5d59]">
        <span title={new Date(job.createdAt).toLocaleString('ru-RU')}>
          {formatRelativeTime(job.createdAt)}
        </span>
        <span className="text-[10px] text-[#2b7fff] opacity-0 transition-opacity group-hover:opacity-100">
          Открыть →
        </span>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { useJobStore, JobStatus } from '../../../entities/job';
import { CancelJobButton } from '../../../features/cancel-job';
import {
  UrlFilterBar,
  filterJobUrls,
  getJobUrlCounts,
  FilterStatus,
} from '../../../features/filter-job-urls';
import { Badge, CopyButton } from '../../../shared/ui';
import { ProgressBar } from './progress-bar';
import { UrlTable } from './url-table';

const STATUS_TITLES: Record<JobStatus, string> = {
  pending: 'В очереди',
  in_progress: 'Выполняется проверка',
  completed: 'Проверка завершена',
  cancelled: 'Проверка прервана',
  failed: 'Проверка завершилась с ошибкой',
};

export function JobDetails() {
  const { activeJob, isLoadingActiveJob } = useJobStore();

  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(
    () =>
      activeJob
        ? getJobUrlCounts(activeJob.items)
        : { all: 0, success: 0, error: 0, in_progress: 0, pending: 0, cancelled: 0 },
    [activeJob],
  );

  const filteredItems = useMemo(
    () => (activeJob ? filterJobUrls(activeJob.items, selectedFilter, searchQuery) : []),
    [activeJob, selectedFilter, searchQuery],
  );

  if (isLoadingActiveJob && !activeJob) {
    return (
      <div className="min-h-[460px] animate-pulse space-y-6 rounded-[8px] border border-[#262626] bg-[#1f1f1f] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-[4px] bg-[#262626]" />
            <div className="h-3 w-64 rounded-[3px] bg-[#262626]" />
          </div>
          <div className="h-7 w-24 rounded-[4px] bg-[#262626]" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-[6px] bg-[#262626]" />
          ))}
        </div>
        <div className="h-64 rounded-[6px] bg-[#262626]" />
      </div>
    );
  }

  if (!activeJob) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[8px] border border-[#262626] bg-[#1f1f1f] p-8 text-center shadow-sm">
        <div className="mb-4 rounded-full border border-[#262626] bg-[#111111] p-4 text-[#2b7fff] shadow-inner">
          <Activity className="h-8 w-8 opacity-80" />
        </div>
        <h2 className="mb-2 font-serif text-[18px] font-medium text-[#eeeeee]">
          Задача не выбрана
        </h2>
        <p className="mb-6 max-w-[360px] text-[13px] leading-relaxed text-[#a4a19b]">
          Выберите задание из истории проверок слева или вставьте список URL в форму для запуска
          новой проверки.
        </p>
        <div className="flex items-center gap-2 rounded-[4px] border border-[#262626] bg-[#111111] px-3 py-1.5 font-mono text-[12px] text-[#5e5d59]">
          <Sparkles className="h-3.5 w-3.5 text-[#2b7fff]" />
          <span>Поддерживается до 5 параллельных запросов на задачу</span>
        </div>
      </div>
    );
  }

  const total = activeJob.items.length;
  const successCount = counts.success;
  const errorCount = counts.error;
  const inProgressCount = counts.in_progress;
  const pendingCount = counts.pending;

  return (
    <div className="space-y-6 rounded-[8px] border border-[#262626] bg-[#1f1f1f] p-6 shadow-sm transition-all duration-200">
      <div className="flex flex-col justify-between gap-4 border-b border-[#262626] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-[18px] font-medium text-[#eeeeee]">
              {STATUS_TITLES[activeJob.status] || 'Детализация проверки'}
            </h2>
            <Badge status={activeJob.status}>{activeJob.status}</Badge>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-mono text-[12px] text-[#a4a19b]">ID: {activeJob.id}</span>
            <CopyButton text={activeJob.id} label="" showTooltip={true} />
          </div>
        </div>

        <CancelJobButton />
      </div>

      <ProgressBar items={activeJob.items} jobStatus={activeJob.status} />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-[6px] border border-[#262626] bg-[#111111] p-3">
          <span className="block font-mono text-[11px] tracking-wider text-[#a4a19b] uppercase">
            Всего ссылок
          </span>
          <span className="mt-0.5 block font-mono text-[18px] font-medium text-[#eeeeee]">
            {total}
          </span>
        </div>

        <div className="rounded-[6px] border border-[#1d4d33] bg-[#111111] p-3">
          <span className="block font-mono text-[11px] tracking-wider text-[#4ade80] uppercase">
            Успешно (2xx)
          </span>
          <span className="mt-0.5 block font-mono text-[18px] font-medium text-[#4ade80]">
            {successCount}
          </span>
        </div>

        <div className="rounded-[6px] border border-[#5c1d24] bg-[#111111] p-3">
          <span className="block font-mono text-[11px] tracking-wider text-[#f87171] uppercase">
            Ошибки
          </span>
          <span className="mt-0.5 block font-mono text-[18px] font-medium text-[#f87171]">
            {errorCount}
          </span>
        </div>

        <div className="rounded-[6px] border border-[#262626] bg-[#111111] p-3">
          <span className="block font-mono text-[11px] tracking-wider text-[#a4a19b] uppercase">
            В очереди / Процессе
          </span>
          <span className="mt-0.5 block font-mono text-[18px] font-medium text-[#eeeeee]">
            {inProgressCount + pendingCount}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[15px] font-medium text-[#eeeeee]">
            Результаты проверки ссылок
          </h3>
        </div>

        <UrlFilterBar
          selectedFilter={selectedFilter}
          searchQuery={searchQuery}
          counts={counts}
          onFilterChange={setSelectedFilter}
          onSearchChange={setSearchQuery}
        />

        <UrlTable
          items={filteredItems}
          emptyMessage={
            searchQuery ? 'Ничего не найдено по вашему запросу' : 'Нет ссылок с выбранным статусом'
          }
        />
      </div>
    </div>
  );
}

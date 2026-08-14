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

  // Filter items using the extracted feature helper
  const counts = useMemo(
    () => (activeJob ? getJobUrlCounts(activeJob.items) : { all: 0, success: 0, error: 0, in_progress: 0, pending: 0, cancelled: 0 }),
    [activeJob]
  );

  const filteredItems = useMemo(
    () => (activeJob ? filterJobUrls(activeJob.items, selectedFilter, searchQuery) : []),
    [activeJob, selectedFilter, searchQuery]
  );

  // 1. Loading State when changing active job
  if (isLoadingActiveJob && !activeJob) {
    return (
      <div className="bg-[#1f1f1f] border border-[#262626] rounded-[8px] p-6 shadow-sm min-h-[460px] animate-pulse space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="space-y-2">
            <div className="w-48 h-5 bg-[#262626] rounded-[4px]" />
            <div className="w-64 h-3 bg-[#262626] rounded-[3px]" />
          </div>
          <div className="w-24 h-7 bg-[#262626] rounded-[4px]" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#262626] rounded-[6px]" />
          ))}
        </div>
        <div className="h-64 bg-[#262626] rounded-[6px]" />
      </div>
    );
  }

  // 2. Empty State (No Active Job Selected)
  if (!activeJob) {
    return (
      <div className="bg-[#1f1f1f] border border-[#262626] rounded-[8px] p-8 shadow-sm min-h-[460px] flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-[#111111] border border-[#262626] text-[#2b7fff] mb-4 shadow-inner">
          <Activity className="w-8 h-8 opacity-80" />
        </div>
        <h2 className="font-serif text-[18px] text-[#eeeeee] mb-2 font-medium">
          Задача не выбрана
        </h2>
        <p className="text-[13px] text-[#a4a19b] max-w-[360px] leading-relaxed mb-6">
          Выберите задание из истории проверок слева или вставьте список URL в форму для запуска новой проверки.
        </p>
        <div className="flex items-center gap-2 text-[12px] font-mono text-[#5e5d59] bg-[#111111] px-3 py-1.5 rounded-[4px] border border-[#262626]">
          <Sparkles className="w-3.5 h-3.5 text-[#2b7fff]" />
          <span>Поддерживается до 5 параллельных запросов на задачу</span>
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const total = activeJob.items.length;
  const successCount = counts.success;
  const errorCount = counts.error;
  const inProgressCount = counts.in_progress;
  const pendingCount = counts.pending;

  return (
    <div className="bg-[#1f1f1f] border border-[#262626] rounded-[8px] p-6 shadow-sm space-y-6 transition-all duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif text-[18px] text-[#eeeeee] font-medium">
              {STATUS_TITLES[activeJob.status] || 'Детализация проверки'}
            </h2>
            <Badge status={activeJob.status}>
              {activeJob.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[12px] font-mono text-[#a4a19b]">
              ID: {activeJob.id}
            </span>
            <CopyButton text={activeJob.id} label="" showTooltip={true} />
          </div>
        </div>

        {/* Feature: Cancel Job Action */}
        <CancelJobButton />
      </div>

      {/* Multi-Segment Progress Bar */}
      <ProgressBar items={activeJob.items} jobStatus={activeJob.status} />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#111111] border border-[#262626] p-3 rounded-[6px]">
          <span className="text-[11px] font-mono text-[#a4a19b] uppercase tracking-wider block">
            Всего ссылок
          </span>
          <span className="text-[18px] font-mono font-medium text-[#eeeeee] mt-0.5 block">
            {total}
          </span>
        </div>

        <div className="bg-[#111111] border border-[#1d4d33] p-3 rounded-[6px]">
          <span className="text-[11px] font-mono text-[#4ade80] uppercase tracking-wider block">
            Успешно (2xx)
          </span>
          <span className="text-[18px] font-mono font-medium text-[#4ade80] mt-0.5 block">
            {successCount}
          </span>
        </div>

        <div className="bg-[#111111] border border-[#5c1d24] p-3 rounded-[6px]">
          <span className="text-[11px] font-mono text-[#f87171] uppercase tracking-wider block">
            Ошибки
          </span>
          <span className="text-[18px] font-mono font-medium text-[#f87171] mt-0.5 block">
            {errorCount}
          </span>
        </div>

        <div className="bg-[#111111] border border-[#262626] p-3 rounded-[6px]">
          <span className="text-[11px] font-mono text-[#a4a19b] uppercase tracking-wider block">
            В очереди / Процессе
          </span>
          <span className="text-[18px] font-mono font-medium text-[#eeeeee] mt-0.5 block">
            {inProgressCount + pendingCount}
          </span>
        </div>
      </div>

      {/* URL Verification Table with Feature Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[15px] text-[#eeeeee] font-medium">
            Результаты проверки ссылок
          </h3>
        </div>

        {/* Feature: Filter Bar */}
        <UrlFilterBar
          selectedFilter={selectedFilter}
          searchQuery={searchQuery}
          counts={counts}
          onFilterChange={setSelectedFilter}
          onSearchChange={setSearchQuery}
        />

        {/* Table View */}
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

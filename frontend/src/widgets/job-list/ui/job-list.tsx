import { ListOrdered, RotateCw, Inbox } from 'lucide-react';
import { useJobStore } from '../../../entities/job';
import { JobCard } from './job-card';
import { JobListSkeleton } from './job-list-skeleton';

export function JobList() {
  const { jobs, activeJobId, isLoadingJobs, fetchJobs, setActiveJobId } = useJobStore();

  const handleRefresh = () => {
    fetchJobs();
  };

  return (
    <div className="flex flex-col rounded-[8px] border border-[#262626] bg-[#1f1f1f] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-[#2b7fff]" />
          <h2 className="font-serif text-[16px] text-[#eeeeee]">История проверок</h2>
          {jobs.length > 0 && (
            <span className="rounded border border-[#323232] bg-[#262626] px-1.5 py-0.5 font-mono text-[11px] text-[#a4a19b]">
              {jobs.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoadingJobs}
          title="Обновить список заданий"
          className="cursor-pointer rounded-[4px] p-1 text-[#a4a19b] transition-colors hover:bg-[#262626] hover:text-[#eeeeee] focus:outline-none disabled:opacity-50"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${isLoadingJobs ? 'animate-spin text-[#2b7fff]' : ''}`}
          />
        </button>
      </div>

      <div className="max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
        {isLoadingJobs && jobs.length === 0 ? (
          <JobListSkeleton />
        ) : jobs.length === 0 ? (
          <div className="rounded-[6px] border border-dashed border-[#262626] bg-[#111111]/40 px-4 py-10 text-center">
            <Inbox className="mx-auto mb-2 h-8 w-8 text-[#5e5d59]" />
            <p className="mb-1 text-[13px] font-medium text-[#eeeeee]">История проверок пуста</p>
            <p className="mx-auto max-w-[240px] text-[12px] leading-relaxed text-[#a4a19b]">
              Вставьте список URL в форму выше и запустите первую проверку.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isActive={activeJobId === job.id}
              onSelect={setActiveJobId}
            />
          ))
        )}
      </div>
    </div>
  );
}

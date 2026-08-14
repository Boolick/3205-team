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
    <div className="bg-[#1f1f1f] border border-[#262626] rounded-[8px] p-5 shadow-sm flex flex-col">
      {/* Header with Title and Refresh Action */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-[#2b7fff]" />
          <h2 className="font-serif text-[16px] text-[#eeeeee]">История проверок</h2>
          {jobs.length > 0 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#262626] text-[#a4a19b] border border-[#323232]">
              {jobs.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoadingJobs}
          title="Обновить список заданий"
          className="p-1 text-[#a4a19b] hover:text-[#eeeeee] hover:bg-[#262626] rounded-[4px] transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoadingJobs ? 'animate-spin text-[#2b7fff]' : ''}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
        {isLoadingJobs && jobs.length === 0 ? (
          <JobListSkeleton />
        ) : jobs.length === 0 ? (
          <div className="py-10 px-4 text-center bg-[#111111]/40 border border-dashed border-[#262626] rounded-[6px]">
            <Inbox className="w-8 h-8 text-[#5e5d59] mx-auto mb-2" />
            <p className="font-medium text-[13px] text-[#eeeeee] mb-1">История проверок пуста</p>
            <p className="text-[12px] text-[#a4a19b] max-w-[240px] mx-auto leading-relaxed">
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

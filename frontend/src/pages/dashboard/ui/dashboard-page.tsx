import { useEffect, useState } from 'react';
import { PlusCircle, History, Activity } from 'lucide-react';
import { useJobStore, useJobPolling } from '../../../entities/job';
import { CreateJobForm } from '../../../features/create-job';
import { ToastContainer } from '../../../shared/ui';
import { DashboardLayout } from '../../../widgets/dashboard-layout';
import { Header } from '../../../widgets/header';
import { JobDetails } from '../../../widgets/job-details';
import { JobList } from '../../../widgets/job-list';

type MobileTab = 'create' | 'history' | 'details';

export function DashboardPage() {
  const { activeJobId, jobs, fetchJobs, fetchActiveJob, toasts, removeToast } = useJobStore();
  const [activeTab, setActiveTab] = useState<MobileTab>('create');

  useJobPolling();
  useEffect(() => {
    fetchJobs();
    if (activeJobId) {
      fetchActiveJob(activeJobId);
    }
  }, [activeJobId, fetchJobs, fetchActiveJob]);

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#181818] font-sans text-[#eeeeee] selection:bg-[#2b7fff]/30 selection:text-[#eeeeee]">
      <Header />

      <div className="sticky top-0 z-20 border-b border-[#262626] bg-[#181818]/95 px-4 py-2 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-3 gap-1 rounded-[6px] border border-[#262626] bg-[#111111] p-1">
          <button
            type="button"
            onClick={() => handleTabChange('create')}
            className={`flex items-center justify-center gap-1.5 rounded-[4px] px-2 py-2 text-[12px] font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-[#262626] font-semibold text-[#eeeeee] shadow-sm'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Создать</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('history')}
            className={`relative flex items-center justify-center gap-1.5 rounded-[4px] px-2 py-2 text-[12px] font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-[#262626] font-semibold text-[#eeeeee] shadow-sm'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>История</span>
            {jobs.length > 0 && (
              <span className="py-0.2 ml-1 rounded-full border border-[#323232] bg-[#1f1f1f] px-1.5 font-mono text-[10px] text-[#a4a19b]">
                {jobs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('details')}
            className={`flex items-center justify-center gap-1.5 rounded-[4px] px-2 py-2 text-[12px] font-medium transition-all ${
              activeTab === 'details'
                ? 'bg-[#262626] font-semibold text-[#2b7fff] shadow-sm'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Детали</span>
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <DashboardLayout
          leftSlot={
            <>
              <CreateJobForm />
              <JobList />
            </>
          }
          rightSlot={<JobDetails />}
        />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 py-4 md:hidden">
        {activeTab === 'create' && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <CreateJobForm />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <JobList />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="animate-in fade-in space-y-4 duration-200">
            <JobDetails />
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

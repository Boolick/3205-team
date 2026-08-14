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

  // Mount real-time interval-based live polling
  useJobPolling();

  // Initial mount: load jobs and active job if persisted
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
    <div className="min-h-screen bg-[#181818] text-[#eeeeee] flex flex-col font-sans selection:bg-[#2b7fff]/30 selection:text-[#eeeeee]">
      <Header />

      {/* Mobile Tab Navigation Bar (Visible only on < md screens) */}
      <div className="md:hidden sticky top-0 z-20 bg-[#181818]/95 backdrop-blur-md border-b border-[#262626] px-4 py-2">
        <div className="grid grid-cols-3 gap-1 bg-[#111111] p-1 rounded-[6px] border border-[#262626]">
          <button
            type="button"
            onClick={() => handleTabChange('create')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[4px] text-[12px] font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-[#262626] text-[#eeeeee] shadow-sm font-semibold'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Создать</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('history')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[4px] text-[12px] font-medium transition-all relative ${
              activeTab === 'history'
                ? 'bg-[#262626] text-[#eeeeee] shadow-sm font-semibold'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>История</span>
            {jobs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#1f1f1f] text-[#a4a19b] text-[10px] rounded-full font-mono border border-[#323232]">
                {jobs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('details')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[4px] text-[12px] font-medium transition-all ${
              activeTab === 'details'
                ? 'bg-[#262626] text-[#2b7fff] shadow-sm font-semibold'
                : 'text-[#a4a19b] hover:text-[#eeeeee]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Детали</span>
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Multi-Column Layout (md:block) */}
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

      {/* Mobile Tab Views (md:hidden) */}
      <div className="md:hidden max-w-[1200px] mx-auto px-4 py-4 w-full">
        {activeTab === 'create' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <CreateJobForm />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <JobList />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <JobDetails />
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

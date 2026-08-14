import { useEffect } from 'react';
import { useJobStore, useJobPolling } from '../../../entities/job';
import { CreateJobForm } from '../../../features/create-job';
import { ToastContainer } from '../../../shared/ui';
import { DashboardLayout } from '../../../widgets/dashboard-layout';
import { Header } from '../../../widgets/header';
import { JobDetails } from '../../../widgets/job-details';
import { JobList } from '../../../widgets/job-list';

export function DashboardPage() {
  const { activeJobId, fetchJobs, fetchActiveJob, toasts, removeToast } = useJobStore();

  // Mount real-time interval-based live polling
  useJobPolling();

  // Initial mount: load jobs and active job if persisted
  useEffect(() => {
    fetchJobs();
    if (activeJobId) {
      fetchActiveJob(activeJobId);
    }
  }, [activeJobId, fetchJobs, fetchActiveJob]);

  return (
    <div className="min-h-screen bg-[#181818] text-[#eeeeee] flex flex-col font-sans selection:bg-[#2b7fff]/30 selection:text-[#eeeeee]">
      <Header />

      <DashboardLayout
        leftSlot={
          <>
            <CreateJobForm />
            <JobList />
          </>
        }
        rightSlot={<JobDetails />}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

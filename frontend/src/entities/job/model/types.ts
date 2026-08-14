export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type JobItemStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface JobItem {
  url: string;
  status: JobItemStatus;
  httpCode?: number;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
}

export interface Job {
  id: string;
  createdAt: string;
  status: JobStatus;
  items: JobItem[];
}

export interface JobSummary {
  id: string;
  createdAt: string;
  status: JobStatus;
  totalUrls: number;
  successCount: number;
  errorCount: number;
}

export interface CreateJobPayload {
  urls: string[];
}

export interface CreateJobResponse {
  jobId: string;
}

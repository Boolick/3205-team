export enum JobStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export enum JobItemStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
  ERROR = "error",
  CANCELLED = "cancelled",
}

export interface JobItem {
  url: string;
  status: JobItemStatus;
  httpCode?: number;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: number; // duration in ms
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

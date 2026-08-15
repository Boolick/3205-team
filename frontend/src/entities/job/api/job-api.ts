import { API_BASE, handleApiResponse } from '../../../shared/api';
import { CreateJobResponse, Job, JobSummary } from '../model/types';

export const jobApi = {
  async createJob(urls: string[]): Promise<CreateJobResponse> {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });
    return handleApiResponse<CreateJobResponse>(response);
  },

  async getJobs(signal?: AbortSignal): Promise<JobSummary[]> {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
    return handleApiResponse<JobSummary[]>(response);
  },

  async getJobById(id: string, signal?: AbortSignal): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
    return handleApiResponse<Job>(response);
  },

  async cancelJob(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleApiResponse<Job>(response);
  },
};

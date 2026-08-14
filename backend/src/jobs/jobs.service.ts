import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { randomUUID } from "crypto";
import {
  Job,
  JobItem,
  JobStatus,
  JobItemStatus,
  JobSummary,
} from "./interfaces/job.interface";
import { AsyncSemaphore } from "./utils/async-semaphore.util";
import { checkUrl } from "./utils/url-checker.util";

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();
  private readonly abortControllers = new Map<string, AbortController>();
  private readonly createdTimestamps = new Map<string, number>();

  createJob(urls: string[]): { jobId: string } {
    const jobId = randomUUID();
    const now = new Date().toISOString();
    const timestamp = Date.now();

    const items: JobItem[] = urls.map((url) => ({
      url,
      status: JobItemStatus.PENDING,
    }));

    const job: Job = {
      id: jobId,
      createdAt: now,
      status: JobStatus.PENDING,
      items,
    };

    const controller = new AbortController();

    this.jobs.set(jobId, job);
    this.abortControllers.set(jobId, controller);
    this.createdTimestamps.set(jobId, timestamp);

    // Asynchronously process job in background
    this.processJobInBackground(jobId, controller).catch(() => {
      // Errors handled internally per item
    });

    return { jobId };
  }

  getAllJobs(): JobSummary[] {
    const list: JobSummary[] = [];

    for (const job of this.jobs.values()) {
      let successCount = 0;
      let errorCount = 0;

      for (const item of job.items) {
        if (item.status === JobItemStatus.SUCCESS) {
          successCount++;
        } else if (item.status === JobItemStatus.ERROR) {
          errorCount++;
        }
      }

      list.push({
        id: job.id,
        createdAt: job.createdAt,
        status: job.status,
        totalUrls: job.items.length,
        successCount,
        errorCount,
      });
    }

    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getJobById(id: string): Job {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }
    return job;
  }

  cancelJob(id: string): Job {
    const job = this.getJobById(id);

    const controller = this.abortControllers.get(id);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(id);
    }

    job.status = JobStatus.CANCELLED;

    for (const item of job.items) {
      if (
        item.status === JobItemStatus.PENDING ||
        item.status === JobItemStatus.IN_PROGRESS
      ) {
        item.status = JobItemStatus.CANCELLED;
      }
    }

    return job;
  }

  private async processJobInBackground(
    jobId: string,
    controller: AbortController,
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = JobStatus.IN_PROGRESS;
    const semaphore = new AsyncSemaphore(5);

    const promises = job.items.map(async (item) => {
      if (controller.signal.aborted) {
        item.status = JobItemStatus.CANCELLED;
        return;
      }

      await semaphore.acquire();
      try {
        if (controller.signal.aborted) {
          item.status = JobItemStatus.CANCELLED;
          return;
        }

        item.status = JobItemStatus.IN_PROGRESS;
        item.startedAt = new Date().toISOString();

        const result = await checkUrl(item.url, controller.signal);

        if (controller.signal.aborted) {
          item.status = JobItemStatus.CANCELLED;
          return;
        }

        item.finishedAt = new Date().toISOString();
        item.duration = result.duration;
        item.httpCode = result.httpCode;
        item.errorMessage = result.errorMessage;
        item.status =
          result.status === "success"
            ? JobItemStatus.SUCCESS
            : JobItemStatus.ERROR;
      } catch (error: unknown) {
        item.finishedAt = new Date().toISOString();
        const err = error as Error | undefined;
        if (controller.signal.aborted || err?.message === "Operation aborted") {
          item.status = JobItemStatus.CANCELLED;
        } else {
          item.status = JobItemStatus.ERROR;
          item.errorMessage = err?.message || "Check failed";
        }
      } finally {
        semaphore.release();
      }
    });

    await Promise.allSettled(promises);

    if (
      (job.status as JobStatus) === JobStatus.CANCELLED ||
      controller.signal.aborted
    ) {
      job.status = JobStatus.CANCELLED;
      return;
    }

    const allFailed =
      job.items.length > 0 &&
      job.items.every((i) => i.status === JobItemStatus.ERROR);
    job.status = allFailed ? JobStatus.FAILED : JobStatus.COMPLETED;
    this.abortControllers.delete(jobId);
  }

  @Cron(CronExpression.EVERY_HOUR)
  cleanupExpiredJobs(): void {
    const now = Date.now();
    const ttlMs = 24 * 60 * 60 * 1000;

    for (const [jobId, timestamp] of this.createdTimestamps.entries()) {
      if (now - timestamp > ttlMs) {
        const controller = this.abortControllers.get(jobId);
        if (controller) {
          controller.abort();
          this.abortControllers.delete(jobId);
        }
        this.jobs.delete(jobId);
        this.createdTimestamps.delete(jobId);
      }
    }
  }
}

import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobSummary } from './interfaces/job.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  createJob(@Body() createJobDto: CreateJobDto): { jobId: string } {
    return this.jobsService.createJob(createJobDto.urls);
  }

  @Get()
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  getAllJobs(): JobSummary[] {
    return this.jobsService.getAllJobs();
  }

  @Get(':id')
  @Throttle({ short: { limit: 60, ttl: 60000 } })
  getJobById(@Param('id') id: string): Job {
    return this.jobsService.getJobById(id);
  }

  @Delete(':id')
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  cancelJob(@Param('id') id: string): Job {
    return this.jobsService.cancelJob(id);
  }
}

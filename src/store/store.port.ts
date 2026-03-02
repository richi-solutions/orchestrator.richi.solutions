import { Result } from '../lib/result';
import { JobResult } from '../contracts/v1/job-result.schema';

export interface StorePort {
  saveJobRun(result: JobResult): Promise<Result<{ id: string }>>;
  getLatestJobRun(jobName: string): Promise<Result<JobResult | null>>;
  listJobRuns(opts: { jobName?: string; limit?: number }): Promise<Result<JobResult[]>>;
}

import { Result } from '../lib/result';
import { JobResult } from '../contracts/v1/job-result.schema';

export interface CommitSummaryInput {
  jobRunId: string;
  summaryDate: string;
  content: string;
  reposActive: string[];
  totalCommits: number;
}

export interface StorePort {
  saveJobRun(result: JobResult): Promise<Result<{ id: string }>>;
  getLatestJobRun(jobName: string): Promise<Result<JobResult | null>>;
  listJobRuns(opts: { jobName?: string; limit?: number }): Promise<Result<JobResult[]>>;
  saveCommitSummary(input: CommitSummaryInput): Promise<Result<{ id: string }>>;
}

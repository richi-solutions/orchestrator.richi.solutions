import { Result } from '../lib/result';
import { JobResult } from '../contracts/v1/job-result.schema';
import { JobDefinition } from '../contracts/v1/schedule.schema';

export interface ExecutorPort {
  execute(jobName: string, jobDef: JobDefinition): Promise<Result<JobResult>>;
}

import { v4 as uuidv4 } from 'uuid';
import { ExecutorPort } from './executor.port';
import { JobDefinition } from '../contracts/v1/schedule.schema';
import { JobResult } from '../contracts/v1/job-result.schema';
import { Result, failure } from '../lib/result';
import { SweepHandler } from './handlers/sweep.handler';
import { AggregateHandler } from './handlers/aggregate.handler';
import { ChainHandler } from './handlers/chain.handler';
import { ProvisionHandler } from './handlers/provision.handler';

export class Executor implements ExecutorPort {
  constructor(
    private sweep: SweepHandler,
    private aggregate: AggregateHandler,
    private chain: ChainHandler,
    private provision: ProvisionHandler,
  ) {}

  async execute(jobName: string, jobDef: JobDefinition): Promise<Result<JobResult>> {
    switch (jobDef.type) {
      case 'sweep':
        return this.sweep.run(jobName, jobDef);
      case 'aggregate':
        return this.aggregate.run(jobName, jobDef);
      case 'chain':
        return this.chain.run(jobName, jobDef);
      case 'provision':
        return this.provision.run(jobName, jobDef);
      default:
        return failure('EXECUTOR_ERROR', `Unknown job type: ${jobDef.type}`, uuidv4());
    }
  }
}

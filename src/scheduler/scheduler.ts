import cron from 'node-cron';
import { ScheduleConfig, JobDefinition } from '../contracts/v1/schedule.schema';
import { logger } from '../lib/logger';

export class Scheduler {
  private tasks: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    private config: ScheduleConfig,
    private onJobTrigger: (jobName: string, jobDef: JobDefinition) => Promise<void>,
  ) {}

  start(): void {
    for (const [name, def] of Object.entries(this.config.jobs)) {
      if (!cron.validate(def.cron)) {
        logger.error('invalid_cron', new Error(`Invalid cron expression: ${def.cron}`), { jobName: name });
        continue;
      }

      const task = cron.schedule(def.cron, () => {
        logger.info('job_triggered', { jobName: name, type: def.type });
        this.onJobTrigger(name, def).catch((err) => {
          logger.error('job_execution_failed', err, { jobName: name });
        });
      });

      this.tasks.set(name, task);
      logger.info('job_scheduled', { jobName: name, cron: def.cron, type: def.type });
    }

    logger.info('scheduler_started', { jobCount: this.tasks.size });
  }

  stop(): void {
    for (const [name, task] of this.tasks) {
      task.stop();
      logger.info('job_stopped', { jobName: name });
    }
    this.tasks.clear();
    logger.info('scheduler_stopped');
  }

  triggerManually(jobName: string): boolean {
    const def = this.config.jobs[jobName];
    if (!def) return false;

    logger.info('job_manual_trigger', { jobName });
    this.onJobTrigger(jobName, def).catch((err) => {
      logger.error('manual_trigger_failed', err, { jobName });
    });
    return true;
  }

  getJobNames(): string[] {
    return Object.keys(this.config.jobs);
  }
}

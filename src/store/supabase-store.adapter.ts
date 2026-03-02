import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { StorePort } from './store.port';
import { JobResult } from '../contracts/v1/job-result.schema';
import { Result, success, failure } from '../lib/result';
import { logger } from '../lib/logger';

export class SupabaseStoreAdapter implements StorePort {
  private client: SupabaseClient;

  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey);
  }

  async saveJobRun(result: JobResult): Promise<Result<{ id: string }>> {
    const traceId = uuidv4();
    try {
      const { data, error } = await this.client
        .from('job_runs')
        .insert({
          job_name: result.jobName,
          job_type: result.jobType,
          started_at: result.startedAt,
          completed_at: result.completedAt,
          duration_ms: result.durationMs,
          status: result.status,
          targets: result.targets,
          results: result.results,
          summary: result.summary ?? null,
        })
        .select('id')
        .single();

      if (error) {
        logger.error('store_save_failed', error, { traceId, jobName: result.jobName });
        return failure('STORE_ERROR', error.message, traceId);
      }

      logger.info('store_saved', { traceId, id: data.id, jobName: result.jobName });
      return success({ id: data.id });
    } catch (err) {
      logger.error('store_save_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to save job run', traceId);
    }
  }

  async getLatestJobRun(jobName: string): Promise<Result<JobResult | null>> {
    const traceId = uuidv4();
    try {
      const { data, error } = await this.client
        .from('job_runs')
        .select('*')
        .eq('job_name', jobName)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return failure('STORE_ERROR', error.message, traceId);
      }

      if (!data) return success(null);

      return success({
        jobName: data.job_name,
        jobType: data.job_type,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        durationMs: data.duration_ms,
        status: data.status,
        targets: data.targets,
        results: data.results,
        summary: data.summary,
      });
    } catch (err) {
      logger.error('store_get_latest_error', err, { traceId, jobName });
      return failure('STORE_ERROR', 'Failed to get latest job run', traceId);
    }
  }

  async listJobRuns(opts: { jobName?: string; limit?: number }): Promise<Result<JobResult[]>> {
    const traceId = uuidv4();
    try {
      let query = this.client
        .from('job_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(opts.limit ?? 50);

      if (opts.jobName) {
        query = query.eq('job_name', opts.jobName);
      }

      const { data, error } = await query;

      if (error) {
        return failure('STORE_ERROR', error.message, traceId);
      }

      const results: JobResult[] = (data ?? []).map((row) => ({
        jobName: row.job_name,
        jobType: row.job_type,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        durationMs: row.duration_ms,
        status: row.status,
        targets: row.targets,
        results: row.results,
        summary: row.summary,
      }));

      return success(results);
    } catch (err) {
      logger.error('store_list_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to list job runs', traceId);
    }
  }
}

import { describe, it, expect } from 'vitest';
import { JobDefinitionSchema, ScheduleConfigSchema } from './schedule.schema';

describe('schedule schema validation', () => {
  describe('JobDefinitionSchema', () => {
    it('validates a minimal sweep job', () => {
      const result = JobDefinitionSchema.safeParse({
        cron: '0 2 * * *',
        type: 'sweep',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targets).toBe('all');
        expect(result.data.timeout_ms).toBe(120_000);
      }
    });

    it('validates a chain job with depends_on', () => {
      const result = JobDefinitionSchema.safeParse({
        cron: '0 21 * * *',
        type: 'chain',
        depends_on: 'daily-commits',
        agent: 'social-media-writer',
        timeout_ms: 180_000,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.depends_on).toBe('daily-commits');
      }
    });

    it('rejects unknown job type', () => {
      const result = JobDefinitionSchema.safeParse({
        cron: '0 2 * * *',
        type: 'unknown',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing cron', () => {
      const result = JobDefinitionSchema.safeParse({ type: 'sweep' });
      expect(result.success).toBe(false);
    });
  });

  describe('ScheduleConfigSchema', () => {
    it('validates a full schedule config', () => {
      const result = ScheduleConfigSchema.safeParse({
        jobs: {
          'daily-commits': { cron: '59 21 * * *', type: 'aggregate', agent: 'commit-summarizer' },
          'security-scan': { cron: '0 2 * * *', type: 'sweep', targets: 'all' },
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Object.keys(result.data.jobs)).toHaveLength(2);
      }
    });

    it('rejects config without jobs key', () => {
      const result = ScheduleConfigSchema.safeParse({ tasks: {} });
      expect(result.success).toBe(false);
    });
  });
});

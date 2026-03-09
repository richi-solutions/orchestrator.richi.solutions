import { describe, it, expect } from 'vitest';
import { JobResultSchema } from './job-result.schema';

describe('JobResultSchema validation', () => {
  const validResult = {
    jobName: 'daily-commits',
    jobType: 'aggregate',
    startedAt: '2026-03-09T21:59:00.000Z',
    completedAt: '2026-03-09T22:00:00.000Z',
    durationMs: 60000,
    status: 'success' as const,
    targets: ['repo-a', 'repo-b'],
    results: [{ target: 'all', status: 'success' as const, output: 'Summary text' }],
    summary: 'All good',
  };

  it('validates a complete job result', () => {
    const result = JobResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
  });

  it('validates result with _commitMeta', () => {
    const result = JobResultSchema.safeParse({
      ...validResult,
      _commitMeta: { reposActive: ['repo-a'], totalCommits: 15 },
    });
    expect(result.success).toBe(true);
  });

  it('validates result with _socialMeta', () => {
    const result = JobResultSchema.safeParse({
      ...validResult,
      _socialMeta: {
        contents: [{
          contentType: 'text',
          shouldPost: true,
          reason: 'New feature',
          platforms: ['twitter', 'linkedin'],
          components: [{ componentType: 'thread', content: 'Tweet 1', sortOrder: 0 }],
        }],
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = JobResultSchema.safeParse({ ...validResult, status: 'unknown' });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = JobResultSchema.safeParse({ jobName: 'test' });
    expect(result.success).toBe(false);
  });
});

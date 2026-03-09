import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Executor } from './executor';
import { success } from '../lib/result';
import type { JobResult } from '../contracts/v1/job-result.schema';

const mockJobResult: JobResult = {
  jobName: 'test',
  jobType: 'sweep',
  startedAt: '2026-03-09T00:00:00.000Z',
  completedAt: '2026-03-09T00:01:00.000Z',
  durationMs: 60000,
  status: 'success',
  targets: [],
  results: [],
};

const mockSweep = { run: vi.fn().mockResolvedValue(success(mockJobResult)) };
const mockAggregate = { run: vi.fn().mockResolvedValue(success(mockJobResult)) };
const mockChain = { run: vi.fn().mockResolvedValue(success(mockJobResult)) };
const mockProvision = { run: vi.fn().mockResolvedValue(success(mockJobResult)) };

describe('Executor', () => {
  let executor: Executor;

  beforeEach(() => {
    vi.clearAllMocks();
    executor = new Executor(mockSweep as any, mockAggregate as any, mockChain as any, mockProvision as any);
  });

  it('routes sweep jobs to SweepHandler', async () => {
    const def = { cron: '0 0 * * *', type: 'sweep' as const, targets: 'all' as const, timeout_ms: 120_000 };
    await executor.execute('test-sweep', def);
    expect(mockSweep.run).toHaveBeenCalledWith('test-sweep', def);
  });

  it('routes aggregate jobs to AggregateHandler', async () => {
    const def = { cron: '0 0 * * *', type: 'aggregate' as const, targets: 'all' as const, timeout_ms: 120_000 };
    await executor.execute('test-agg', def);
    expect(mockAggregate.run).toHaveBeenCalledWith('test-agg', def);
  });

  it('routes chain jobs to ChainHandler', async () => {
    const def = { cron: '0 0 * * *', type: 'chain' as const, depends_on: 'x', targets: 'all' as const, timeout_ms: 120_000 };
    await executor.execute('test-chain', def);
    expect(mockChain.run).toHaveBeenCalledWith('test-chain', def);
  });

  it('routes provision jobs to ProvisionHandler', async () => {
    const def = { cron: '0 0 * * *', type: 'provision' as const, targets: 'all' as const, timeout_ms: 120_000 };
    await executor.execute('test-prov', def);
    expect(mockProvision.run).toHaveBeenCalledWith('test-prov', def);
  });

  it('returns failure for unknown job type', async () => {
    const def = { cron: '0 0 * * *', type: 'unknown' as any, targets: 'all' as const, timeout_ms: 120_000 };
    const result = await executor.execute('test-unknown', def);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('EXECUTOR_ERROR');
    }
  });
});

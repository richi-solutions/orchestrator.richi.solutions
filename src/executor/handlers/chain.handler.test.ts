import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainHandler } from './chain.handler';
import { success, failure } from '../../lib/result';
import type { StorePort } from '../../store/store.port';
import type { ClaudePort } from '../../claude/claude.port';
import type { JobDefinition } from '../../contracts/v1/schedule.schema';
import type { JobResult } from '../../contracts/v1/job-result.schema';

// Mock fs for agent prompt loading
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(() => 'You are a social media writer.'),
  },
}));

const mockStore: StorePort = {
  saveJobRun: vi.fn(),
  getLatestJobRun: vi.fn(),
  listJobRuns: vi.fn(),
  saveCommitSummary: vi.fn(),
  saveSocialContent: vi.fn(),
};

const mockClaude: ClaudePort = {
  complete: vi.fn(),
};

const chainDef: JobDefinition = {
  cron: '59 22 * * *',
  type: 'chain',
  depends_on: 'daily-commits',
  agent: 'social-media-writer',
  targets: 'all',
  timeout_ms: 120_000,
};

const upstreamResult: JobResult = {
  jobName: 'daily-commits',
  jobType: 'aggregate',
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  durationMs: 5000,
  status: 'success',
  targets: ['repo-a'],
  results: [{ target: 'all', status: 'success', output: 'Commit summary text' }],
};

describe('ChainHandler', () => {
  let handler: ChainHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = new ChainHandler(mockStore, mockClaude, '/fake/agents');
  });

  it('fails when depends_on is missing', async () => {
    const noDeps: JobDefinition = { ...chainDef, depends_on: undefined };
    const result = await handler.run('test-job', noDeps);
    expect(result.ok).toBe(false);
  });

  it('fails when dependency has no result for today (fake timers)', async () => {
    vi.useFakeTimers();

    vi.mocked(mockStore.getLatestJobRun).mockResolvedValue(
      success({
        ...upstreamResult,
        completedAt: '2020-01-01T00:00:00.000Z',
      }),
    );

    const promise = handler.run('test-job', chainDef);

    // Advance past the 30-minute deadline
    for (let i = 0; i < 32; i++) {
      await vi.advanceTimersByTimeAsync(60_000);
    }

    const result = await promise;
    expect(result.ok).toBe(false);

    vi.useRealTimers();
  });

  it('processes upstream output and returns success with social meta', async () => {
    const today = new Date().toISOString().split('T')[0];
    vi.mocked(mockStore.getLatestJobRun).mockResolvedValue(
      success({ ...upstreamResult, completedAt: `${today}T22:00:00.000Z` }),
    );

    const socialJson = JSON.stringify({
      contents: [{
        content_type: 'text',
        should_post: true,
        reason: 'New feature',
        platforms: ['twitter'],
        components: [
          { component_type: 'thread', content: 'Tweet 1', sort_order: 0 },
        ],
      }],
    });

    vi.mocked(mockClaude.complete).mockResolvedValue(
      success({ content: socialJson, model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 200 }),
    );

    const result = await handler.run('commits-to-social', chainDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('success');
      expect(result.data._socialMeta).toBeDefined();
      expect(result.data._socialMeta?.contents).toHaveLength(1);
      expect(result.data._socialMeta?.contents[0].contentType).toBe('text');
      expect(result.data._socialMeta?.contents[0].shouldPost).toBe(true);
    }
  });

  it('returns success without social meta when Claude output is not JSON', async () => {
    const today = new Date().toISOString().split('T')[0];
    vi.mocked(mockStore.getLatestJobRun).mockResolvedValue(
      success({ ...upstreamResult, completedAt: `${today}T22:00:00.000Z` }),
    );

    vi.mocked(mockClaude.complete).mockResolvedValue(
      success({ content: 'Just plain text, not JSON', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50 }),
    );

    const result = await handler.run('commits-to-social', chainDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('success');
      expect(result.data._socialMeta).toBeUndefined();
    }
  });

  it('handles Claude failure gracefully', async () => {
    const today = new Date().toISOString().split('T')[0];
    vi.mocked(mockStore.getLatestJobRun).mockResolvedValue(
      success({ ...upstreamResult, completedAt: `${today}T22:00:00.000Z` }),
    );

    vi.mocked(mockClaude.complete).mockResolvedValue(
      failure('CLAUDE_ERROR', 'Rate limited', 'trace-1'),
    );

    const result = await handler.run('commits-to-social', chainDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('failure');
      expect(result.data.results[0].error).toBe('Rate limited');
    }
  });
});

describe('parseSocialOutput (via handler)', () => {
  let handler: ChainHandler;

  beforeEach(() => {
    handler = new ChainHandler(mockStore, mockClaude, '/fake/agents');
  });

  // Access private method via any cast for testing
  const parse = (raw: string) => (handler as any).parseSocialOutput(raw);

  it('parses valid JSON', () => {
    const input = JSON.stringify({
      contents: [{
        content_type: 'image_post',
        should_post: true,
        reason: 'Launch day',
        platforms: ['linkedin', 'instagram'],
        components: [
          { component_type: 'caption', content: 'We launched!', sort_order: 0 },
          { component_type: 'hashtags', content: '#launch', sort_order: 1 },
        ],
      }],
    });

    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].contentType).toBe('image_post');
    expect(result.contents[0].components).toHaveLength(2);
  });

  it('strips markdown code fences', () => {
    const input = '```json\n{"contents":[{"content_type":"text","should_post":false,"reason":"Only chores","platforms":[],"components":[]}]}\n```';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.contents[0].shouldPost).toBe(false);
  });

  it('returns null for invalid JSON', () => {
    expect(parse('not json at all')).toBeNull();
  });

  it('returns null when contents array is missing', () => {
    expect(parse('{"data": "something"}')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parse('')).toBeNull();
  });
});

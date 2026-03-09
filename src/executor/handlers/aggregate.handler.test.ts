import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AggregateHandler } from './aggregate.handler';
import { success, failure } from '../../lib/result';
import type { DiscoveryPort } from '../../discovery/discovery.port';
import type { GitHubPort } from '../../github/github.port';
import type { ClaudePort } from '../../claude/claude.port';
import type { StorePort } from '../../store/store.port';
import type { JobDefinition } from '../../contracts/v1/schedule.schema';

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(() => 'You are a commit summarizer.'),
  },
}));

const mockDiscovery: DiscoveryPort = {
  discoverRepos: vi.fn(),
  getRepoConfig: vi.fn(),
};

const mockGithub: GitHubPort = {
  listOrgRepos: vi.fn(),
  fileExists: vi.fn(),
  readFile: vi.fn(),
  listCommitsSince: vi.fn(),
};

const mockClaude: ClaudePort = {
  complete: vi.fn(),
};

const mockStore: StorePort = {
  saveJobRun: vi.fn(),
  getLatestJobRun: vi.fn(),
  listJobRuns: vi.fn(),
  saveCommitSummary: vi.fn(),
  saveSocialContent: vi.fn(),
};

const jobDef: JobDefinition = {
  cron: '59 21 * * *',
  type: 'aggregate',
  agent: 'commit-summarizer',
  targets: 'all',
  timeout_ms: 120_000,
};

describe('AggregateHandler', () => {
  let handler: AggregateHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = new AggregateHandler(mockDiscovery, mockGithub, mockClaude, mockStore, 'richi-solutions', '/fake/agents');
  });

  it('returns success with empty commits when no commits found', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      success([{ name: 'repo-a', fullName: 'richi-solutions/repo-a', defaultBranch: 'main', hasProjectYaml: false }]),
    );
    vi.mocked(mockGithub.listCommitsSince).mockResolvedValue(success([]));

    const result = await handler.run('daily-commits', jobDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('success');
      expect(result.data._commitMeta?.totalCommits).toBe(0);
      expect(result.data._commitMeta?.reposActive).toEqual([]);
    }
  });

  it('collects commits and generates summary', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      success([
        { name: 'repo-a', fullName: 'richi-solutions/repo-a', defaultBranch: 'main', hasProjectYaml: false },
        { name: 'repo-b', fullName: 'richi-solutions/repo-b', defaultBranch: 'main', hasProjectYaml: false },
      ]),
    );
    vi.mocked(mockGithub.listCommitsSince)
      .mockResolvedValueOnce(success([
        { sha: 'abc123', message: 'feat: add login', author: 'dev', date: '2026-03-09T20:00:00Z', repo: 'repo-a' },
      ]))
      .mockResolvedValueOnce(success([
        { sha: 'def456', message: 'fix: button style', author: 'dev', date: '2026-03-09T19:00:00Z', repo: 'repo-b' },
      ]));

    vi.mocked(mockClaude.complete).mockResolvedValue(
      success({ content: 'Daily summary: 2 commits across 2 repos.', model: 'claude-sonnet-4-6', inputTokens: 200, outputTokens: 100 }),
    );

    const result = await handler.run('daily-commits', jobDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('success');
      expect(result.data._commitMeta?.totalCommits).toBe(2);
      expect(result.data._commitMeta?.reposActive).toEqual(['repo-a', 'repo-b']);
    }
  });

  it('returns partial when Claude fails but commits were collected', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      success([{ name: 'repo-a', fullName: 'richi-solutions/repo-a', defaultBranch: 'main', hasProjectYaml: false }]),
    );
    vi.mocked(mockGithub.listCommitsSince).mockResolvedValue(
      success([{ sha: 'abc', message: 'feat: x', author: 'dev', date: '2026-03-09T20:00:00Z', repo: 'repo-a' }]),
    );
    vi.mocked(mockClaude.complete).mockResolvedValue(
      failure('CLAUDE_ERROR', 'Rate limit', 'trace-1'),
    );

    const result = await handler.run('daily-commits', jobDef);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('partial');
      expect(result.data._commitMeta?.totalCommits).toBe(1);
    }
  });

  it('propagates discovery failure', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      failure('DISCOVERY_ERROR', 'GitHub down', 'trace-1'),
    );

    const result = await handler.run('daily-commits', jobDef);
    expect(result.ok).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SweepHandler } from './sweep.handler';
import { success, failure } from '../../lib/result';
import type { DiscoveryPort } from '../../discovery/discovery.port';
import type { ClaudePort } from '../../claude/claude.port';

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(() => 'You are a security reviewer.'),
  },
}));

const mockDiscovery: DiscoveryPort = {
  discoverRepos: vi.fn(),
  getRepoConfig: vi.fn(),
};

const mockClaude: ClaudePort = {
  complete: vi.fn(),
};

describe('SweepHandler', () => {
  let handler: SweepHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = new SweepHandler(mockDiscovery, mockClaude, '/fake/agents');
  });

  it('sweeps all repos with success', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      success([
        { name: 'repo-a', fullName: 'org/repo-a', defaultBranch: 'main', hasProjectYaml: true },
        { name: 'repo-b', fullName: 'org/repo-b', defaultBranch: 'main', hasProjectYaml: false },
      ]),
    );
    vi.mocked(mockClaude.complete).mockResolvedValue(
      success({ content: 'No issues found.', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50 }),
    );

    const result = await handler.run('security-scan', {
      cron: '0 2 * * *', type: 'sweep', targets: 'all', timeout_ms: 120_000,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('success');
      expect(result.data.results).toHaveLength(2);
    }
  });

  it('returns partial when some repos fail', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      success([
        { name: 'repo-a', fullName: 'org/repo-a', defaultBranch: 'main', hasProjectYaml: false },
        { name: 'repo-b', fullName: 'org/repo-b', defaultBranch: 'main', hasProjectYaml: false },
      ]),
    );
    vi.mocked(mockClaude.complete)
      .mockResolvedValueOnce(success({ content: 'OK', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50 }))
      .mockResolvedValueOnce(failure('CLAUDE_ERROR', 'Timeout', 'trace-1'));

    const result = await handler.run('security-scan', {
      cron: '0 2 * * *', type: 'sweep', targets: 'all', timeout_ms: 120_000,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('partial');
      expect(result.data.results.filter((r) => r.status === 'success')).toHaveLength(1);
      expect(result.data.results.filter((r) => r.status === 'failure')).toHaveLength(1);
    }
  });

  it('propagates discovery failure', async () => {
    vi.mocked(mockDiscovery.discoverRepos).mockResolvedValue(
      failure('DISCOVERY_ERROR', 'Token expired', 'trace-1'),
    );

    const result = await handler.run('security-scan', {
      cron: '0 2 * * *', type: 'sweep', targets: 'all', timeout_ms: 120_000,
    });
    expect(result.ok).toBe(false);
  });
});

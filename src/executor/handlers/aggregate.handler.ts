import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JobDefinition } from '../../contracts/v1/schedule.schema';
import { JobResult } from '../../contracts/v1/job-result.schema';
import { DiscoveryPort } from '../../discovery/discovery.port';
import { GitHubPort, CommitInfo } from '../../github/github.port';
import { ClaudePort } from '../../claude/claude.port';
import { StorePort } from '../../store/store.port';
import { Result, success, failure } from '../../lib/result';
import { logger } from '../../lib/logger';

export class AggregateHandler {
  constructor(
    private discovery: DiscoveryPort,
    private github: GitHubPort,
    private claude: ClaudePort,
    private store: StorePort,
    private org: string,
    private agentsDir: string,
  ) {}

  async run(jobName: string, jobDef: JobDefinition): Promise<Result<JobResult>> {
    const traceId = uuidv4();
    const startedAt = new Date().toISOString();

    // Discover repos
    const reposResult = await this.discovery.discoverRepos();
    if (!reposResult.ok) return reposResult;

    // Collect commits from last 24h across all repos
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const allCommits: CommitInfo[] = [];

    for (const repo of reposResult.data) {
      const commitsResult = await this.github.listCommitsSince(this.org, repo.name, since);
      if (commitsResult.ok) {
        allCommits.push(...commitsResult.data);
      }
    }

    logger.info('aggregate_commits_collected', { traceId, jobName, commitCount: allCommits.length, repoCount: reposResult.data.length });

    if (allCommits.length === 0) {
      const completedAt = new Date().toISOString();
      return success({
        jobName,
        jobType: 'aggregate',
        startedAt,
        completedAt,
        durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
        status: 'success',
        targets: reposResult.data.map((r) => r.name),
        results: [{ target: 'all', status: 'success', output: 'No commits in the last 24h.' }],
        summary: 'No commits in the last 24 hours.',
        _commitMeta: { reposActive: [], totalCommits: 0 },
      });
    }

    // Format commits for Claude
    const commitsByRepo = new Map<string, CommitInfo[]>();
    for (const c of allCommits) {
      const existing = commitsByRepo.get(c.repo) ?? [];
      existing.push(c);
      commitsByRepo.set(c.repo, existing);
    }

    const reposActive = [...commitsByRepo.keys()];

    let commitText = '';
    for (const [repo, commits] of commitsByRepo) {
      commitText += `\n## ${repo}\n`;
      for (const c of commits) {
        commitText += `- ${c.sha} ${c.message} (${c.author}, ${c.date})\n`;
      }
    }

    // Load agent prompt and summarize
    const agentName = jobDef.agent ?? jobName;
    const promptPath = path.resolve(this.agentsDir, `${agentName}.md`);
    let systemPrompt: string;
    try {
      systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch {
      return failure('EXECUTOR_ERROR', `Agent prompt not found: ${promptPath}`, traceId);
    }

    const claudeResult = await this.claude.complete({
      systemPrompt,
      userMessage: `Here are all commits from the last 24 hours across the richi-solutions organization:\n${commitText}`,
      maxTokens: 4096,
    });

    const completedAt = new Date().toISOString();

    if (!claudeResult.ok) {
      return success({
        jobName,
        jobType: 'aggregate',
        startedAt,
        completedAt,
        durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
        status: 'partial',
        targets: reposResult.data.map((r) => r.name),
        results: [{ target: 'all', status: 'failure', error: claudeResult.error.message }],
        summary: `Collected ${allCommits.length} commits but summary generation failed.`,
        _commitMeta: { reposActive: reposActive, totalCommits: allCommits.length },
      });
    }

    return success({
      jobName,
      jobType: 'aggregate',
      startedAt,
      completedAt,
      durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
      status: 'success',
      targets: reposResult.data.map((r) => r.name),
      results: [{ target: 'all', status: 'success', output: claudeResult.data.content }],
      summary: claudeResult.data.content.substring(0, 500),
      _commitMeta: { reposActive: reposActive, totalCommits: allCommits.length },
    });
  }
}

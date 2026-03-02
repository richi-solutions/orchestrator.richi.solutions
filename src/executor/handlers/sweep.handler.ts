import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JobDefinition } from '../../contracts/v1/schedule.schema';
import { JobResult, TargetResult } from '../../contracts/v1/job-result.schema';
import { DiscoveryPort } from '../../discovery/discovery.port';
import { ClaudePort } from '../../claude/claude.port';
import { Result, success, failure } from '../../lib/result';
import { logger } from '../../lib/logger';

const MAX_CONCURRENCY = 3;

export class SweepHandler {
  constructor(
    private discovery: DiscoveryPort,
    private claude: ClaudePort,
    private agentsDir: string,
  ) {}

  async run(jobName: string, jobDef: JobDefinition): Promise<Result<JobResult>> {
    const traceId = uuidv4();
    const startedAt = new Date().toISOString();

    // Discover repos
    const reposResult = await this.discovery.discoverRepos();
    if (!reposResult.ok) return reposResult;

    const repos = reposResult.data;
    logger.info('sweep_start', { traceId, jobName, repoCount: repos.length });

    // Load agent prompt
    const agentName = jobDef.agent ?? jobName;
    const promptPath = path.resolve(this.agentsDir, `${agentName}.md`);
    let systemPrompt: string;
    try {
      systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch {
      return failure('EXECUTOR_ERROR', `Agent prompt not found: ${promptPath}`, traceId);
    }

    // Execute against repos with concurrency limit
    const results: TargetResult[] = [];
    const queue = [...repos];

    const processRepo = async (): Promise<void> => {
      while (queue.length > 0) {
        const repo = queue.shift();
        if (!repo) break;

        logger.info('sweep_repo_start', { traceId, jobName, repo: repo.name });

        const claudeResult = await this.claude.complete({
          systemPrompt,
          userMessage: `Analyze the repository: ${repo.fullName} (branch: ${repo.defaultBranch}). Project config: ${JSON.stringify(repo.projectConfig ?? {})}`,
          maxTokens: 4096,
        });

        if (claudeResult.ok) {
          results.push({
            target: repo.name,
            status: 'success',
            output: claudeResult.data.content,
          });
          logger.info('sweep_repo_done', { traceId, repo: repo.name, tokens: claudeResult.data.outputTokens });
        } else {
          results.push({
            target: repo.name,
            status: 'failure',
            error: claudeResult.error.message,
          });
          logger.error('sweep_repo_failed', new Error(claudeResult.error.message), { traceId, repo: repo.name });
        }
      }
    };

    // Run with concurrency limit
    const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, repos.length) }, () => processRepo());
    await Promise.all(workers);

    const completedAt = new Date().toISOString();
    const successCount = results.filter((r) => r.status === 'success').length;
    const overallStatus = successCount === results.length ? 'success' : successCount > 0 ? 'partial' : 'failure';

    const jobResult: JobResult = {
      jobName,
      jobType: 'sweep',
      startedAt,
      completedAt,
      durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
      status: overallStatus,
      targets: repos.map((r) => r.name),
      results,
      summary: `${successCount}/${results.length} repos processed successfully`,
    };

    logger.info('sweep_complete', { traceId, jobName, status: overallStatus, successCount, total: results.length });
    return success(jobResult);
  }
}

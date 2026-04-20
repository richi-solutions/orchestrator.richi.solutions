/**
 * @fileoverview Supabase adapter for the StorePort interface.
 *
 * Persists job runs, commit summaries, and social content to Supabase
 * using the service role key (bypasses RLS). All tables have RLS enabled
 * with a service_full_access policy.
 *
 * @module store/supabase-store.adapter
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { StorePort, CommitSummaryInput, SocialContentInput, ProjectProfileInput, ProjectProfile, RepoAssetUrls, LogoUploadResult } from './store.port';
import { JobResult } from '../contracts/v1/job-result.schema';
import { Result, success, failure } from '../lib/result';
import { logger } from '../lib/logger';

/** Bucket used to host per-repo logos and preview screenshots. Must be public. */
const ASSETS_BUCKET = 'project-assets';

/** Supabase implementation of StorePort using the service role key. */
export class SupabaseStoreAdapter implements StorePort {
  private client: SupabaseClient;
  private url: string;

  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey);
    this.url = url;
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

  async saveCommitSummary(input: CommitSummaryInput): Promise<Result<{ id: string }>> {
    const traceId = uuidv4();
    try {
      const { data, error } = await this.client
        .from('commit_summaries')
        .insert({
          job_run_id: input.jobRunId,
          summary_date: input.summaryDate,
          content: input.content,
          repos_active: input.reposActive,
          total_commits: input.totalCommits,
        })
        .select('id')
        .single();

      if (error) {
        logger.error('store_commit_summary_failed', error, { traceId });
        return failure('STORE_ERROR', error.message, traceId);
      }

      logger.info('store_commit_summary_saved', { traceId, id: data.id });
      return success({ id: data.id });
    } catch (err) {
      logger.error('store_commit_summary_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to save commit summary', traceId);
    }
  }

  async saveSocialContent(input: SocialContentInput): Promise<Result<{ id: string }>> {
    const traceId = uuidv4();
    try {
      // 1. Insert social_content row
      const { data: content, error: contentErr } = await this.client
        .from('social_content')
        .insert({
          job_run_id: input.jobRunId,
          post_date: input.postDate,
          content_type: input.contentType,
          should_post: input.shouldPost,
          reason: input.reason,
          status: input.shouldPost ? 'draft' : 'skipped',
        })
        .select('id')
        .single();

      if (contentErr) {
        logger.error('store_social_content_failed', contentErr, { traceId });
        return failure('STORE_ERROR', contentErr.message, traceId);
      }

      const contentId = content.id;

      // 2. Insert components
      if (input.components.length > 0) {
        const { error: compErr } = await this.client
          .from('social_content_components')
          .insert(
            input.components.map((c) => ({
              social_content_id: contentId,
              component_type: c.componentType,
              content: c.content,
              sort_order: c.sortOrder,
            })),
          );

        if (compErr) {
          logger.error('store_social_components_failed', compErr, { traceId, contentId });
        }
      }

      // 3. Insert platform mappings
      if (input.platforms.length > 0) {
        const { error: platErr } = await this.client
          .from('social_content_platforms')
          .insert(
            input.platforms.map((p) => ({
              social_content_id: contentId,
              platform: p,
              platform_status: 'pending',
            })),
          );

        if (platErr) {
          logger.error('store_social_platforms_failed', platErr, { traceId, contentId });
        }
      }

      logger.info('store_social_content_saved', { traceId, id: contentId, contentType: input.contentType });
      return success({ id: contentId });
    } catch (err) {
      logger.error('store_social_content_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to save social content', traceId);
    }
  }

  async upsertProjectProfile(input: ProjectProfileInput): Promise<Result<{ id: string }>> {
    const traceId = uuidv4();
    try {
      const now = new Date().toISOString();

      // Source-of-truth fields: always written, even as null (reflect current GitHub state).
      const row: Record<string, unknown> = {
        repo_name: input.repoName,
        readme_content: input.readmeContent,
        marketing_md: input.marketingMd,
        is_public: input.isPublic,
        last_synced_at: now,
        updated_at: now,
      };

      // Enrichment fields: only write when we have a value, so curated DB values
      // (e.g. project_url set by the display-classification migration) are
      // preserved across syncs. Empty tech_stack arrays are treated as "no data".
      if (input.tagline !== null) row.tagline = input.tagline;
      if (input.description !== null) row.description = input.description;
      if (input.techStack.length > 0) row.tech_stack = input.techStack;
      if (input.demoVideoUrl !== null) row.demo_video_url = input.demoVideoUrl;
      if (input.logoUrl !== null) row.logo_url = input.logoUrl;
      if (input.logoSha !== null) row.logo_sha = input.logoSha;
      if (input.previewImageUrl !== null) row.preview_image_url = input.previewImageUrl;
      if (input.projectUrl !== null) row.project_url = input.projectUrl;

      const { data, error } = await this.client
        .from('project_profiles')
        .upsert(row, { onConflict: 'repo_name' })
        .select('id')
        .single();

      if (error) {
        logger.error('store_profile_upsert_failed', error, { traceId, repoName: input.repoName });
        return failure('STORE_ERROR', error.message, traceId);
      }

      logger.info('store_profile_upserted', { traceId, id: data.id, repoName: input.repoName });
      return success({ id: data.id });
    } catch (err) {
      logger.error('store_profile_upsert_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to upsert project profile', traceId);
    }
  }

  async listProjectProfiles(): Promise<Result<ProjectProfile[]>> {
    const traceId = uuidv4();
    try {
      const { data, error } = await this.client
        .from('project_profiles')
        .select('*')
        .order('repo_name', { ascending: true });

      if (error) {
        return failure('STORE_ERROR', error.message, traceId);
      }

      const profiles: ProjectProfile[] = (data ?? []).map((row) => ({
        id: row.id,
        repoName: row.repo_name,
        readmeContent: row.readme_content,
        marketingMd: row.marketing_md,
        tagline: row.tagline,
        description: row.description,
        techStack: row.tech_stack ?? [],
        demoVideoUrl: row.demo_video_url,
        logoUrl: row.logo_url,
        logoSha: row.logo_sha ?? null,
        previewImageUrl: row.preview_image_url,
        projectUrl: row.project_url,
        isPublic: row.is_public ?? true,
        lastSyncedAt: row.last_synced_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return success(profiles);
    } catch (err) {
      logger.error('store_profiles_list_error', err, { traceId });
      return failure('STORE_ERROR', 'Failed to list project profiles', traceId);
    }
  }

  async findRepoAssetUrls(repoName: string): Promise<Result<RepoAssetUrls>> {
    const traceId = uuidv4();
    try {
      const { data, error } = await this.client.storage
        .from(ASSETS_BUCKET)
        .list(repoName, { limit: 100 });

      if (error) {
        logger.error('store_assets_list_failed', error, { traceId, repoName });
        return failure('STORE_ERROR', error.message, traceId);
      }

      const files = (data ?? []).map((f) => f.name);
      const logoFile = files.find((n) => /^logo\.(png|webp|jpe?g|svg)$/i.test(n));
      const previewFile = files.find((n) => /^preview\.(png|webp|jpe?g)$/i.test(n));

      return success({
        logoUrl: logoFile ? this.publicAssetUrl(repoName, logoFile) : null,
        previewImageUrl: previewFile ? this.publicAssetUrl(repoName, previewFile) : null,
      });
    } catch (err) {
      logger.error('store_assets_list_error', err, { traceId, repoName });
      return failure('STORE_ERROR', 'Failed to list repo assets', traceId);
    }
  }

  async uploadLogo(
    repoName: string,
    bytes: Buffer,
    ext: string,
    contentType: string,
  ): Promise<Result<LogoUploadResult>> {
    const traceId = uuidv4();
    const fileName = `logo.${ext.toLowerCase()}`;
    const path = `${repoName}/${fileName}`;
    try {
      // Remove stale logo files with different extensions so the bucket only
      // ever holds the current variant for this repo (prevents findRepoAssetUrls
      // from returning a cached older format).
      const { data: existing, error: listErr } = await this.client.storage
        .from(ASSETS_BUCKET)
        .list(repoName, { limit: 100 });
      if (!listErr && existing) {
        const stale = existing
          .map((f) => f.name)
          .filter((n) => /^logo\.(png|webp|jpe?g|svg|ico)$/i.test(n) && n !== fileName)
          .map((n) => `${repoName}/${n}`);
        if (stale.length > 0) {
          await this.client.storage.from(ASSETS_BUCKET).remove(stale);
        }
      }

      const { error } = await this.client.storage
        .from(ASSETS_BUCKET)
        .upload(path, bytes, { contentType, upsert: true });

      if (error) {
        logger.error('store_logo_upload_failed', error, { traceId, repoName });
        return failure('STORE_ERROR', error.message, traceId);
      }

      logger.info('store_logo_uploaded', { traceId, repoName, path });
      return success({ publicUrl: this.publicAssetUrl(repoName, fileName) });
    } catch (err) {
      logger.error('store_logo_upload_error', err, { traceId, repoName });
      return failure('STORE_ERROR', 'Failed to upload logo', traceId);
    }
  }

  /** Builds a public object URL for a file inside the project-assets bucket. */
  private publicAssetUrl(repoName: string, fileName: string): string {
    return `${this.url}/storage/v1/object/public/${ASSETS_BUCKET}/${repoName}/${fileName}`;
  }
}

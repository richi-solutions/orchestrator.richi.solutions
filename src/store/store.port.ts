/**
 * @fileoverview Port interface for persistent storage of job results.
 *
 * Defines the contract for persisting job runs, commit summaries,
 * and social content. The production adapter uses Supabase.
 *
 * @module store/store.port
 */

import { Result } from '../lib/result';
import { JobResult } from '../contracts/v1/job-result.schema';

/** Input for upserting a project profile (README + MARKETING.md + metadata from project.yaml + bucket assets). */
export interface ProjectProfileInput {
  repoName: string;
  readmeContent: string | null;
  marketingMd: string | null;
  tagline: string | null;
  description: string | null;
  techStack: string[];
  demoVideoUrl: string | null;
  logoUrl: string | null;
  logoSha: string | null;
  previewImageUrl: string | null;
  projectUrl: string | null;
  isPublic: boolean;
}

/** Result of uploading a logo asset to the project-assets bucket. */
export interface LogoUploadResult {
  publicUrl: string;
}

/** Asset URLs derived from the project-assets storage bucket. */
export interface RepoAssetUrls {
  logoUrl: string | null;
  previewImageUrl: string | null;
}

/** Stored project profile as returned from the database. */
export interface ProjectProfile extends ProjectProfileInput {
  id: string;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

/** Input for persisting a daily commit summary. */
export interface CommitSummaryInput {
  jobRunId: string;
  summaryDate: string;
  content: string;
  reposActive: string[];
  totalCommits: number;
}

/** A single component of a social media content piece. */
export interface SocialContentComponent {
  componentType: 'caption' | 'hook' | 'cta' | 'thread' | 'video_script' | 'image_prompt' | 'hashtags';
  content: string;
  sortOrder: number;
}

/** Input for persisting a social media content piece with components and platform mappings. */
export interface SocialContentInput {
  jobRunId: string;
  postDate: string;
  contentType: 'image_post' | 'carousel' | 'text' | 'short';
  shouldPost: boolean;
  reason: string;
  components: SocialContentComponent[];
  platforms: string[];
}

/**
 * Port interface for persistent job result storage.
 *
 * Implementations persist job runs, commit summaries, and social content
 * to a database. All methods return Result envelopes, never throw.
 */
export interface StorePort {
  /** Persists a completed job run to the `job_runs` table. */
  saveJobRun(result: JobResult): Promise<Result<{ id: string }>>;

  /** Retrieves the most recent job run by name, or null if none exists. */
  getLatestJobRun(jobName: string): Promise<Result<JobResult | null>>;

  /** Lists job runs, optionally filtered by name, ordered by most recent first. */
  listJobRuns(opts: { jobName?: string; limit?: number }): Promise<Result<JobResult[]>>;

  /** Persists a daily commit summary linked to a job run. */
  saveCommitSummary(input: CommitSummaryInput): Promise<Result<{ id: string }>>;

  /** Persists social content with its components and platform mappings. */
  saveSocialContent(input: SocialContentInput): Promise<Result<{ id: string }>>;

  /** Upserts a project profile (insert or update on repo_name conflict). */
  upsertProjectProfile(input: ProjectProfileInput): Promise<Result<{ id: string }>>;

  /** Lists all project profiles, ordered by repo name. */
  listProjectProfiles(): Promise<Result<ProjectProfile[]>>;

  /**
   * Looks up logo and preview asset public URLs for a repo from the
   * `project-assets` storage bucket. Returns null per field when missing.
   * Files are expected under the path `<repoName>/{logo,preview}.{png,webp,jpg,jpeg}`.
   */
  findRepoAssetUrls(repoName: string): Promise<Result<RepoAssetUrls>>;

  /**
   * Uploads a logo image to `project-assets/<repoName>/logo.<ext>` (overwrites
   * any existing object at that path) and returns its public URL.
   */
  uploadLogo(
    repoName: string,
    bytes: Buffer,
    ext: string,
    contentType: string,
  ): Promise<Result<LogoUploadResult>>;
}

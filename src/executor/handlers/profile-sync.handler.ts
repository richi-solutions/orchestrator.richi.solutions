/**
 * @fileoverview Profile sync handler — syncs README content and project metadata to Supabase.
 *
 * Discovers all repos, reads their README.md and project.yaml metadata,
 * then upserts a project_profiles row per repo. No Claude agent needed —
 * pure data synchronisation via GitHub API and Supabase.
 *
 * @module executor/handlers/profile-sync.handler
 */

import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { JobDefinition } from '../../contracts/v1/schedule.schema';
import { JobResult, TargetResult } from '../../contracts/v1/job-result.schema';
import { DiscoveryPort } from '../../discovery/discovery.port';
import { GitHubPort } from '../../github/github.port';
import { StorePort } from '../../store/store.port';
import { Result, success } from '../../lib/result';
import { logger } from '../../lib/logger';

/** Logo file extensions we recognise from index.html icon hrefs. */
const LOGO_EXT_TO_MIME: Record<string, string> = {
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  ico: 'image/x-icon',
};

/**
 * Fallback logo used when a repo has no synced logo, no curated bucket asset,
 * and no project.yaml override. Resolves to the richi.richi.solutions logo
 * already maintained in the project-assets bucket — keeps every project_profile
 * row with a renderable logo URL.
 */
const FALLBACK_LOGO_REPO = 'richi.richi.solutions';
const FALLBACK_LOGO_FILE = 'logo.png';

/** Syncs README content and project.yaml metadata to project_profiles table. */
export class ProfileSyncHandler {
  constructor(
    private discovery: DiscoveryPort,
    private github: GitHubPort,
    private store: StorePort,
    private org: string,
  ) {}

  async run(jobName: string, _jobDef: JobDefinition): Promise<Result<JobResult>> {
    const traceId = uuidv4();
    const startedAt = new Date().toISOString();

    const reposResult = await this.discovery.discoverRepos();
    if (!reposResult.ok) return reposResult;

    // Sync every discovered repo (including *.app.richi.solutions). Visibility on
    // the homepage is controlled by the curated `displayed` column, not by the
    // sync filter — so mobile variants land in the DB but stay hidden until
    // explicitly enabled.
    const repos = reposResult.data;
    const results: TargetResult[] = [];

    logger.info('profile_sync_start', { traceId, jobName, repoCount: repos.length });

    // Build a quick lookup of currently-stored logo SHAs so we can skip uploads
    // when the repo's icon bytes are unchanged.
    const existingProfiles = await this.store.listProjectProfiles();
    const knownLogoSha = new Map<string, string | null>();
    if (existingProfiles.ok) {
      for (const p of existingProfiles.data) knownLogoSha.set(p.repoName, p.logoSha);
    }

    const fallbackLogoUrl = this.buildPublicAssetUrl(FALLBACK_LOGO_REPO, FALLBACK_LOGO_FILE);

    // Phase 1: per-repo data collection. Resolves the logo from index.html and
    // looks up the bucket assets, but defers upsert so phase 2 can apply the
    // web-counterpart fallback for *.app.richi.solutions repos using the
    // already-resolved web logo URLs of the same run.
    interface RepoSync {
      readmeContent: string | null;
      marketingMd: string | null;
      config: Record<string, unknown>;
      ownLogoUrl: string | null; // project.yaml > sync > existing bucket
      logoSha: string | null;
      previewUrl: string | null;
    }
    const synced = new Map<string, RepoSync>();

    for (const repo of repos) {
      const readmeResult = await this.github.readFile(this.org, repo.name, 'README.md');
      const readmeContent = readmeResult.ok ? readmeResult.data : null;

      const marketingResult = await this.github.readFile(this.org, repo.name, 'MARKETING.md');
      const marketingMd = marketingResult.ok ? marketingResult.data : null;

      const config = repo.projectConfig ?? {};

      const logoSync = await this.syncRepoLogo(repo.name, knownLogoSha.get(repo.name) ?? null);

      const assetsResult = await this.store.findRepoAssetUrls(repo.name);
      const bucketLogoUrl = assetsResult.ok ? assetsResult.data.logoUrl : null;
      const bucketPreviewUrl = assetsResult.ok ? assetsResult.data.previewImageUrl : null;

      const ownLogoUrl =
        asString(config['logo_url']) ?? logoSync.url ?? bucketLogoUrl;

      synced.set(repo.name, {
        readmeContent,
        marketingMd,
        config,
        ownLogoUrl,
        logoSha: logoSync.sha,
        previewUrl: bucketPreviewUrl,
      });
    }

    // Phase 2: apply fallback chain and upsert.
    // Logo precedence: own resolved URL > web-counterpart (for *.app.* repos) >
    // richi.richi.solutions fallback. The richi repo never falls back to itself
    // to avoid a self-reference when its upload fails.
    for (const repo of repos) {
      const data = synced.get(repo.name)!;
      const isRichiRepo = repo.name === FALLBACK_LOGO_REPO;

      let counterpartLogoUrl: string | null = null;
      const webCounterpart = webCounterpartName(repo.name);
      if (webCounterpart) {
        counterpartLogoUrl = synced.get(webCounterpart)?.ownLogoUrl ?? null;
      }

      const resolvedLogoUrl =
        data.ownLogoUrl ??
        counterpartLogoUrl ??
        (isRichiRepo ? null : fallbackLogoUrl);

      const upsertResult = await this.store.upsertProjectProfile({
        repoName: repo.name,
        readmeContent: data.readmeContent,
        marketingMd: data.marketingMd,
        tagline: asString(data.config['tagline']),
        description: asString(data.config['description']),
        techStack: asStringArray(data.config['tech_stack']),
        demoVideoUrl: asString(data.config['demo_video_url']),
        logoUrl: resolvedLogoUrl,
        logoSha: data.logoSha,
        previewImageUrl: data.previewUrl,
        projectUrl: asString(data.config['project_url']),
        isPublic: data.config['public'] !== false,
      });

      if (upsertResult.ok) {
        results.push({
          target: repo.name,
          status: 'success',
          output: `Profile synced (id: ${upsertResult.data.id})`,
        });
      } else {
        results.push({
          target: repo.name,
          status: 'failure',
          error: upsertResult.error.message,
        });
        logger.error('profile_sync_repo_failed', new Error(upsertResult.error.message), {
          traceId,
          repo: repo.name,
        });
      }
    }

    const completedAt = new Date().toISOString();
    const successCount = results.filter((r) => r.status === 'success').length;
    const overallStatus = successCount === results.length ? 'success' : successCount > 0 ? 'partial' : 'failure';

    return success({
      jobName,
      jobType: 'sync',
      startedAt,
      completedAt,
      durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
      status: overallStatus,
      targets: repos.map((r) => r.name),
      results,
      summary: `${successCount}/${results.length} project profiles synced`,
    });
  }

  /**
   * Resolves the repo's icon, downloads the bytes, and uploads them to
   * project-assets when the SHA differs from the stored one.
   *
   * Source precedence:
   *   1. `.claude/logo.{png,svg,webp,jpg,jpeg}` — explicit repo override for
   *      cases where the real logo lives outside `/public` (e.g. bundled Vite
   *      assets under `src/assets/`).
   *   2. `<link rel="apple-touch-icon|icon">` resolved from `index.html`.
   *
   * Returns null url + null sha when neither source resolves — the caller
   * leaves the existing logo_url untouched in that case.
   */
  private async syncRepoLogo(
    repoName: string,
    knownSha: string | null,
  ): Promise<{ url: string | null; sha: string | null }> {
    // 1. Try the explicit .claude/logo.* override first.
    const override = await this.findClaudeLogoOverride(repoName);
    if (override) {
      return this.processLogoBytes(repoName, override.ext, override.contentType, override.bytes, knownSha);
    }

    // 2. Fall back to index.html icon parsing.
    const indexResult = await this.github.readFile(this.org, repoName, 'index.html');
    if (!indexResult.ok) return { url: null, sha: null };

    const iconPath = extractIconPath(indexResult.data);
    if (!iconPath) return { url: null, sha: null };

    const ext = iconPath.split('.').pop()?.toLowerCase() ?? '';
    const contentType = LOGO_EXT_TO_MIME[ext];
    if (!contentType) {
      logger.warn('profile_sync_logo_unsupported_ext', { repoName, iconPath });
      return { url: null, sha: null };
    }

    const fileResult = await this.github.readFileBinary(this.org, repoName, iconPath);
    if (!fileResult.ok) {
      logger.warn('profile_sync_logo_fetch_failed', { repoName, iconPath, code: fileResult.error.code });
      return { url: null, sha: null };
    }

    return this.processLogoBytes(repoName, ext, contentType, fileResult.data, knownSha);
  }

  /**
   * Tries to fetch `.claude/logo.{ext}` from the repo. Iterates common image
   * extensions in order and returns the first hit. This is the repo-owner's
   * escape hatch for logos that don't live at a browser-reachable public path
   * (e.g. Vite-bundled assets under `src/assets/`).
   */
  private async findClaudeLogoOverride(
    repoName: string,
  ): Promise<{ ext: string; contentType: string; bytes: Buffer } | null> {
    for (const ext of Object.keys(LOGO_EXT_TO_MIME)) {
      const path = `.claude/logo.${ext}`;
      const fileResult = await this.github.readFileBinary(this.org, repoName, path);
      if (fileResult.ok) {
        logger.info('profile_sync_logo_override_found', { repoName, path });
        return { ext, contentType: LOGO_EXT_TO_MIME[ext], bytes: fileResult.data };
      }
    }
    return null;
  }

  /**
   * Hashes the logo bytes, skips the upload when the SHA already matches the
   * stored value, and uploads to the bucket otherwise. Returns the resulting
   * public URL and SHA (both null when the upload itself fails).
   */
  private async processLogoBytes(
    repoName: string,
    ext: string,
    contentType: string,
    bytes: Buffer,
    knownSha: string | null,
  ): Promise<{ url: string | null; sha: string | null }> {
    const sha = createHash('sha256').update(bytes).digest('hex');
    const expectedUrl = this.buildPublicAssetUrl(repoName, `logo.${ext}`);

    if (sha === knownSha) {
      return { url: expectedUrl, sha };
    }

    const uploadResult = await this.store.uploadLogo(repoName, bytes, ext, contentType);
    if (!uploadResult.ok) {
      logger.warn('profile_sync_logo_upload_failed', { repoName, code: uploadResult.error.code });
      return { url: null, sha: null };
    }

    logger.info('profile_sync_logo_uploaded', { repoName, ext, sha: sha.slice(0, 8) });
    return { url: uploadResult.data.publicUrl, sha };
  }

  /**
   * Extracts the Supabase project URL prefix used for public asset URLs. We
   * don't need a separate config value — the store adapter constructs identical
   * URLs from its own state, but the handler re-uses the stored sha as a
   * shortcut, so we mirror the URL shape here.
   */
  private publicUrlBase(): string {
    return process.env.SUPABASE_URL ?? '';
  }

  /** Mirrors SupabaseStoreAdapter.publicAssetUrl for use in the handler. */
  private buildPublicAssetUrl(repoName: string, fileName: string): string {
    return `${this.publicUrlBase()}/storage/v1/object/public/project-assets/${repoName}/${fileName}`;
  }
}

/**
 * Pulls the icon href out of an index.html string. Prefers higher-quality
 * variants over the legacy favicon.ico:
 *   1. <link rel="apple-touch-icon">  (typically 180×180+, full-colour)
 *   2. <link rel="icon" type="image/png">
 *   3. <link rel="icon" type="image/svg+xml">
 *   4. <link rel="icon">  (fallback, may be .ico)
 *
 * Returns a repo-relative path (e.g. `public/logo.png`) or null when no link
 * tag matches.
 */
function extractIconPath(html: string): string | null {
  const head = html.split('</head>')[0] ?? html;

  const linkTags = head.match(/<link\b[^>]*>/gi) ?? [];
  const candidates: { rel: string; type: string | null; href: string }[] = [];
  for (const tag of linkTags) {
    const rel = /\brel\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (!rel || !href) continue;
    if (!/(^|\s)(icon|apple-touch-icon|shortcut\s+icon)(\s|$)/.test(rel)) continue;
    const type = /\btype\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? null;
    candidates.push({ rel, type, href });
  }

  const apple = candidates.find((c) => c.rel.includes('apple-touch-icon'));
  if (apple) return toRepoPath(apple.href);

  const png = candidates.find((c) => c.type === 'image/png');
  if (png) return toRepoPath(png.href);

  const svg = candidates.find((c) => c.type === 'image/svg+xml');
  if (svg) return toRepoPath(svg.href);

  const fallback = candidates[0];
  return fallback ? toRepoPath(fallback.href) : null;
}

/**
 * Converts a browser-relative href from index.html into the repo-relative path
 * where Vite serves it from. Vite serves /public/* as /*, so a leading slash
 * resolves to the public/ folder. External http(s) URLs are skipped.
 */
function toRepoPath(href: string): string | null {
  if (/^https?:\/\//i.test(href)) return null;
  const trimmed = href.replace(/^\.\//, '').replace(/^\//, '');
  return `public/${trimmed}`;
}

/**
 * Maps a mobile repo name to its web counterpart name. Mobile repos follow the
 * convention `xyz.app.richi.solutions` and pair with `xyz.richi.solutions` on
 * the web side (RDF section 00b). Returns null for any name that doesn't match
 * the mobile pattern.
 */
function webCounterpartName(repoName: string): string | null {
  const match = /^([a-z0-9-]+)\.app\.richi\.solutions$/i.exec(repoName);
  return match ? `${match[1]}.richi.solutions` : null;
}

/** Safely extract a string from an unknown config value. */
function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

/** Safely extract a string array from an unknown config value. */
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

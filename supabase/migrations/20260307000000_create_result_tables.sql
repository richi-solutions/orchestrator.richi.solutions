-- Result tables for orchestrator use cases
-- Each job type stores structured results alongside the generic job_runs audit log

-- Daily commit summaries (aggregate job: daily-commits)
CREATE TABLE IF NOT EXISTS commit_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_run_id UUID NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  content TEXT NOT NULL,
  repos_active TEXT[] NOT NULL DEFAULT '{}',
  total_commits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commit_summaries_date ON commit_summaries (summary_date DESC);
CREATE INDEX IF NOT EXISTS idx_commit_summaries_job_run ON commit_summaries (job_run_id);

-- Security scan results (sweep job: security-scan)
CREATE TABLE IF NOT EXISTS security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_run_id UUID NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  scan_date DATE NOT NULL,
  content TEXT NOT NULL,
  finding_count INTEGER,
  critical_count INTEGER DEFAULT 0,
  high_count INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  low_count INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('clean', 'findings', 'failure')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_scans_date ON security_scans (scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_security_scans_repo ON security_scans (repo_name, scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_security_scans_job_run ON security_scans (job_run_id);

-- Code review results (sweep job: code-review)
CREATE TABLE IF NOT EXISTS code_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_run_id UUID NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  review_date DATE NOT NULL,
  content TEXT NOT NULL,
  finding_count INTEGER,
  top_priority TEXT,
  status TEXT NOT NULL CHECK (status IN ('clean', 'findings', 'failure')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_code_reviews_date ON code_reviews (review_date DESC);
CREATE INDEX IF NOT EXISTS idx_code_reviews_repo ON code_reviews (repo_name, review_date DESC);
CREATE INDEX IF NOT EXISTS idx_code_reviews_job_run ON code_reviews (job_run_id);

-- Documentation audit results (sweep job: docs-check)
CREATE TABLE IF NOT EXISTS docs_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_run_id UUID NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  audit_date DATE NOT NULL,
  content TEXT NOT NULL,
  score TEXT,
  status TEXT NOT NULL CHECK (status IN ('good', 'partial', 'poor', 'failure')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docs_audits_date ON docs_audits (audit_date DESC);
CREATE INDEX IF NOT EXISTS idx_docs_audits_repo ON docs_audits (repo_name, audit_date DESC);
CREATE INDEX IF NOT EXISTS idx_docs_audits_job_run ON docs_audits (job_run_id);

-- Social media posts (chain job: commits-to-social)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_run_id UUID NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  post_date DATE NOT NULL,
  linkedin_content TEXT,
  twitter_content TEXT,
  should_post BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'posted', 'skipped')) DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_date ON social_posts (post_date DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_job_run ON social_posts (job_run_id);

-- RLS: Service-only access for all new tables
ALTER TABLE commit_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full_access" ON commit_summaries FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_access" ON security_scans FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_access" ON code_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_access" ON docs_audits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_access" ON social_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

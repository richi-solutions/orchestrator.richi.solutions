-- Job runs table for the orchestrator service
-- Stores results of all scheduled and manual job executions

CREATE TABLE IF NOT EXISTS job_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('sweep', 'aggregate', 'chain', 'provision')),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  duration_ms INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failure')),
  targets TEXT[] NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_job_runs_name ON job_runs (job_name);
CREATE INDEX IF NOT EXISTS idx_job_runs_created ON job_runs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_runs_name_created ON job_runs (job_name, created_at DESC);

-- RLS: Service-only access (no user context, accessed via service key)
ALTER TABLE job_runs ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "service_full_access" ON job_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

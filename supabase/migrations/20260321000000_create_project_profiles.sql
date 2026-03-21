-- Project profiles: one row per repo, upserted by profile-sync job.
-- Stores README content and project metadata for n8n social media generation.

CREATE TABLE IF NOT EXISTS project_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_name TEXT NOT NULL UNIQUE,
  readme_content TEXT,
  readme_sha TEXT,
  tagline TEXT,
  description TEXT,
  tech_stack TEXT[],
  demo_video_url TEXT,
  logo_url TEXT,
  project_url TEXT,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_profiles_repo ON project_profiles (repo_name);
CREATE INDEX idx_project_profiles_synced ON project_profiles (last_synced_at DESC);

-- RLS: service-only full access (orchestrator writes via service_role key)
ALTER TABLE project_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full_access" ON project_profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Read-only access for anon (n8n queries via Supabase REST API with anon key)
CREATE POLICY "anon_read_access" ON project_profiles
  FOR SELECT TO anon USING (true);

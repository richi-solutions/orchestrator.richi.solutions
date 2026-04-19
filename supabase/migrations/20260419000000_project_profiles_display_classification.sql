-- Project profiles: display classification overhaul.
--
-- Adds curation columns (displayed, track, icon_name, display_name, tags) so the
-- richi.richi.solutions homepage can list repos purely from the database instead
-- of a hardcoded array. Widens the status enum to (live, open_beta, closed_beta,
-- poc) and migrates legacy values (beta -> open_beta, coming_soon -> closed_beta).

-- 1) Add new columns (all nullable / safe defaults so the migration is additive)

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS track TEXT
    CHECK (track IS NULL OR track IN ('product', 'open_service', 'internal'));

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS displayed BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS icon_name TEXT;

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

-- 2) Migrate legacy status values to the new enum

ALTER TABLE project_profiles DROP CONSTRAINT IF EXISTS project_profiles_status_check;

UPDATE project_profiles SET status = 'open_beta'   WHERE status = 'beta';
UPDATE project_profiles SET status = 'closed_beta' WHERE status = 'coming_soon';

ALTER TABLE project_profiles
  ALTER COLUMN status SET DEFAULT 'closed_beta';

ALTER TABLE project_profiles
  ADD CONSTRAINT project_profiles_status_check
  CHECK (status IN ('live', 'open_beta', 'closed_beta', 'poc'));

-- 3) Index to speed up the homepage query (is_public AND displayed)

CREATE INDEX IF NOT EXISTS idx_project_profiles_displayed
  ON project_profiles (displayed) WHERE displayed = true;

-- 4) Seed curation data for the known projects so the homepage keeps rendering
--    after the hardcoded array is removed. New / unknown repos stay hidden
--    (displayed = false default) until curated manually.

UPDATE project_profiles SET
  display_name = 'MovieMind',
  status = 'live',
  track = 'product',
  displayed = true,
  icon_name = 'brain',
  tags = ARRAY['AI', 'Entertainment', 'Mobile'],
  project_url = COALESCE(project_url, 'https://movie-mind.com')
WHERE repo_name = 'moviemind.richi.solutions';

UPDATE project_profiles SET
  display_name = 'Memobot',
  status = 'open_beta',
  track = 'product',
  displayed = true,
  icon_name = 'bot',
  tags = ARRAY['AI', 'Chatbot', 'SaaS'],
  project_url = COALESCE(project_url, 'https://memobot.org')
WHERE repo_name = 'memobot.richi.solutions';

UPDATE project_profiles SET
  display_name = 'Hookr',
  status = 'closed_beta',
  track = 'product',
  displayed = true,
  icon_name = 'zap',
  tags = ARRAY['Social Media', 'Analytics', 'AI'],
  project_url = COALESCE(project_url, 'https://hookr.media')
WHERE repo_name = 'hookr.richi.solutions';

UPDATE project_profiles SET
  display_name = 'PadelLeague',
  status = 'open_beta',
  track = 'product',
  displayed = true,
  icon_name = 'trophy',
  tags = ARRAY['Sports', 'Tournaments', 'Community'],
  project_url = COALESCE(project_url, 'https://padel-league.app')
WHERE repo_name = 'padel-league.richi.solutions';

UPDATE project_profiles SET
  display_name = 'Ventura',
  status = 'open_beta',
  track = 'open_service',
  displayed = true,
  icon_name = 'rocket',
  tags = ARRAY['Social', 'Community', 'Platform'],
  project_url = COALESCE(project_url, 'https://ventura.richi.solutions')
WHERE repo_name = 'ventura.richi.solutions';

UPDATE project_profiles SET
  display_name = 'Richi-Media',
  status = 'open_beta',
  track = 'open_service',
  displayed = true,
  icon_name = 'play',
  tags = ARRAY['Media', 'AI', 'Open License'],
  project_url = COALESCE(project_url, 'https://media.richi.solutions')
WHERE repo_name = 'media.richi.solutions';

-- Videoanalyzer: internal tool, first entry in the Labs section.
-- Upserted so the row exists even if profile-sync has not yet created it.
INSERT INTO project_profiles (
  repo_name, display_name, status, track, displayed, icon_name, tags,
  project_url, is_public
) VALUES (
  'videoanalyzer.richi.solutions', 'Videoanalyzer', 'closed_beta', 'internal', true,
  'film', ARRAY['AI', 'Video', 'Internal'],
  'https://videoanalyzer.richi.solutions', true
)
ON CONFLICT (repo_name) DO UPDATE SET
  display_name = COALESCE(project_profiles.display_name, EXCLUDED.display_name),
  track        = COALESCE(project_profiles.track,        EXCLUDED.track),
  icon_name    = COALESCE(project_profiles.icon_name,    EXCLUDED.icon_name),
  tags         = CASE WHEN array_length(project_profiles.tags, 1) IS NULL
                      THEN EXCLUDED.tags ELSE project_profiles.tags END,
  displayed    = true;

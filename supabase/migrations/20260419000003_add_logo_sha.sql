-- Logo asset sync: track the SHA-256 of the synced logo bytes so the weekly
-- profile-sync can skip re-uploading unchanged assets to project-assets bucket.
-- Populated by ProfileSyncHandler when it parses index.html, downloads the
-- referenced icon, and uploads it as project-assets/<repo>/logo.<ext>.

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS logo_sha TEXT;

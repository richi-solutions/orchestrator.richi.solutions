-- Add MARKETING.md sync field, drop unused readme_sha.
--
-- marketing_md mirrors readme_content: raw markdown from MARKETING.md in each
-- repo, synced weekly by ProfileSyncHandler for downstream n8n consumption
-- (social media generation uses marketing-angled copy, not README tech docs).
--
-- readme_sha was provisioned for change-detection but never populated; dropping
-- it keeps the schema honest and avoids a second dead column next to a
-- hypothetical marketing_sha.

ALTER TABLE project_profiles
  ADD COLUMN IF NOT EXISTS marketing_md TEXT;

ALTER TABLE project_profiles
  DROP COLUMN IF EXISTS readme_sha;

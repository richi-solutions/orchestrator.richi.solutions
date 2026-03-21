-- Add 'sync' to the allowed job_type values in job_runs table.
-- Required for the new profile-sync job that syncs README content to project_profiles.

ALTER TABLE job_runs DROP CONSTRAINT IF EXISTS job_runs_job_type_check;
ALTER TABLE job_runs ADD CONSTRAINT job_runs_job_type_check
  CHECK (job_type IN ('sweep', 'aggregate', 'chain', 'provision', 'sync', 'agentic'));

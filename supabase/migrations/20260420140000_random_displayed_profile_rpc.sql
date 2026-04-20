-- RPC: random_displayed_profile
--
-- Returns one random row from project_profiles where displayed = true.
-- Consumed by n8n for daily "feature a random project" flows so the server
-- picks the row (uses idx_project_profiles_displayed) instead of shipping
-- the full list to n8n and selecting client-side.
--
-- STABLE: function output depends on table state, not on input arguments.
-- Exposed to anon so the n8n HTTP node can call it with just the anon key.

CREATE OR REPLACE FUNCTION random_displayed_profile()
RETURNS SETOF project_profiles
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM project_profiles
  WHERE displayed = true
  ORDER BY random()
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION random_displayed_profile() TO anon;
GRANT EXECUTE ON FUNCTION random_displayed_profile() TO authenticated;

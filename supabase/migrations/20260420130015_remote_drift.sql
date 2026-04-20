drop extension if exists "pg_net";

create extension if not exists "vector" with schema "public";


  create table "public"."apps" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "display_name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."apps" enable row level security;


  create table "public"."character_app_assignments" (
    "character_id" uuid not null,
    "app_id" uuid not null,
    "character_name" text not null,
    "app_name" text not null
      );


alter table "public"."character_app_assignments" enable row level security;


  create table "public"."characters" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "mbti_type" text not null,
    "age" integer,
    "gender" text,
    "occupation" text,
    "personality_summary" text,
    "backstory" text,
    "visual_description" text,
    "avatar_url" text,
    "voice_id" text,
    "relationships" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."characters" enable row level security;


  create table "public"."location_app_assignments" (
    "location_id" uuid not null,
    "app_id" uuid not null,
    "location_name" text not null,
    "app_name" text not null
      );


alter table "public"."location_app_assignments" enable row level security;


  create table "public"."locations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "type" text not null,
    "description" text,
    "visual_description" text,
    "reference_image_url" text,
    "mood_tags" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."locations" enable row level security;


  create table "public"."scene_characters" (
    "scene_id" uuid not null,
    "character_id" uuid not null,
    "character_name" text
      );


alter table "public"."scene_characters" enable row level security;


  create table "public"."scene_memory" (
    "id" uuid not null default gen_random_uuid(),
    "pipeline_run_id" uuid,
    "narrative_date" date not null,
    "app_id" uuid not null,
    "location_id" uuid,
    "script" text not null,
    "summary" text not null,
    "emotional_tags" text[] not null default '{}'::text[],
    "embedding" public.vector(768) not null,
    "generated_image_url" text,
    "generated_video_url" text,
    "social_content_id" uuid,
    "platform_posts" jsonb not null default '{}'::jsonb,
    "performance_metrics" jsonb not null default '{}'::jsonb,
    "cost_cents" integer,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."scene_memory" enable row level security;


  create table "public"."scene_metrics_snapshots" (
    "id" uuid not null default gen_random_uuid(),
    "scene_id" uuid not null,
    "platform" text not null,
    "views" integer not null default 0,
    "likes" integer not null default 0,
    "shares" integer not null default 0,
    "comments" integer not null default 0,
    "captured_at" timestamp with time zone not null default now()
      );


alter table "public"."scene_metrics_snapshots" enable row level security;


  create table "public"."value_delivery_segments" (
    "id" uuid not null default gen_random_uuid(),
    "app_id" uuid not null,
    "title" text not null,
    "description" text,
    "video_url" text not null,
    "duration_seconds" integer,
    "is_active" boolean not null default true,
    "usage_count" integer not null default 0,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."value_delivery_segments" enable row level security;

alter table "public"."project_profiles" add column "promotion_active" boolean not null default false;

alter table "public"."project_profiles" add column "promotion_hook" text;

alter table "public"."project_profiles" add column "promotion_link" text;

alter table "public"."project_profiles" add column "promotion_source" text not null default 'internal'::text;

CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (id);

CREATE UNIQUE INDEX apps_slug_key ON public.apps USING btree (slug);

CREATE UNIQUE INDEX character_app_assignments_pkey ON public.character_app_assignments USING btree (character_id, app_id);

CREATE UNIQUE INDEX characters_name_key ON public.characters USING btree (name);

CREATE UNIQUE INDEX characters_pkey ON public.characters USING btree (id);

CREATE INDEX idx_char_app_by_app ON public.character_app_assignments USING btree (app_id);

CREATE INDEX idx_loc_app_by_app ON public.location_app_assignments USING btree (app_id);

CREATE INDEX idx_locations_mood_tags ON public.locations USING gin (mood_tags);

CREATE INDEX idx_project_profiles_promotion ON public.project_profiles USING btree (promotion_active) WHERE (promotion_active = true);

CREATE INDEX idx_scene_chars_by_character ON public.scene_characters USING btree (character_id);

CREATE INDEX idx_scene_memory_app ON public.scene_memory USING btree (app_id);

CREATE INDEX idx_scene_memory_embedding ON public.scene_memory USING hnsw (embedding public.vector_cosine_ops) WITH (m='16', ef_construction='64');

CREATE INDEX idx_scene_memory_narrative_date ON public.scene_memory USING btree (narrative_date DESC);

CREATE INDEX idx_scene_memory_pipeline_run ON public.scene_memory USING btree (pipeline_run_id) WHERE (pipeline_run_id IS NOT NULL);

CREATE INDEX idx_sms_scene_platform ON public.scene_metrics_snapshots USING btree (scene_id, platform, captured_at DESC);

CREATE INDEX idx_vds_app_active ON public.value_delivery_segments USING btree (app_id) WHERE (is_active = true);

CREATE UNIQUE INDEX location_app_assignments_pkey ON public.location_app_assignments USING btree (location_id, app_id);

CREATE UNIQUE INDEX locations_name_key ON public.locations USING btree (name);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (id);

CREATE UNIQUE INDEX scene_characters_pkey ON public.scene_characters USING btree (scene_id, character_id);

CREATE UNIQUE INDEX scene_memory_pipeline_run_id_key ON public.scene_memory USING btree (pipeline_run_id);

CREATE UNIQUE INDEX scene_memory_pkey ON public.scene_memory USING btree (id);

CREATE UNIQUE INDEX scene_metrics_snapshots_pkey ON public.scene_metrics_snapshots USING btree (id);

CREATE UNIQUE INDEX value_delivery_segments_pkey ON public.value_delivery_segments USING btree (id);

alter table "public"."apps" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."character_app_assignments" add constraint "character_app_assignments_pkey" PRIMARY KEY using index "character_app_assignments_pkey";

alter table "public"."characters" add constraint "characters_pkey" PRIMARY KEY using index "characters_pkey";

alter table "public"."location_app_assignments" add constraint "location_app_assignments_pkey" PRIMARY KEY using index "location_app_assignments_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."scene_characters" add constraint "scene_characters_pkey" PRIMARY KEY using index "scene_characters_pkey";

alter table "public"."scene_memory" add constraint "scene_memory_pkey" PRIMARY KEY using index "scene_memory_pkey";

alter table "public"."scene_metrics_snapshots" add constraint "scene_metrics_snapshots_pkey" PRIMARY KEY using index "scene_metrics_snapshots_pkey";

alter table "public"."value_delivery_segments" add constraint "value_delivery_segments_pkey" PRIMARY KEY using index "value_delivery_segments_pkey";

alter table "public"."apps" add constraint "apps_slug_key" UNIQUE using index "apps_slug_key";

alter table "public"."character_app_assignments" add constraint "character_app_assignments_app_id_fkey" FOREIGN KEY (app_id) REFERENCES public.apps(id) ON DELETE CASCADE not valid;

alter table "public"."character_app_assignments" validate constraint "character_app_assignments_app_id_fkey";

alter table "public"."character_app_assignments" add constraint "character_app_assignments_character_id_fkey" FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_app_assignments" validate constraint "character_app_assignments_character_id_fkey";

alter table "public"."characters" add constraint "characters_age_check" CHECK (((age > 0) AND (age < 100))) not valid;

alter table "public"."characters" validate constraint "characters_age_check";

alter table "public"."characters" add constraint "characters_mbti_type_check" CHECK ((mbti_type = ANY (ARRAY['INTJ'::text, 'INTP'::text, 'ENTJ'::text, 'ENTP'::text, 'INFJ'::text, 'INFP'::text, 'ENFJ'::text, 'ENFP'::text, 'ISTJ'::text, 'ISFJ'::text, 'ESTJ'::text, 'ESFJ'::text, 'ISTP'::text, 'ISFP'::text, 'ESTP'::text, 'ESFP'::text]))) not valid;

alter table "public"."characters" validate constraint "characters_mbti_type_check";

alter table "public"."characters" add constraint "characters_name_key" UNIQUE using index "characters_name_key";

alter table "public"."location_app_assignments" add constraint "location_app_assignments_app_id_fkey" FOREIGN KEY (app_id) REFERENCES public.apps(id) ON DELETE CASCADE not valid;

alter table "public"."location_app_assignments" validate constraint "location_app_assignments_app_id_fkey";

alter table "public"."location_app_assignments" add constraint "location_app_assignments_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE not valid;

alter table "public"."location_app_assignments" validate constraint "location_app_assignments_location_id_fkey";

alter table "public"."locations" add constraint "locations_name_key" UNIQUE using index "locations_name_key";

alter table "public"."locations" add constraint "locations_type_check" CHECK ((type = ANY (ARRAY['home'::text, 'workplace'::text, 'restaurant_bar'::text, 'outdoor'::text, 'sports_venue'::text, 'public_space'::text, 'transport'::text, 'other'::text]))) not valid;

alter table "public"."locations" validate constraint "locations_type_check";

alter table "public"."project_profiles" add constraint "project_profiles_promotion_source_check" CHECK ((promotion_source = ANY (ARRAY['internal'::text, 'external'::text]))) not valid;

alter table "public"."project_profiles" validate constraint "project_profiles_promotion_source_check";

alter table "public"."scene_characters" add constraint "scene_characters_character_id_fkey" FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE RESTRICT not valid;

alter table "public"."scene_characters" validate constraint "scene_characters_character_id_fkey";

alter table "public"."scene_characters" add constraint "scene_characters_scene_id_fkey" FOREIGN KEY (scene_id) REFERENCES public.scene_memory(id) ON DELETE CASCADE not valid;

alter table "public"."scene_characters" validate constraint "scene_characters_scene_id_fkey";

alter table "public"."scene_memory" add constraint "scene_memory_app_id_fkey" FOREIGN KEY (app_id) REFERENCES public.apps(id) not valid;

alter table "public"."scene_memory" validate constraint "scene_memory_app_id_fkey";

alter table "public"."scene_memory" add constraint "scene_memory_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL not valid;

alter table "public"."scene_memory" validate constraint "scene_memory_location_id_fkey";

alter table "public"."scene_memory" add constraint "scene_memory_pipeline_run_id_key" UNIQUE using index "scene_memory_pipeline_run_id_key";

alter table "public"."scene_memory" add constraint "scene_memory_social_content_id_fkey" FOREIGN KEY (social_content_id) REFERENCES public.social_content(id) ON DELETE SET NULL not valid;

alter table "public"."scene_memory" validate constraint "scene_memory_social_content_id_fkey";

alter table "public"."scene_metrics_snapshots" add constraint "scene_metrics_snapshots_platform_check" CHECK ((platform = ANY (ARRAY['tiktok'::text, 'youtube_shorts'::text, 'instagram_reels'::text]))) not valid;

alter table "public"."scene_metrics_snapshots" validate constraint "scene_metrics_snapshots_platform_check";

alter table "public"."scene_metrics_snapshots" add constraint "scene_metrics_snapshots_scene_id_fkey" FOREIGN KEY (scene_id) REFERENCES public.scene_memory(id) ON DELETE CASCADE not valid;

alter table "public"."scene_metrics_snapshots" validate constraint "scene_metrics_snapshots_scene_id_fkey";

alter table "public"."value_delivery_segments" add constraint "value_delivery_segments_app_id_fkey" FOREIGN KEY (app_id) REFERENCES public.apps(id) ON DELETE CASCADE not valid;

alter table "public"."value_delivery_segments" validate constraint "value_delivery_segments_app_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.autofill_character_app_names()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  SELECT c.name INTO NEW.character_name FROM characters c WHERE c.id = NEW.character_id;
  SELECT a.display_name INTO NEW.app_name FROM apps a WHERE a.id = NEW.app_id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.autofill_location_app_names()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  SELECT l.name INTO NEW.location_name FROM locations l WHERE l.id = NEW.location_id;
  SELECT a.display_name INTO NEW.app_name FROM apps a WHERE a.id = NEW.app_id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.autofill_scene_character_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  SELECT c.name INTO NEW.character_name FROM characters c WHERE c.id = NEW.character_id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_relationship_symmetry()
 RETURNS TABLE(character_a_id uuid, character_a_name text, character_b_id uuid, character_b_name text, a_sees_b_as text, b_sees_a_as text, issue text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c_a.id AS character_a_id,
    c_a.name AS character_a_name,
    c_b.id AS character_b_id,
    c_b.name AS character_b_name,
    c_a.relationships -> c_b.id::text ->> 'type' AS a_sees_b_as,
    c_b.relationships -> c_a.id::text ->> 'type' AS b_sees_a_as,
    CASE
      WHEN c_b.relationships -> c_a.id::text IS NULL
      THEN 'One-sided relationship: B does not reference A'
      WHEN (c_a.relationships -> c_b.id::text ->> 'type')
        != (c_b.relationships -> c_a.id::text ->> 'type')
      THEN 'Type mismatch (may be intentional for asymmetric perception)'
      ELSE NULL
    END AS issue
  FROM
    characters c_a,
    jsonb_object_keys(c_a.relationships) AS rel_key
    JOIN characters c_b ON c_b.id::text = rel_key
  WHERE
    c_b.relationships -> c_a.id::text IS NULL
    OR (c_a.relationships -> c_b.id::text ->> 'type')
      != (c_b.relationships -> c_a.id::text ->> 'type');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_segments_for_app(target_app_slug text)
 RETURNS TABLE(id uuid, title text, description text, video_url text, duration_seconds integer, usage_count integer, last_used_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    vds.id,
    vds.title,
    vds.description,
    vds.video_url,
    vds.duration_seconds,
    vds.usage_count,
    vds.last_used_at
  FROM value_delivery_segments vds
  JOIN apps a ON a.id = vds.app_id
  WHERE a.slug = target_app_slug
    AND vds.is_active = true
  ORDER BY vds.usage_count ASC, random()
  LIMIT 10;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_characters_for_app(target_app_slug text)
 RETURNS TABLE(id uuid, name text, mbti_type text, age integer, gender text, occupation text, personality_summary text, backstory text, visual_description text, avatar_url text, voice_id text, relationships jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.mbti_type,
    c.age,
    c.gender,
    c.occupation,
    c.personality_summary,
    c.backstory,
    c.visual_description,
    c.avatar_url,
    c.voice_id,
    c.relationships
  FROM characters c
  JOIN character_app_assignments caa ON caa.character_id = c.id
  JOIN apps a ON a.id = caa.app_id
  WHERE a.slug = target_app_slug
    AND a.is_active = true
  ORDER BY c.name;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_locations_for_app(target_app_slug text)
 RETURNS TABLE(id uuid, name text, type text, description text, visual_description text, reference_image_url text, mood_tags text[])
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.type,
    l.description,
    l.visual_description,
    l.reference_image_url,
    l.mood_tags
  FROM locations l
  JOIN location_app_assignments laa ON laa.location_id = l.id
  JOIN apps a ON a.id = laa.app_id
  WHERE a.slug = target_app_slug
    AND a.is_active = true
  ORDER BY l.name;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.record_segment_usage(segment_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE value_delivery_segments
  SET usage_count = usage_count + 1,
      last_used_at = now()
  WHERE id = segment_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_scene_memory(query_embedding public.vector, involved_character_ids uuid[], result_limit integer DEFAULT 5, similarity_threshold double precision DEFAULT 0.7)
 RETURNS TABLE(id uuid, narrative_date date, app_slug text, character_names text[], location_name text, summary text, script text, emotional_tags text[], similarity double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    sm.id,
    sm.narrative_date,
    a.slug AS app_slug,
    ARRAY(
      SELECT c.name FROM scene_characters sc
      JOIN characters c ON c.id = sc.character_id
      WHERE sc.scene_id = sm.id
    ) AS character_names,
    l.name AS location_name,
    sm.summary,
    sm.script,
    sm.emotional_tags,
    (1 - (sm.embedding <=> query_embedding))::FLOAT AS similarity
  FROM scene_memory sm
  JOIN apps a ON a.id = sm.app_id
  LEFT JOIN locations l ON l.id = sm.location_id
  WHERE
    -- At least one of the involved characters was in the past scene
    EXISTS (
      SELECT 1 FROM scene_characters sc
      WHERE sc.scene_id = sm.id
        AND sc.character_id = ANY(involved_character_ids)
    )
    -- Similarity threshold
    AND (1 - (sm.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY similarity DESC
  LIMIT result_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_app_name_on_rename()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.display_name != OLD.display_name THEN
    UPDATE character_app_assignments SET app_name = NEW.display_name
      WHERE app_id = NEW.id;
    UPDATE location_app_assignments SET app_name = NEW.display_name
      WHERE app_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_character_name_on_rename()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.name != OLD.name THEN
    UPDATE character_app_assignments SET character_name = NEW.name
      WHERE character_id = NEW.id;
    UPDATE scene_characters SET character_name = NEW.name
      WHERE character_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_location_name_on_rename()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.name != OLD.name THEN
    UPDATE location_app_assignments SET location_name = NEW.name
      WHERE location_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_character_relationships()
 RETURNS TABLE(character_id uuid, character_name text, referenced_id text, issue text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS character_id,
    c.name AS character_name,
    rel_key AS referenced_id,
    CASE
      WHEN NOT EXISTS (
        SELECT 1 FROM characters c2 WHERE c2.id::text = rel_key
      )
      THEN 'Referenced character UUID does not exist'
      WHEN rel_key = c.id::text
      THEN 'Character references itself'
      ELSE NULL
    END AS issue
  FROM
    characters c,
    jsonb_object_keys(c.relationships) AS rel_key
  WHERE
    -- Only return rows with actual issues
    NOT EXISTS (
      SELECT 1 FROM characters c2 WHERE c2.id::text = rel_key
    )
    OR rel_key = c.id::text;
END;
$function$
;

grant delete on table "public"."apps" to "anon";

grant insert on table "public"."apps" to "anon";

grant references on table "public"."apps" to "anon";

grant select on table "public"."apps" to "anon";

grant trigger on table "public"."apps" to "anon";

grant truncate on table "public"."apps" to "anon";

grant update on table "public"."apps" to "anon";

grant delete on table "public"."apps" to "authenticated";

grant insert on table "public"."apps" to "authenticated";

grant references on table "public"."apps" to "authenticated";

grant select on table "public"."apps" to "authenticated";

grant trigger on table "public"."apps" to "authenticated";

grant truncate on table "public"."apps" to "authenticated";

grant update on table "public"."apps" to "authenticated";

grant delete on table "public"."apps" to "service_role";

grant insert on table "public"."apps" to "service_role";

grant references on table "public"."apps" to "service_role";

grant select on table "public"."apps" to "service_role";

grant trigger on table "public"."apps" to "service_role";

grant truncate on table "public"."apps" to "service_role";

grant update on table "public"."apps" to "service_role";

grant delete on table "public"."character_app_assignments" to "anon";

grant insert on table "public"."character_app_assignments" to "anon";

grant references on table "public"."character_app_assignments" to "anon";

grant select on table "public"."character_app_assignments" to "anon";

grant trigger on table "public"."character_app_assignments" to "anon";

grant truncate on table "public"."character_app_assignments" to "anon";

grant update on table "public"."character_app_assignments" to "anon";

grant delete on table "public"."character_app_assignments" to "authenticated";

grant insert on table "public"."character_app_assignments" to "authenticated";

grant references on table "public"."character_app_assignments" to "authenticated";

grant select on table "public"."character_app_assignments" to "authenticated";

grant trigger on table "public"."character_app_assignments" to "authenticated";

grant truncate on table "public"."character_app_assignments" to "authenticated";

grant update on table "public"."character_app_assignments" to "authenticated";

grant delete on table "public"."character_app_assignments" to "service_role";

grant insert on table "public"."character_app_assignments" to "service_role";

grant references on table "public"."character_app_assignments" to "service_role";

grant select on table "public"."character_app_assignments" to "service_role";

grant trigger on table "public"."character_app_assignments" to "service_role";

grant truncate on table "public"."character_app_assignments" to "service_role";

grant update on table "public"."character_app_assignments" to "service_role";

grant delete on table "public"."characters" to "anon";

grant insert on table "public"."characters" to "anon";

grant references on table "public"."characters" to "anon";

grant select on table "public"."characters" to "anon";

grant trigger on table "public"."characters" to "anon";

grant truncate on table "public"."characters" to "anon";

grant update on table "public"."characters" to "anon";

grant delete on table "public"."characters" to "authenticated";

grant insert on table "public"."characters" to "authenticated";

grant references on table "public"."characters" to "authenticated";

grant select on table "public"."characters" to "authenticated";

grant trigger on table "public"."characters" to "authenticated";

grant truncate on table "public"."characters" to "authenticated";

grant update on table "public"."characters" to "authenticated";

grant delete on table "public"."characters" to "service_role";

grant insert on table "public"."characters" to "service_role";

grant references on table "public"."characters" to "service_role";

grant select on table "public"."characters" to "service_role";

grant trigger on table "public"."characters" to "service_role";

grant truncate on table "public"."characters" to "service_role";

grant update on table "public"."characters" to "service_role";

grant delete on table "public"."location_app_assignments" to "anon";

grant insert on table "public"."location_app_assignments" to "anon";

grant references on table "public"."location_app_assignments" to "anon";

grant select on table "public"."location_app_assignments" to "anon";

grant trigger on table "public"."location_app_assignments" to "anon";

grant truncate on table "public"."location_app_assignments" to "anon";

grant update on table "public"."location_app_assignments" to "anon";

grant delete on table "public"."location_app_assignments" to "authenticated";

grant insert on table "public"."location_app_assignments" to "authenticated";

grant references on table "public"."location_app_assignments" to "authenticated";

grant select on table "public"."location_app_assignments" to "authenticated";

grant trigger on table "public"."location_app_assignments" to "authenticated";

grant truncate on table "public"."location_app_assignments" to "authenticated";

grant update on table "public"."location_app_assignments" to "authenticated";

grant delete on table "public"."location_app_assignments" to "service_role";

grant insert on table "public"."location_app_assignments" to "service_role";

grant references on table "public"."location_app_assignments" to "service_role";

grant select on table "public"."location_app_assignments" to "service_role";

grant trigger on table "public"."location_app_assignments" to "service_role";

grant truncate on table "public"."location_app_assignments" to "service_role";

grant update on table "public"."location_app_assignments" to "service_role";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

grant delete on table "public"."scene_characters" to "anon";

grant insert on table "public"."scene_characters" to "anon";

grant references on table "public"."scene_characters" to "anon";

grant select on table "public"."scene_characters" to "anon";

grant trigger on table "public"."scene_characters" to "anon";

grant truncate on table "public"."scene_characters" to "anon";

grant update on table "public"."scene_characters" to "anon";

grant delete on table "public"."scene_characters" to "authenticated";

grant insert on table "public"."scene_characters" to "authenticated";

grant references on table "public"."scene_characters" to "authenticated";

grant select on table "public"."scene_characters" to "authenticated";

grant trigger on table "public"."scene_characters" to "authenticated";

grant truncate on table "public"."scene_characters" to "authenticated";

grant update on table "public"."scene_characters" to "authenticated";

grant delete on table "public"."scene_characters" to "service_role";

grant insert on table "public"."scene_characters" to "service_role";

grant references on table "public"."scene_characters" to "service_role";

grant select on table "public"."scene_characters" to "service_role";

grant trigger on table "public"."scene_characters" to "service_role";

grant truncate on table "public"."scene_characters" to "service_role";

grant update on table "public"."scene_characters" to "service_role";

grant delete on table "public"."scene_memory" to "anon";

grant insert on table "public"."scene_memory" to "anon";

grant references on table "public"."scene_memory" to "anon";

grant select on table "public"."scene_memory" to "anon";

grant trigger on table "public"."scene_memory" to "anon";

grant truncate on table "public"."scene_memory" to "anon";

grant update on table "public"."scene_memory" to "anon";

grant delete on table "public"."scene_memory" to "authenticated";

grant insert on table "public"."scene_memory" to "authenticated";

grant references on table "public"."scene_memory" to "authenticated";

grant select on table "public"."scene_memory" to "authenticated";

grant trigger on table "public"."scene_memory" to "authenticated";

grant truncate on table "public"."scene_memory" to "authenticated";

grant update on table "public"."scene_memory" to "authenticated";

grant delete on table "public"."scene_memory" to "service_role";

grant insert on table "public"."scene_memory" to "service_role";

grant references on table "public"."scene_memory" to "service_role";

grant select on table "public"."scene_memory" to "service_role";

grant trigger on table "public"."scene_memory" to "service_role";

grant truncate on table "public"."scene_memory" to "service_role";

grant update on table "public"."scene_memory" to "service_role";

grant delete on table "public"."scene_metrics_snapshots" to "anon";

grant insert on table "public"."scene_metrics_snapshots" to "anon";

grant references on table "public"."scene_metrics_snapshots" to "anon";

grant select on table "public"."scene_metrics_snapshots" to "anon";

grant trigger on table "public"."scene_metrics_snapshots" to "anon";

grant truncate on table "public"."scene_metrics_snapshots" to "anon";

grant update on table "public"."scene_metrics_snapshots" to "anon";

grant delete on table "public"."scene_metrics_snapshots" to "authenticated";

grant insert on table "public"."scene_metrics_snapshots" to "authenticated";

grant references on table "public"."scene_metrics_snapshots" to "authenticated";

grant select on table "public"."scene_metrics_snapshots" to "authenticated";

grant trigger on table "public"."scene_metrics_snapshots" to "authenticated";

grant truncate on table "public"."scene_metrics_snapshots" to "authenticated";

grant update on table "public"."scene_metrics_snapshots" to "authenticated";

grant delete on table "public"."scene_metrics_snapshots" to "service_role";

grant insert on table "public"."scene_metrics_snapshots" to "service_role";

grant references on table "public"."scene_metrics_snapshots" to "service_role";

grant select on table "public"."scene_metrics_snapshots" to "service_role";

grant trigger on table "public"."scene_metrics_snapshots" to "service_role";

grant truncate on table "public"."scene_metrics_snapshots" to "service_role";

grant update on table "public"."scene_metrics_snapshots" to "service_role";

grant delete on table "public"."value_delivery_segments" to "anon";

grant insert on table "public"."value_delivery_segments" to "anon";

grant references on table "public"."value_delivery_segments" to "anon";

grant select on table "public"."value_delivery_segments" to "anon";

grant trigger on table "public"."value_delivery_segments" to "anon";

grant truncate on table "public"."value_delivery_segments" to "anon";

grant update on table "public"."value_delivery_segments" to "anon";

grant delete on table "public"."value_delivery_segments" to "authenticated";

grant insert on table "public"."value_delivery_segments" to "authenticated";

grant references on table "public"."value_delivery_segments" to "authenticated";

grant select on table "public"."value_delivery_segments" to "authenticated";

grant trigger on table "public"."value_delivery_segments" to "authenticated";

grant truncate on table "public"."value_delivery_segments" to "authenticated";

grant update on table "public"."value_delivery_segments" to "authenticated";

grant delete on table "public"."value_delivery_segments" to "service_role";

grant insert on table "public"."value_delivery_segments" to "service_role";

grant references on table "public"."value_delivery_segments" to "service_role";

grant select on table "public"."value_delivery_segments" to "service_role";

grant trigger on table "public"."value_delivery_segments" to "service_role";

grant truncate on table "public"."value_delivery_segments" to "service_role";

grant update on table "public"."value_delivery_segments" to "service_role";


  create policy "service_full_access"
  on "public"."apps"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."character_app_assignments"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."characters"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."location_app_assignments"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."locations"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."scene_characters"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."scene_memory"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."scene_metrics_snapshots"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "service_full_access"
  on "public"."value_delivery_segments"
  as permissive
  for all
  to service_role
using (true)
with check (true);


CREATE TRIGGER trg_apps_updated_at BEFORE UPDATE ON public.apps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_sync_app_name AFTER UPDATE ON public.apps FOR EACH ROW EXECUTE FUNCTION public.sync_app_name_on_rename();

CREATE TRIGGER trg_autofill_char_app_names BEFORE INSERT ON public.character_app_assignments FOR EACH ROW EXECUTE FUNCTION public.autofill_character_app_names();

CREATE TRIGGER trg_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_sync_character_name AFTER UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.sync_character_name_on_rename();

CREATE TRIGGER trg_autofill_loc_app_names BEFORE INSERT ON public.location_app_assignments FOR EACH ROW EXECUTE FUNCTION public.autofill_location_app_names();

CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_sync_location_name AFTER UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.sync_location_name_on_rename();

CREATE TRIGGER trg_autofill_scene_char_name BEFORE INSERT ON public.scene_characters FOR EACH ROW EXECUTE FUNCTION public.autofill_scene_character_name();

CREATE TRIGGER trg_vds_updated_at BEFORE UPDATE ON public.value_delivery_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();



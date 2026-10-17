-- REMEMBER SECURITY V2 / REVIEW ONLY / NEVER AUTO-EXECUTE
-- Target ONLY isolated remember-test Supabase project kauxrvshxgpbvptdwhog.
-- Design proposal; requires explicit migration approval and negative tests.
-- Existing album, photo, guest link and upload functions remain unchanged.
BEGIN;
CREATE TABLE remember.security_feature_flags (
  feature_key text PRIMARY KEY CHECK (feature_key IN (
    'verified_guest_email','photo_approval','guest_reports','report_notifications',
    'slideshow_pause','quota_notifications')),
  mode text NOT NULL DEFAULT 'OFF' CHECK (mode IN ('OFF','TEST','ON')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
CREATE TABLE remember.security_test_eligibility (
  feature_key text NOT NULL REFERENCES remember.security_feature_flags(feature_key),
  album_id uuid NOT NULL REFERENCES remember.albums(id) ON DELETE CASCADE,
  PRIMARY KEY(feature_key,album_id)
);
CREATE TABLE remember.security_album_settings (
  album_id uuid PRIMARY KEY REFERENCES remember.albums(id) ON DELETE CASCADE,
  require_verified_email boolean NOT NULL DEFAULT false,
  require_photo_approval boolean NOT NULL DEFAULT false,
  allow_reports boolean NOT NULL DEFAULT false,
  notify_reports boolean NOT NULL DEFAULT false,
  pause_new_slideshow_photos boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
CREATE TABLE remember.security_settings_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id uuid NOT NULL,
  album_id uuid REFERENCES remember.albums(id) ON DELETE SET NULL,
  setting_scope text NOT NULL CHECK(setting_scope IN ('feature','album','eligibility')),
  setting_key text NOT NULL,
  previous_value jsonb,
  next_value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE remember.security_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE remember.security_test_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE remember.security_album_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE remember.security_settings_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember.security_feature_flags,remember.security_test_eligibility,
  remember.security_album_settings,remember.security_settings_audit FROM PUBLIC,anon,authenticated;
REVOKE ALL ON SEQUENCE remember.security_settings_audit_id_seq FROM PUBLIC,anon,authenticated;
-- Server access is intentionally not granted by this schema migration.
-- No SECURITY DEFINER functions or browser grants are created here.
-- Every setting change must be performed in ONE server-side transaction that:
-- 1) verifies the authenticated actor via Supabase Auth (never trusts p_actor alone);
-- 2) checks album owner_user_id or remember.webmasters membership;
-- 3) locks the target row, checks mode OFF/TEST/ON and TEST eligibility;
-- 4) writes settings and audit atomically; failures roll back both;
-- 5) refuses unknown feature keys, invalid states and duplicate/replayed requests.
-- Runtime must independently enforce flags on all read/write paths.
-- Until runtime enforcement is deployed, all flags stay OFF; never enable TEST/ON.
COMMIT;

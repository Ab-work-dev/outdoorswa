BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS activities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, name text NOT NULL,
 subtype text NOT NULL DEFAULT '', environment text NOT NULL CHECK(environment IN ('Land','Water','Air')),
 category text NOT NULL CHECK(category IN ('Recreation','Adventure & Tourism','Both','Outdoor Education','Outdoor Health')),
 description text NOT NULL DEFAULT '', skill_level text NOT NULL DEFAULT '', equipment text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'Researching' CHECK(status IN ('Researching','Verified','Needs Review')),
 source_url text NOT NULL DEFAULT '', last_verified date, created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS activity_unique_name_subtype ON activities (lower(name),lower(subtype),environment,category);
CREATE TABLE IF NOT EXISTS organisations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, name text NOT NULL,
 organisation_type text NOT NULL DEFAULT 'Other', roles text[] NOT NULL DEFAULT '{}',
 services text NOT NULL DEFAULT '', website text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '',
 phone text NOT NULL DEFAULT '', region text NOT NULL DEFAULT '', source_url text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'Researching' CHECK(status IN ('Researching','Verified','Needs Review')),
 last_verified date, created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS organisation_unique_name ON organisations (lower(name));
CREATE TABLE IF NOT EXISTS locations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, name text NOT NULL,
 region text NOT NULL DEFAULT '', setting text NOT NULL DEFAULT '', latitude double precision,
 longitude double precision, access_type text NOT NULL DEFAULT '', facilities text NOT NULL DEFAULT '',
 source_url text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'Researching' CHECK(status IN ('Researching','Verified','Needs Review')),
 last_verified date,created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT valid_lat CHECK(latitude IS NULL OR latitude BETWEEN -90 AND 90),
 CONSTRAINT valid_lon CHECK(longitude IS NULL OR longitude BETWEEN -180 AND 180)
);
CREATE UNIQUE INDEX IF NOT EXISTS location_unique_name_region ON locations (lower(name),lower(region));
CREATE TABLE IF NOT EXISTS relationships (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
 organisation_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
 location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
 role text NOT NULL, note text NOT NULL DEFAULT '', source_url text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT one_relation_target CHECK ((organisation_id IS NOT NULL AND location_id IS NULL) OR (organisation_id IS NULL AND location_id IS NOT NULL)),
 CONSTRAINT unique_activity_org_role UNIQUE(activity_id,organisation_id,role),
 CONSTRAINT unique_activity_location_role UNIQUE(activity_id,location_id,role)
);
CREATE INDEX IF NOT EXISTS idx_activity_environment ON activities(environment);
CREATE INDEX IF NOT EXISTS idx_activity_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_org_roles ON organisations USING GIN(roles);
CREATE INDEX IF NOT EXISTS idx_org_region ON organisations(region);
CREATE INDEX IF NOT EXISTS idx_location_region ON locations(region);
CREATE INDEX IF NOT EXISTS idx_rel_activity ON relationships(activity_id);
CREATE INDEX IF NOT EXISTS idx_rel_org ON relationships(organisation_id);
CREATE TABLE IF NOT EXISTS audit_log (
 id bigserial PRIMARY KEY, resource text NOT NULL, resource_id uuid, operation text NOT NULL,
 actor text NOT NULL DEFAULT 'admin', data jsonb NOT NULL DEFAULT '{}', timestamp timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS activity_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS organisation_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS location_code_seq START 1;
COMMIT;

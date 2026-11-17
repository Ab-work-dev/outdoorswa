-- Outdoors WA v0.1 Organisations Strategic Mapping Extension
-- Safe to run on an existing database. Existing organisation rows are preserved.
BEGIN;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT '';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS participation_role text NOT NULL DEFAULT '';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS strategic_relevance text NOT NULL DEFAULT '';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS existing_owa_relationship text NOT NULL DEFAULT 'Unknown';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '';
COMMIT;

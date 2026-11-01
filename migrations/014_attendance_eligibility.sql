CREATE TABLE IF NOT EXISTS chamber_event_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  politician_id uuid NOT NULL,
  eligibility_state text NOT NULL,
  eligibility_source_id uuid,
  eligibility_source_url text,
  reference_date date,
  collected_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, politician_id)
);

CREATE INDEX IF NOT EXISTS idx_chamber_event_eligibility_event
  ON chamber_event_eligibility(event_id);

CREATE INDEX IF NOT EXISTS idx_chamber_event_eligibility_politician
  ON chamber_event_eligibility(politician_id);

ALTER TABLE chamber_events
  ADD COLUMN IF NOT EXISTS eligibility_mode text;

ALTER TABLE chamber_events
  ADD COLUMN IF NOT EXISTS denominator_status text;
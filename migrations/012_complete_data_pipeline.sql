CREATE TABLE IF NOT EXISTS executive_indicators (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), politician_id uuid NOT NULL, office text NOT NULL,
 period_id uuid NOT NULL, indicator text NOT NULL, raw_value numeric, normalized_value numeric,
 availability_state text NOT NULL DEFAULT 'observed', source_id text, source_url text,
 collected_at timestamptz NOT NULL DEFAULT now(), calculation_hash text,
 UNIQUE(politician_id,period_id,indicator)
);
CREATE TABLE IF NOT EXISTS senate_votes_raw (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), external_id text UNIQUE NOT NULL, politician_id uuid,
 period_id uuid NOT NULL, proposition_id text, vote text, vote_date date,
 source_url text, availability_state text NOT NULL DEFAULT 'observed', collected_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS electoral_source_manifests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), election_year integer NOT NULL, dataset text NOT NULL,
 resource_name text, format text, url text NOT NULL, collected_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(election_year,dataset,resource_name,url)
);
CREATE TABLE IF NOT EXISTS audit_checks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), check_name text NOT NULL, period_id uuid,
 status text NOT NULL, details jsonb, checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exec_indicators_period ON executive_indicators(period_id,office,indicator);
CREATE INDEX IF NOT EXISTS idx_senate_votes_period ON senate_votes_raw(period_id,politician_id);
CREATE INDEX IF NOT EXISTS idx_audit_checks_period ON audit_checks(period_id);
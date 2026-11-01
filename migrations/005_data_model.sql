CREATE TABLE IF NOT EXISTS mandates (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 office TEXT NOT NULL,
 start_date DATE,
 end_date DATE,
 legislature_id TEXT,
 state TEXT,
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS votes (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 proposition_id TEXT,
 vote TEXT,
 vote_date DATE,
 period_id UUID REFERENCES periods(id),
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS propositions (
 id TEXT PRIMARY KEY,
 type TEXT,
 number TEXT,
 year INTEGER,
 subject TEXT,
 status TEXT,
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS expenses (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 category TEXT,
 amount NUMERIC(14,2),
 expense_date DATE,
 period_id UUID REFERENCES periods(id),
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS electoral_accounts (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 election TEXT,
 revenue NUMERIC(14,2),
 expenditure NUMERIC(14,2),
 period_id UUID REFERENCES periods(id),
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commitments (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 commitment TEXT,
 target TEXT,
 deadline DATE,
 achieved NUMERIC(8,3),
 status TEXT,
 evidence_source UUID REFERENCES sources(id),
 period_id UUID REFERENCES periods(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS legal_records (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 case_reference TEXT,
 status TEXT,
 court TEXT,
 record_date DATE,
 period_id UUID REFERENCES periods(id),
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS party_membership (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 party_id TEXT NOT NULL,
 start_date DATE,
 end_date DATE,
 period_id UUID REFERENCES periods(id),
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS party_events (
 id BIGSERIAL PRIMARY KEY,
 party_id TEXT NOT NULL,
 event_type TEXT,
 event_date DATE,
 period_id UUID REFERENCES periods(id),
 description TEXT,
 source_id UUID REFERENCES sources(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS party_aggregates (
 id BIGSERIAL PRIMARY KEY,
 party_id TEXT NOT NULL,
 office TEXT NOT NULL,
 period_id UUID REFERENCES periods(id),
 members_count INTEGER NOT NULL DEFAULT 0,
 mean_score NUMERIC(8,3),
 mean_coverage NUMERIC(8,3),
 methodology_version TEXT NOT NULL,
 calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS score_dimensions (
 id BIGSERIAL PRIMARY KEY,
 politician_id UUID REFERENCES politicians(id),
 office TEXT NOT NULL,
 period_id UUID REFERENCES periods(id),
 reference_year INTEGER NOT NULL,
 methodology_version TEXT NOT NULL,
 criterion TEXT NOT NULL,
 raw_value NUMERIC,
 normalized_value NUMERIC,
 points NUMERIC(8,3),
 calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 source_snapshot_id UUID,
 calculation_hash TEXT
);
CREATE TABLE IF NOT EXISTS score_revisions (
 id BIGSERIAL PRIMARY KEY,
 score_snapshot_id UUID REFERENCES score_snapshots(id),
 previous_snapshot_id UUID REFERENCES score_snapshots(id),
 reason TEXT NOT NULL,
 changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 source_id UUID REFERENCES sources(id),
 change_type TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mandates_politician ON mandates(politician_id);
CREATE INDEX IF NOT EXISTS idx_votes_period_politician ON votes(period_id,politician_id);
CREATE INDEX IF NOT EXISTS idx_expenses_period_politician ON expenses(period_id,politician_id);
CREATE INDEX IF NOT EXISTS idx_scores_period_politician ON score_dimensions(period_id,politician_id);
CREATE INDEX IF NOT EXISTS idx_party_aggregates_period ON party_aggregates(period_id,office);
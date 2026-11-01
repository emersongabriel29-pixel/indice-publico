CREATE TABLE score_snapshots (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 politician_id UUID REFERENCES politicians(id),
 office TEXT NOT NULL,
 period_id UUID REFERENCES periods(id),
 reference_year INTEGER NOT NULL,
 methodology_version TEXT NOT NULL,
 final_score NUMERIC(8,3),
 coverage NUMERIC(8,3),
 calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 input_hash TEXT,
 methodology_hash TEXT
)
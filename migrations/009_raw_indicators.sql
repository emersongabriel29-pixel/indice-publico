CREATE TABLE IF NOT EXISTS indicator_values (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 politician_id UUID REFERENCES politicians(id),
 office TEXT NOT NULL,
 period_id UUID REFERENCES periods(id),
 indicator TEXT NOT NULL,
 raw_value NUMERIC,
 normalized_value NUMERIC,
 availability_state TEXT NOT NULL DEFAULT 'observed',
 source_id TEXT,
 source_url TEXT,
 collected_at TIMESTAMPTZ DEFAULT now(),
 calculation_hash TEXT,
 UNIQUE(politician_id,period_id,indicator)
);
CREATE INDEX IF NOT EXISTS idx_indicator_period ON indicator_values(period_id,indicator);
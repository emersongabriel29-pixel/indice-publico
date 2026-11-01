CREATE TABLE IF NOT EXISTS chamber_votes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 external_id TEXT UNIQUE NOT NULL,
 office TEXT NOT NULL,
 period_id UUID REFERENCES periods(id),
 proposition_id TEXT,
 vote_date DATE,
 description TEXT,
 result TEXT,
 source_id UUID,
 collected_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chamber_votes_period ON chamber_votes(period_id);
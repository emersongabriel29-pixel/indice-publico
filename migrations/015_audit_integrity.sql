ALTER TABLE score_snapshots ADD COLUMN IF NOT EXISTS validity_status TEXT NOT NULL DEFAULT 'valid';
ALTER TABLE score_snapshots ADD COLUMN IF NOT EXISTS invalidated_reason TEXT;
CREATE INDEX IF NOT EXISTS idx_score_snapshots_lookup ON score_snapshots(politician_id,office,reference_year,methodology_version,calculated_at DESC);
UPDATE score_snapshots
SET validity_status='invalidated',
    invalidated_reason='Snapshot legado invalidado antes da auditoria: cálculo anterior tratava NULL como valor numérico e permitia múltiplos snapshots ativos.'
WHERE reference_year=2026 AND methodology_version='1.0';
CREATE UNIQUE INDEX IF NOT EXISTS uq_score_snapshots_active
ON score_snapshots(politician_id,office,reference_year,methodology_version)
WHERE validity_status='valid';
CREATE TABLE IF NOT EXISTS chamber_vote_eligibility (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 vote_id UUID NOT NULL REFERENCES chamber_votes(id),
 politician_id UUID NOT NULL REFERENCES politicians(id),
 eligibility_state TEXT NOT NULL,
 eligibility_source_id UUID REFERENCES sources(id),
 eligibility_source_url TEXT,
 reference_date DATE,
 collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(vote_id,politician_id)
);
CREATE INDEX IF NOT EXISTS idx_chamber_vote_eligibility_vote ON chamber_vote_eligibility(vote_id);
CREATE INDEX IF NOT EXISTS idx_chamber_vote_eligibility_politician ON chamber_vote_eligibility(politician_id);
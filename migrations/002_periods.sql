CREATE TABLE periods (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 type TEXT NOT NULL,
 reference_year INTEGER NOT NULL,
 start_date DATE,
 end_date DATE,
 office TEXT,
 mandate_id TEXT,
 methodology_version TEXT NOT NULL,
 UNIQUE(type, reference_year, office, methodology_version)
)
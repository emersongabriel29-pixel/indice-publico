CREATE TABLE politicians (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 official_id TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL,
 ballot_name TEXT,
 office TEXT NOT NULL,
 state TEXT,
 party TEXT,
 status TEXT,
 source_id TEXT,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
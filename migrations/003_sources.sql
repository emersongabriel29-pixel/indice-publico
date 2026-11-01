CREATE TABLE sources (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 institution TEXT NOT NULL,
 url TEXT NOT NULL,
 source_type TEXT,
 collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 reliability TEXT,
 source_version TEXT,
 document_hash TEXT
)
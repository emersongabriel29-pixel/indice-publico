CREATE TABLE IF NOT EXISTS sync_state (
 source_key TEXT PRIMARY KEY,
 cursor_value INTEGER NOT NULL DEFAULT 1,
 last_run_at TIMESTAMPTZ,
 last_status TEXT,
 last_error TEXT,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
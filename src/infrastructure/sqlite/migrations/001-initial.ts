export const initialSchemaVersion = "1";

export const initialMigrationSql = `
CREATE TABLE schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO schema_meta(key, value)
VALUES ('schema_version', '${initialSchemaVersion}');

CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  collection_path TEXT NOT NULL UNIQUE,
  manifest_path TEXT NOT NULL UNIQUE,
  videos_path TEXT NOT NULL UNIQUE,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sync_runs (
  id TEXT PRIMARY KEY,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'ok', 'partial', 'failed')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  counters_json TEXT NOT NULL CHECK (json_valid(counters_json))
);

CREATE TABLE video_packages (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  relative_path TEXT NOT NULL,
  manifest_stage TEXT,
  title TEXT,
  creator TEXT,
  canonical_url TEXT,
  duration_seconds INTEGER,
  published_at TEXT,
  source_language TEXT,
  context_language TEXT,
  tags_json TEXT CHECK (tags_json IS NULL OR json_valid(tags_json)),
  categories_json TEXT CHECK (categories_json IS NULL OR json_valid(categories_json)),
  visual_profile TEXT,
  package_hash TEXT NOT NULL,
  last_seen_sync_id TEXT NOT NULL REFERENCES sync_runs(id),
  indexed_at TEXT NOT NULL,
  UNIQUE (source_id, video_id)
);

CREATE TABLE source_documents (
  id INTEGER PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES video_packages(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('context', 'rules', 'analysis', 'metadata')),
  relative_path TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  parser_version TEXT NOT NULL,
  UNIQUE (package_id, kind)
);

CREATE TABLE knowledge_units (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES knowledge_units(id) ON DELETE CASCADE,
  stable_key TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  depth INTEGER NOT NULL CHECK (depth >= 0),
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  content TEXT NOT NULL,
  structured_json TEXT CHECK (structured_json IS NULL OR json_valid(structured_json)),
  heading_path_json TEXT NOT NULL CHECK (json_valid(heading_path_json)),
  timestamps_json TEXT NOT NULL CHECK (json_valid(timestamps_json)),
  visual_evidence_json TEXT NOT NULL CHECK (json_valid(visual_evidence_json)),
  estimated_tokens INTEGER NOT NULL CHECK (estimated_tokens >= 0),
  content_hash TEXT NOT NULL,
  searchable INTEGER NOT NULL CHECK (searchable IN (0, 1)),
  UNIQUE (document_id, stable_key)
);

CREATE TABLE search_fragments (
  id INTEGER PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES knowledge_units(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  heading_path TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL CHECK (token_count > 0),
  content_hash TEXT NOT NULL,
  UNIQUE (unit_id, ordinal)
);

CREATE VIRTUAL TABLE fragment_fts USING fts5(
  title,
  heading_path,
  content,
  content='search_fragments',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2'
);

CREATE TABLE embeddings (
  fragment_id INTEGER NOT NULL REFERENCES search_fragments(id) ON DELETE CASCADE,
  model_key TEXT NOT NULL,
  model_version TEXT NOT NULL,
  dimensions INTEGER NOT NULL CHECK (dimensions > 0),
  content_hash TEXT NOT NULL,
  vector BLOB NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (fragment_id, model_key)
);

CREATE TABLE sync_issues (
  id INTEGER PRIMARY KEY,
  sync_id TEXT NOT NULL REFERENCES sync_runs(id) ON DELETE CASCADE,
  video_id TEXT,
  relative_path TEXT,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  retryable INTEGER NOT NULL CHECK (retryable IN (0, 1))
);

CREATE INDEX sync_runs_source_id_idx ON sync_runs(source_id);
CREATE INDEX video_packages_source_sync_idx
  ON video_packages(source_id, last_seen_sync_id);
CREATE INDEX video_packages_last_seen_sync_idx
  ON video_packages(last_seen_sync_id);
CREATE INDEX source_documents_package_id_idx ON source_documents(package_id);
CREATE INDEX knowledge_units_document_id_idx ON knowledge_units(document_id);
CREATE INDEX knowledge_units_parent_id_idx ON knowledge_units(parent_id);
CREATE INDEX search_fragments_unit_id_idx ON search_fragments(unit_id);
CREATE INDEX sync_issues_sync_id_idx ON sync_issues(sync_id);

CREATE TRIGGER fragment_fts_insert AFTER INSERT ON search_fragments BEGIN
  INSERT INTO fragment_fts(rowid, title, heading_path, content)
  VALUES (new.id, new.title, new.heading_path, new.content);
END;

CREATE TRIGGER fragment_fts_delete AFTER DELETE ON search_fragments BEGIN
  INSERT INTO fragment_fts(fragment_fts, rowid, title, heading_path, content)
  VALUES ('delete', old.id, old.title, old.heading_path, old.content);
END;

CREATE TRIGGER fragment_fts_update AFTER UPDATE ON search_fragments BEGIN
  INSERT INTO fragment_fts(fragment_fts, rowid, title, heading_path, content)
  VALUES ('delete', old.id, old.title, old.heading_path, old.content);
  INSERT INTO fragment_fts(rowid, title, heading_path, content)
  VALUES (new.id, new.title, new.heading_path, new.content);
END;
`;

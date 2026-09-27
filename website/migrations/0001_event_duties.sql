-- D1 schema for /event-duties (functions/api/duties.js).
-- The function also creates these tables on first request, so running this
-- file is optional: npx wrangler d1 execute lawpark-event-duties --remote --file migrations/0001_event_duties.sql

CREATE TABLE IF NOT EXISTS duty_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  duty_id TEXT NOT NULL,
  person TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  UNIQUE (duty_id, person COLLATE NOCASE)
);

CREATE TABLE IF NOT EXISTS duty_custom (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  removed_at TEXT
);

CREATE TABLE IF NOT EXISTS duty_members (
  mobile TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL
);

-- Schedule activities. Owners live in duty_assignments under the activity id.
CREATE TABLE IF NOT EXISTS duty_events (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  removed_at TEXT
);

CREATE TABLE IF NOT EXISTS duty_todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  text TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  done_by TEXT,
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  assignee TEXT,                          -- who is doing it (a member's name)
  status TEXT NOT NULL DEFAULT 'todo',    -- todo, doing, stuck, done
  updated_by TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS duty_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  todo_id INTEGER NOT NULL,
  by_name TEXT NOT NULL,
  text TEXT NOT NULL,
  at TEXT NOT NULL
);

-- activities_seeded: set once the starting schedule has been copied in.
CREATE TABLE IF NOT EXISTS duty_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS duty_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  by_name TEXT NOT NULL,
  action TEXT NOT NULL,
  duty_id TEXT,
  person TEXT,
  detail TEXT
);

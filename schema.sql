-- D1 = SQLite под капотом. Применяй: wrangler d1 migrations create frontblock init --local
-- затем wrangler d1 migrations apply frontblock --local  (и --remote для прода)

CREATE TABLE IF NOT EXISTS players (
  uuid              TEXT PRIMARY KEY,          -- minecraft uuid, привязывается при первом /login
  nickname          TEXT NOT NULL UNIQUE,      -- ник с сайта = ник в игре
  password_hash     TEXT NOT NULL,             -- bcryptjs
  minecraft_uuid    TEXT,                      -- null до первого логина с плагина
  rank              INTEGER NOT NULL DEFAULT 1,
  faction           TEXT,                      -- 'TPA' / 'VSS' / null
  subteam           TEXT,
  kills             INTEGER NOT NULL DEFAULT 0,
  deaths            INTEGER NOT NULL DEFAULT 0,
  headshots         INTEGER NOT NULL DEFAULT 0,
  vehicles_destroyed INTEGER NOT NULL DEFAULT 0,
  money             INTEGER NOT NULL DEFAULT 0,
  playtime_seconds  INTEGER NOT NULL DEFAULT 0,
  prefix            TEXT,                      -- админ-override префикса
  is_banned         INTEGER NOT NULL DEFAULT 0,-- sqlite bool = 0/1
  ban_reason        TEXT,
  created_at        INTEGER NOT NULL,          -- epoch sec
  last_seen         INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_players_nick ON players(nickname);
CREATE INDEX IF NOT EXISTS idx_players_mcuuid ON players(minecraft_uuid);

CREATE TABLE IF NOT EXISTS news (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  author      TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

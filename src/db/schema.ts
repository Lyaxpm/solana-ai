export const schemaSql = `
CREATE TABLE IF NOT EXISTS discovered_tokens (
  mint TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  liquidity_usd REAL NOT NULL,
  volume_5m_usd REAL NOT NULL,
  volume_1h_usd REAL NOT NULL,
  volume_24h_usd REAL NOT NULL,
  pair_age_minutes REAL NOT NULL,
  suspicious INTEGER NOT NULL,
  fetched_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS discovered_wallets (
  wallet TEXT PRIMARY KEY,
  observations INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS wallet_features (
  wallet TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS wallet_scores (
  wallet TEXT PRIMARY KEY,
  score REAL NOT NULL,
  confidence REAL NOT NULL,
  reasons_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS coin_features (
  mint TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS coin_scores (
  mint TEXT PRIMARY KEY,
  score REAL NOT NULL,
  reasons_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  wallet TEXT NOT NULL,
  mint TEXT NOT NULL,
  wallet_score REAL NOT NULL,
  coin_score REAL NOT NULL,
  decision TEXT NOT NULL,
  reasons_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  position_id TEXT NOT NULL,
  side TEXT NOT NULL,
  mint TEXT NOT NULL,
  qty REAL NOT NULL,
  price_usd REAL NOT NULL,
  fee_usd REAL NOT NULL,
  slippage_bps REAL NOT NULL,
  tx_id TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS positions (
  id TEXT PRIMARY KEY,
  mint TEXT NOT NULL,
  qty REAL NOT NULL,
  entry_price_usd REAL NOT NULL,
  current_price_usd REAL NOT NULL,
  opened_at INTEGER NOT NULL,
  source_wallet TEXT NOT NULL,
  status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pnl_snapshots (
  ts INTEGER PRIMARY KEY,
  balance_usd REAL NOT NULL,
  realized_pnl_usd REAL NOT NULL,
  unrealized_pnl_usd REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS bot_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at INTEGER NOT NULL,
  mode TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS risk_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

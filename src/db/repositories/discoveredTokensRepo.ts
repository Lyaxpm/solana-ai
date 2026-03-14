import Database from 'better-sqlite3';
import { TokenCandidate } from '../../types/domain.js';

export class DiscoveredTokensRepo {
  constructor(private readonly db: Database.Database) {}

  upsertMany(tokens: TokenCandidate[]): void {
    const stmt = this.db.prepare(`
      INSERT INTO discovered_tokens (mint, symbol, liquidity_usd, volume_5m_usd, volume_1h_usd, volume_24h_usd, pair_age_minutes, suspicious, fetched_at)
      VALUES (@mint, @symbol, @liquidityUsd, @volume5mUsd, @volume1hUsd, @volume24hUsd, @pairAgeMinutes, @suspicious, @fetchedAt)
      ON CONFLICT(mint) DO UPDATE SET
        symbol=excluded.symbol,
        liquidity_usd=excluded.liquidity_usd,
        volume_5m_usd=excluded.volume_5m_usd,
        volume_1h_usd=excluded.volume_1h_usd,
        volume_24h_usd=excluded.volume_24h_usd,
        pair_age_minutes=excluded.pair_age_minutes,
        suspicious=excluded.suspicious,
        fetched_at=excluded.fetched_at
    `);
    const tx = this.db.transaction((rows: TokenCandidate[]) => rows.forEach((r) => stmt.run({ ...r, suspicious: r.suspicious ? 1 : 0 })));
    tx(tokens);
  }

  listRecent(limit = 50): TokenCandidate[] {
    return this.db.prepare('SELECT * FROM discovered_tokens ORDER BY fetched_at DESC LIMIT ?').all(limit).map((r: any) => ({
      mint: r.mint,
      symbol: r.symbol,
      liquidityUsd: r.liquidity_usd,
      volume5mUsd: r.volume_5m_usd,
      volume1hUsd: r.volume_1h_usd,
      volume24hUsd: r.volume_24h_usd,
      pairAgeMinutes: r.pair_age_minutes,
      suspicious: Boolean(r.suspicious),
      priceChange5mPct: 0,
      fetchedAt: r.fetched_at
    }));
  }
}

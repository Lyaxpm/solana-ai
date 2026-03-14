import Database from 'better-sqlite3';
import { CoinFeature, CoinScore } from '../../types/domain.js';

export class CoinScoresRepo {
  constructor(private readonly db: Database.Database) {}

  saveFeature(feature: CoinFeature): void {
    this.db.prepare(`
      INSERT INTO coin_features (mint, payload_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(mint) DO UPDATE SET payload_json=excluded.payload_json, updated_at=excluded.updated_at
    `).run(feature.mint, JSON.stringify(feature), feature.updatedAt);
  }

  saveScore(score: CoinScore): void {
    this.db.prepare(`
      INSERT INTO coin_scores (mint, score, reasons_json, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(mint) DO UPDATE SET score=excluded.score, reasons_json=excluded.reasons_json, updated_at=excluded.updated_at
    `).run(score.mint, score.score, JSON.stringify(score.reasons), score.updatedAt);
  }

  get(mint: string): CoinScore | undefined {
    const r: any = this.db.prepare('SELECT * FROM coin_scores WHERE mint = ?').get(mint);
    if (!r) return undefined;
    return { mint: r.mint, score: r.score, reasons: JSON.parse(r.reasons_json), updatedAt: r.updated_at };
  }
}

import Database from 'better-sqlite3';
import { WalletFeature, WalletScore } from '../../types/domain.js';

export class WalletScoresRepo {
  constructor(private readonly db: Database.Database) {}

  saveFeature(feature: WalletFeature): void {
    this.db.prepare(`
      INSERT INTO wallet_features (wallet, payload_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(wallet) DO UPDATE SET payload_json=excluded.payload_json, updated_at=excluded.updated_at
    `).run(feature.wallet, JSON.stringify(feature), feature.updatedAt);
  }

  saveScore(score: WalletScore): void {
    this.db.prepare(`
      INSERT INTO wallet_scores (wallet, score, confidence, reasons_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(wallet) DO UPDATE SET score=excluded.score, confidence=excluded.confidence, reasons_json=excluded.reasons_json, updated_at=excluded.updated_at
    `).run(score.wallet, score.score, score.confidence, JSON.stringify(score.reasons), score.updatedAt);
  }

  get(wallet: string): WalletScore | undefined {
    const r: any = this.db.prepare('SELECT * FROM wallet_scores WHERE wallet = ?').get(wallet);
    if (!r) return undefined;
    return { wallet: r.wallet, score: r.score, confidence: r.confidence, reasons: JSON.parse(r.reasons_json), updatedAt: r.updated_at };
  }
}

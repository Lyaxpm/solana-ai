import Database from 'better-sqlite3';
import { SignalDecision } from '../../types/domain.js';

export class SignalsRepo {
  constructor(private readonly db: Database.Database) {}

  save(signal: SignalDecision): void {
    this.db.prepare(`INSERT OR REPLACE INTO signals (id, wallet, mint, wallet_score, coin_score, decision, reasons_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(signal.id, signal.wallet, signal.mint, signal.walletScore, signal.coinScore, signal.decision, JSON.stringify(signal.reasons), signal.createdAt);
  }
}

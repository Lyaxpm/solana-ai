import Database from 'better-sqlite3';
import { PortfolioSnapshot } from '../types/domain.js';

export class Monitor {
  constructor(private readonly db: Database.Database) {}

  saveSnapshot(snapshot: PortfolioSnapshot): void {
    this.db.prepare('INSERT OR REPLACE INTO pnl_snapshots (ts, balance_usd, realized_pnl_usd, unrealized_pnl_usd) VALUES (?, ?, ?, ?)')
      .run(Date.now(), snapshot.balanceUsd, snapshot.realizedPnlUsd, snapshot.unrealizedPnlUsd);
  }
}

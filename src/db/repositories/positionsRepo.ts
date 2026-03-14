import Database from 'better-sqlite3';
import { Position } from '../../types/domain.js';

export class PositionsRepo {
  constructor(private readonly db: Database.Database) {}

  save(position: Position): void {
    this.db.prepare(`INSERT OR REPLACE INTO positions (id, mint, qty, entry_price_usd, current_price_usd, opened_at, source_wallet, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')`)
      .run(position.id, position.mint, position.qty, position.entryPriceUsd, position.currentPriceUsd, position.openedAt, position.sourceWallet);
  }

  close(positionId: string): void {
    this.db.prepare(`UPDATE positions SET status='CLOSED' WHERE id=?`).run(positionId);
  }

  listOpen(): Position[] {
    return this.db.prepare(`SELECT * FROM positions WHERE status='OPEN'`).all().map((r: any) => ({
      id: r.id,
      mint: r.mint,
      qty: r.qty,
      entryPriceUsd: r.entry_price_usd,
      currentPriceUsd: r.current_price_usd,
      openedAt: r.opened_at,
      sourceWallet: r.source_wallet
    }));
  }
}

import Database from 'better-sqlite3';
import { Trade } from '../../types/domain.js';

export class TradesRepo {
  constructor(private readonly db: Database.Database) {}
  save(trade: Trade): void {
    this.db.prepare(`INSERT OR REPLACE INTO trades (id, position_id, side, mint, qty, price_usd, fee_usd, slippage_bps, tx_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(trade.id, trade.positionId, trade.side, trade.mint, trade.qty, trade.priceUsd, trade.feeUsd, trade.slippageBps, trade.txId ?? null, trade.createdAt);
  }
}

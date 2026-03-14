import { Env } from '../config/env.js';
import { JupiterClient } from '../types/api.js';
import { Position, Trade } from '../types/domain.js';
import { Broker } from './broker.js';
import { id } from '../utils/ids.js';
import { now } from '../utils/time.js';

export class LiveBroker implements Broker {
  constructor(private readonly env: Env, private readonly jupiter: JupiterClient) {}

  async placeBuy(params: { mint: string; amountUsd: number; estSlippageBps: number; feeUsd: number; sourceWallet: string }): Promise<{ trade: Trade; position: Position }> {
    if (!this.env.LIVE_TRADING) throw new Error('LiveBroker cannot execute when LIVE_TRADING!=true');
    const swap = await this.jupiter.executeSwap({ mint: params.mint, side: 'BUY', amountUsd: params.amountUsd });
    const position: Position = { id: id(), mint: params.mint, qty: params.amountUsd, entryPriceUsd: 1, currentPriceUsd: 1, openedAt: now(), sourceWallet: params.sourceWallet };
    const trade: Trade = { id: id(), positionId: position.id, side: 'BUY', mint: params.mint, qty: position.qty, priceUsd: 1, feeUsd: params.feeUsd, slippageBps: params.estSlippageBps, txId: swap.txId, createdAt: now() };
    return { trade, position };
  }

  async placeSell(params: { position: Position; estSlippageBps: number; feeUsd: number }): Promise<{ trade: Trade }> {
    if (!this.env.LIVE_TRADING) throw new Error('LiveBroker cannot execute when LIVE_TRADING!=true');
    const swap = await this.jupiter.executeSwap({ mint: params.position.mint, side: 'SELL', amountUsd: params.position.qty });
    const trade: Trade = { id: id(), positionId: params.position.id, side: 'SELL', mint: params.position.mint, qty: params.position.qty, priceUsd: 1, feeUsd: params.feeUsd, slippageBps: params.estSlippageBps, txId: swap.txId, createdAt: now() };
    return { trade };
  }

  async getPositions(): Promise<Position[]> { return []; }
  async getBalance(): Promise<number> { return this.env.TOTAL_CAPITAL_USD; }
  async getOpenOrders(): Promise<number> { return 0; }
  async snapshotPnl(): Promise<{ realizedPnlUsd: number; unrealizedPnlUsd: number }> { return { realizedPnlUsd: 0, unrealizedPnlUsd: 0 }; }
}

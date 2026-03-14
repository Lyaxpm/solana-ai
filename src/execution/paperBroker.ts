import { Broker } from './broker.js';
import { Position, Trade } from '../types/domain.js';
import { id } from '../utils/ids.js';
import { now } from '../utils/time.js';

export class PaperBroker implements Broker {
  private balanceUsd: number;
  private positions: Position[] = [];
  private realizedPnlUsd = 0;

  constructor(startingBalanceUsd: number) {
    this.balanceUsd = startingBalanceUsd;
  }

  async placeBuy(params: { mint: string; amountUsd: number; estSlippageBps: number; feeUsd: number; sourceWallet: string }): Promise<{ trade: Trade; position: Position }> {
    const gross = params.amountUsd;
    const effective = gross * (1 - params.estSlippageBps / 10_000);
    const price = 1;
    const qty = effective / price;
    this.balanceUsd -= gross + params.feeUsd;
    const position: Position = { id: id(), mint: params.mint, qty, entryPriceUsd: price, currentPriceUsd: price, openedAt: now(), sourceWallet: params.sourceWallet };
    this.positions.push(position);
    const trade: Trade = { id: id(), positionId: position.id, side: 'BUY', mint: params.mint, qty, priceUsd: price, feeUsd: params.feeUsd, slippageBps: params.estSlippageBps, createdAt: now() };
    return { trade, position };
  }

  async placeSell(params: { position: Position; estSlippageBps: number; feeUsd: number }): Promise<{ trade: Trade }> {
    const pnlShock = 1 + (Math.random() - 0.5) * 0.2;
    const exitPrice = params.position.entryPriceUsd * pnlShock;
    const proceeds = params.position.qty * exitPrice * (1 - params.estSlippageBps / 10_000);
    this.balanceUsd += proceeds - params.feeUsd;
    const invested = params.position.qty * params.position.entryPriceUsd;
    this.realizedPnlUsd += proceeds - invested - params.feeUsd;
    this.positions = this.positions.filter((p) => p.id !== params.position.id);
    const trade: Trade = { id: id(), positionId: params.position.id, side: 'SELL', mint: params.position.mint, qty: params.position.qty, priceUsd: exitPrice, feeUsd: params.feeUsd, slippageBps: params.estSlippageBps, createdAt: now() };
    return { trade };
  }

  async getPositions(): Promise<Position[]> { return this.positions; }
  async getBalance(): Promise<number> { return this.balanceUsd; }
  async getOpenOrders(): Promise<number> { return 0; }
  async snapshotPnl(): Promise<{ realizedPnlUsd: number; unrealizedPnlUsd: number }> {
    const unrealized = this.positions.reduce((a, p) => a + (p.currentPriceUsd - p.entryPriceUsd) * p.qty, 0);
    return { realizedPnlUsd: this.realizedPnlUsd, unrealizedPnlUsd: unrealized };
  }
}

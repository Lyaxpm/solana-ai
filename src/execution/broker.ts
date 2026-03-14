import { Position, Trade } from '../types/domain.js';

export interface Broker {
  placeBuy(params: { mint: string; amountUsd: number; estSlippageBps: number; feeUsd: number; sourceWallet: string }): Promise<{ trade: Trade; position: Position }>;
  placeSell(params: { position: Position; estSlippageBps: number; feeUsd: number }): Promise<{ trade: Trade }>;
  getPositions(): Promise<Position[]>;
  getBalance(): Promise<number>;
  getOpenOrders(): Promise<number>;
  snapshotPnl(): Promise<{ realizedPnlUsd: number; unrealizedPnlUsd: number }>;
}

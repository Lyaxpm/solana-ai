export type TradeSide = 'BUY' | 'SELL';

export interface TokenCandidate {
  mint: string;
  symbol: string;
  liquidityUsd: number;
  volume5mUsd: number;
  volume1hUsd: number;
  volume24hUsd: number;
  priceChange5mPct: number;
  fdvUsd?: number;
  pairAgeMinutes: number;
  suspicious: boolean;
  fetchedAt: number;
}

export interface WalletFeature {
  wallet: string;
  realizedPnlProxy: number;
  winRateProxy: number;
  observedTrades: number;
  medianRoiProxy: number;
  avgHoldMinutes: number;
  concentrationRisk: number;
  consistency: number;
  drawdownProxy: number;
  recencyScore: number;
  updatedAt: number;
}

export interface WalletScore {
  wallet: string;
  score: number;
  confidence: number;
  reasons: string[];
  updatedAt: number;
}

export interface CoinFeature {
  mint: string;
  liquidityUsd: number;
  volume5mUsd: number;
  pairAgeMinutes: number;
  momentum: number;
  slippageBps: number;
  volatility: number;
  suspicious: boolean;
  incomplete: boolean;
  updatedAt: number;
}

export interface CoinScore {
  mint: string;
  score: number;
  reasons: string[];
  updatedAt: number;
}

export interface SignalDecision {
  id: string;
  wallet: string;
  mint: string;
  walletScore: number;
  coinScore: number;
  decision: 'BUY' | 'SKIP';
  reasons: string[];
  createdAt: number;
}

export interface Position {
  id: string;
  mint: string;
  qty: number;
  entryPriceUsd: number;
  currentPriceUsd: number;
  openedAt: number;
  sourceWallet: string;
}

export interface Trade {
  id: string;
  positionId: string;
  side: TradeSide;
  mint: string;
  qty: number;
  priceUsd: number;
  feeUsd: number;
  slippageBps: number;
  txId?: string;
  createdAt: number;
}

export interface PortfolioSnapshot {
  balanceUsd: number;
  realizedPnlUsd: number;
  unrealizedPnlUsd: number;
  openPositions: number;
}

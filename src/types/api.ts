import { TokenCandidate } from './domain.js';

export interface DexScreenerClient {
  fetchTrendingSolanaPairs(): Promise<TokenCandidate[]>;
}

export interface HeliusClient {
  ping(): Promise<boolean>;
  discoverWalletsForToken(mint: string): Promise<string[]>;
}

export interface SolanaRpcClient {
  ping(): Promise<boolean>;
  getBalance(address: string): Promise<number>;
}

export interface JupiterClient {
  ping(): Promise<boolean>;
  getQuote(params: { mint: string; amountUsd: number }): Promise<{ estSlippageBps: number; feeUsd: number }>;
  executeSwap(params: { mint: string; side: 'BUY' | 'SELL'; amountUsd: number }): Promise<{ txId: string }>;
}

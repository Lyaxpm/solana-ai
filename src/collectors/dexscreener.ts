import { DexScreenerClient } from '../types/api.js';
import { TokenCandidate } from '../types/domain.js';
import { now } from '../utils/time.js';

export class DexScreenerCollector implements DexScreenerClient {
  async fetchTrendingSolanaPairs(): Promise<TokenCandidate[]> {
    // TODO: integrate official endpoint and normalize response shape.
    return [
      {
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOLMEME',
        liquidityUsd: 25000,
        volume5mUsd: 4500,
        volume1hUsd: 22000,
        volume24hUsd: 140000,
        priceChange5mPct: 3.2,
        fdvUsd: 300000,
        pairAgeMinutes: 400,
        suspicious: false,
        fetchedAt: now()
      }
    ];
  }
}

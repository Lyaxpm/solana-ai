import { DexScreenerClient } from '../types/api.js';
import { TokenCandidate } from '../types/domain.js';

export class TrendingTokensDiscovery {
  constructor(private readonly dex: DexScreenerClient) {}
  async run(): Promise<TokenCandidate[]> {
    return this.dex.fetchTrendingSolanaPairs();
  }
}

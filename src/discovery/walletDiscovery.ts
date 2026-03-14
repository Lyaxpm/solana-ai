import { HeliusClient } from '../types/api.js';
import { TokenCandidate } from '../types/domain.js';

export class WalletDiscovery {
  constructor(private readonly helius: HeliusClient) {}

  async run(tokens: TokenCandidate[]): Promise<string[]> {
    const set = new Set<string>();
    for (const token of tokens) {
      const wallets = await this.helius.discoverWalletsForToken(token.mint);
      wallets.forEach((w) => set.add(w));
    }
    return [...set];
  }
}

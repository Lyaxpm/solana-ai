import { HeliusClient } from '../types/api.js';

export class HeliusCollector implements HeliusClient {
  constructor(private readonly apiKey?: string) {}

  async ping(): Promise<boolean> {
    return Boolean(this.apiKey);
  }

  async discoverWalletsForToken(mint: string): Promise<string[]> {
    // TODO: replace with enhanced tx parsing from helius.
    return [`wallet-${mint.slice(0, 6)}-a`, `wallet-${mint.slice(0, 6)}-b`];
  }
}

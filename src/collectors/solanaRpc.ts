import { SolanaRpcClient } from '../types/api.js';

export class SolanaRpcCollector implements SolanaRpcClient {
  constructor(private readonly url: string) {}

  async ping(): Promise<boolean> {
    return this.url.length > 0;
  }

  async getBalance(_address: string): Promise<number> {
    // TODO: query real SOL balance.
    return 0.5;
  }
}

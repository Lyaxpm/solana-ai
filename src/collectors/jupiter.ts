import { JupiterClient } from '../types/api.js';

export class JupiterCollector implements JupiterClient {
  constructor(private readonly apiKey?: string) {}

  async ping(): Promise<boolean> {
    return true;
  }

  async getQuote(params: { mint: string; amountUsd: number }): Promise<{ estSlippageBps: number; feeUsd: number }> {
    // TODO: integrate jupiter quote route.
    const feeUsd = Math.max(0.05, params.amountUsd * 0.01);
    return { estSlippageBps: 90, feeUsd };
  }

  async executeSwap(): Promise<{ txId: string }> {
    if (!this.apiKey) {
      return { txId: `paper-like-${Date.now()}` };
    }
    // TODO: integrate signed transaction submission.
    return { txId: `jup-${Date.now()}` };
  }
}

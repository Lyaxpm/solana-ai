import { WalletFeature } from '../types/domain.js';
import { now } from '../utils/time.js';

export class WalletActivityService {
  async buildFeatures(wallet: string): Promise<WalletFeature> {
    const seed = wallet.length;
    return {
      wallet,
      realizedPnlProxy: (seed % 10) * 0.3,
      winRateProxy: 45 + (seed % 40),
      observedTrades: 8 + (seed % 12),
      medianRoiProxy: -2 + (seed % 14),
      avgHoldMinutes: 20 + (seed % 180),
      concentrationRisk: (seed % 6) / 10,
      consistency: 50 + (seed % 50),
      drawdownProxy: (seed % 25),
      recencyScore: 40 + (seed % 55),
      updatedAt: now()
    };
  }
}

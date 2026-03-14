import { describe, expect, it } from 'vitest';
import { computeWalletScore } from '../src/scoring/walletScore.js';

describe('wallet score', () => {
  it('returns higher score for stronger features', () => {
    const env = {} as any;
    const strong = computeWalletScore({
      wallet: 'w1', realizedPnlProxy: 2, winRateProxy: 80, observedTrades: 20, medianRoiProxy: 8, avgHoldMinutes: 80,
      concentrationRisk: 0.1, consistency: 90, drawdownProxy: 5, recencyScore: 90, updatedAt: Date.now()
    }, env);
    const weak = computeWalletScore({
      wallet: 'w2', realizedPnlProxy: -2, winRateProxy: 40, observedTrades: 5, medianRoiProxy: -4, avgHoldMinutes: 80,
      concentrationRisk: 0.7, consistency: 30, drawdownProxy: 25, recencyScore: 25, updatedAt: Date.now()
    }, env);

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.score).toBeLessThanOrEqual(100);
  });
});

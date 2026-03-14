import { describe, expect, it } from 'vitest';
import { computeCoinScore } from '../src/scoring/coinScore.js';

describe('coin score', () => {
  it('penalizes low liquidity and high slippage', () => {
    const env = { MIN_LIQUIDITY_USD: 15000, MIN_VOLUME_5M_USD: 2500, MAX_SLIPPAGE_BPS: 180 } as any;
    const good = computeCoinScore({ mint: 'a', liquidityUsd: 50000, volume5mUsd: 6000, pairAgeMinutes: 180, momentum: 1, slippageBps: 70, volatility: 8, suspicious: false, incomplete: false, updatedAt: Date.now() }, env);
    const bad = computeCoinScore({ mint: 'b', liquidityUsd: 3000, volume5mUsd: 300, pairAgeMinutes: 5, momentum: 1, slippageBps: 400, volatility: 25, suspicious: true, incomplete: true, updatedAt: Date.now() }, env);

    expect(good.score).toBeGreaterThan(bad.score);
  });
});

import { CoinFeature, TokenCandidate } from '../types/domain.js';
import { now } from '../utils/time.js';

export const deriveCoinFeature = (t: TokenCandidate): CoinFeature => ({
  mint: t.mint,
  liquidityUsd: t.liquidityUsd,
  volume5mUsd: t.volume5mUsd,
  pairAgeMinutes: t.pairAgeMinutes,
  momentum: t.priceChange5mPct,
  slippageBps: Math.max(20, 25000 / Math.max(1, t.liquidityUsd)),
  volatility: Math.abs(t.priceChange5mPct) * 1.8,
  suspicious: t.suspicious,
  incomplete: !t.fdvUsd,
  updatedAt: now()
});

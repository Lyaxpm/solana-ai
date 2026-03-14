import { Env } from '../config/env.js';
import { CoinFeature, CoinScore } from '../types/domain.js';
import { clamp } from '../utils/math.js';
import { now } from '../utils/time.js';

export function computeCoinScore(feature: CoinFeature, env: Env): CoinScore {
  const reasons: string[] = [];
  let score = 100;

  if (feature.liquidityUsd < env.MIN_LIQUIDITY_USD) {
    score -= 35;
    reasons.push('liquidity below threshold');
  }
  if (feature.volume5mUsd < env.MIN_VOLUME_5M_USD) {
    score -= 20;
    reasons.push('volume below threshold');
  }
  if (feature.pairAgeMinutes < 30) {
    score -= 20;
    reasons.push('pair too new');
  }
  if (feature.slippageBps > env.MAX_SLIPPAGE_BPS) {
    score -= 20;
    reasons.push('slippage too high');
  }
  if (feature.suspicious || feature.incomplete) {
    score -= 25;
    reasons.push('suspicious or incomplete data');
  }

  score -= clamp(feature.volatility - 12, 0, 30) * 0.5;
  score = clamp(score, 0, 100);
  if (reasons.length === 0) reasons.push('liquidity/volume/slippage acceptable');

  return { mint: feature.mint, score, reasons, updatedAt: now() };
}

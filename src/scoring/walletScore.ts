import { Env } from '../config/env.js';
import { WalletFeature, WalletScore } from '../types/domain.js';
import { clamp } from '../utils/math.js';
import { now } from '../utils/time.js';

/** Weighted wallet score (0-100)
 * consistency 25%, pnl quality 20%, win rate 15%, drawdown control 15%, concentration penalty 10%, recency 15%.
 */
export function computeWalletScore(feature: WalletFeature, _env: Env): WalletScore {
  const consistency = feature.consistency * 0.25;
  const pnlQuality = clamp(50 + feature.realizedPnlProxy * 10 + feature.medianRoiProxy * 2, 0, 100) * 0.2;
  const winRate = clamp(feature.winRateProxy, 0, 100) * 0.15;
  const drawdownControl = clamp(100 - feature.drawdownProxy * 3, 0, 100) * 0.15;
  const concentrationPenalty = clamp(100 - feature.concentrationRisk * 120, 0, 100) * 0.1;
  const recency = clamp(feature.recencyScore, 0, 100) * 0.15;

  const score = clamp(consistency + pnlQuality + winRate + drawdownControl + concentrationPenalty + recency, 0, 100);
  const confidence = clamp((feature.observedTrades / 25) * 100, 0, 100);

  const reasons = [
    `consistency=${feature.consistency.toFixed(1)}`,
    `winRateProxy=${feature.winRateProxy.toFixed(1)}`,
    `drawdownProxy=${feature.drawdownProxy.toFixed(1)}`,
    `observedTrades=${feature.observedTrades}`
  ];

  return { wallet: feature.wallet, score, confidence, reasons, updatedAt: now() };
}

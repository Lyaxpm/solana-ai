import { Env } from '../config/env.js';
import { CoinScore, WalletScore } from '../types/domain.js';

export function canEnter(params: {
  env: Env;
  walletScore: WalletScore;
  coinScore: CoinScore;
  openPositions: number;
  estSlippageBps: number;
  estFeeUsd: number;
  positionUsd: number;
  dataFresh: boolean;
  blacklisted: boolean;
  killSwitch: boolean;
  dailyLossHit: boolean;
}): { ok: boolean; reasons: string[] } {
  const r: string[] = [];
  const { env } = params;
  const ok =
    !params.killSwitch &&
    !params.dailyLossHit &&
    params.walletScore.score >= env.WALLET_SCORE_THRESHOLD &&
    params.coinScore.score >= env.COIN_SCORE_THRESHOLD &&
    params.openPositions < env.MAX_OPEN_POSITIONS &&
    !params.blacklisted &&
    params.estSlippageBps <= env.MAX_SLIPPAGE_BPS &&
    params.estFeeUsd <= Math.max(0.2, params.positionUsd * 0.03) &&
    params.dataFresh &&
    params.positionUsd > 0;

  if (params.killSwitch) r.push('kill switch active');
  if (params.dailyLossHit) r.push('daily loss halt active');
  if (params.walletScore.score < env.WALLET_SCORE_THRESHOLD) r.push('wallet score below threshold');
  if (params.coinScore.score < env.COIN_SCORE_THRESHOLD) r.push('coin score below threshold');
  if (params.openPositions >= env.MAX_OPEN_POSITIONS) r.push('max open positions reached');
  if (params.blacklisted) r.push('token blacklisted');
  if (params.estSlippageBps > env.MAX_SLIPPAGE_BPS) r.push('slippage too high');
  if (params.estFeeUsd > Math.max(0.2, params.positionUsd * 0.03)) r.push('fees too high for tiny capital');
  if (!params.dataFresh) r.push('data stale');
  if (params.positionUsd <= 0) r.push('position size is zero');

  if (ok) r.push('all entry guardrails passed');
  return { ok, reasons: r };
}

import { Env } from '../config/env.js';

export function computePositionSizeUsd(balanceUsd: number, env: Env): number {
  const capSafeBudget = Math.max(0, balanceUsd * 0.2);
  return Math.max(0, Math.min(env.MAX_POSITION_USD, capSafeBudget));
}

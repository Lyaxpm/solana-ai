import { Env } from '../config/env.js';
import { Position } from '../types/domain.js';

export function shouldExit(position: Position, currentPriceUsd: number, env: Env, nowTs: number): { exit: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const pnlPct = ((currentPriceUsd - position.entryPriceUsd) / position.entryPriceUsd) * 100;
  if (pnlPct <= -env.HARD_STOP_PCT) reasons.push('hard stop loss triggered');
  if (pnlPct >= env.TAKE_PROFIT_PCT) reasons.push('take profit triggered');
  const holdMin = (nowTs - position.openedAt) / 60000;
  if (holdMin >= env.MAX_HOLD_MINUTES) reasons.push('max hold time reached');
  return { exit: reasons.length > 0, reasons };
}

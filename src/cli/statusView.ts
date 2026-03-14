import { Env } from '../config/env.js';

export const riskSummary = (env: Env): string => [
  `[MODE] ${env.LIVE_TRADING ? 'LIVE' : 'PAPER'}`,
  `[RISK] max_open_positions=${env.MAX_OPEN_POSITIONS}`,
  `[RISK] max_position_usd=${env.MAX_POSITION_USD}`,
  `[RISK] max_daily_loss_usd=${env.MAX_DAILY_LOSS_USD}`,
  `[RISK] min_liquidity=${env.MIN_LIQUIDITY_USD}`,
  `[RISK] min_volume_5m=${env.MIN_VOLUME_5M_USD}`,
  `[RISK] max_slippage_bps=${env.MAX_SLIPPAGE_BPS}`
].join('\n');

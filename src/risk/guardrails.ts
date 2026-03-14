import { Env } from '../config/env.js';

export function guardrailReject(params: {
  env: Env;
  balanceUsd: number;
  reserveSol: number;
  estFeeUsd: number;
  dataFresh: boolean;
}): string[] {
  const r: string[] = [];
  if (params.env.KILL_SWITCH) r.push('kill switch active');
  if (params.balanceUsd < 1) r.push('account balance too low');
  if (params.reserveSol < params.env.RESERVE_SOL_MIN) r.push('reserve SOL too low');
  if (params.estFeeUsd > 0.5) r.push('fee too high for tiny account');
  if (!params.dataFresh) r.push('stale data');
  return r;
}

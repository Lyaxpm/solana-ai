import { Env } from '../config/env.js';
import { CoinScore, SignalDecision, WalletScore } from '../types/domain.js';
import { id } from '../utils/ids.js';
import { now } from '../utils/time.js';

export function buildSignal(wallet: WalletScore, coin: CoinScore, decision: 'BUY' | 'SKIP', reasons: string[]): SignalDecision {
  return {
    id: id(),
    wallet: wallet.wallet,
    mint: coin.mint,
    walletScore: wallet.score,
    coinScore: coin.score,
    decision,
    reasons,
    createdAt: now()
  };
}

export function conservativeMode(_env: Env): string {
  return 'Conservative tiny-capital mode: prefer skip over weak setup.';
}

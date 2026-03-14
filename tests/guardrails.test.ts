import { describe, expect, it } from 'vitest';
import { guardrailReject } from '../src/risk/guardrails.js';

describe('guardrail rejection', () => {
  it('rejects unsafe conditions', () => {
    const env = { KILL_SWITCH: true, RESERVE_SOL_MIN: 0.05 } as any;
    const reasons = guardrailReject({ env, balanceUsd: 0.5, reserveSol: 0.01, estFeeUsd: 0.8, dataFresh: false });
    expect(reasons).toContain('kill switch active');
    expect(reasons).toContain('account balance too low');
    expect(reasons).toContain('reserve SOL too low');
  });
});

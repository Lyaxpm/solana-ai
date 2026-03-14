import { describe, expect, it } from 'vitest';
import { computePositionSizeUsd } from '../src/strategy/sizing.js';

describe('position sizing', () => {
  it('caps size by max position and budget fraction', () => {
    const env = { MAX_POSITION_USD: 2 } as any;
    expect(computePositionSizeUsd(10, env)).toBe(2);
    expect(computePositionSizeUsd(4, env)).toBe(0.8);
  });
});

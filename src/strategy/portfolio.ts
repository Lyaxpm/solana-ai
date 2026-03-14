import { Position } from '../types/domain.js';

export const exposureUsd = (positions: Position[]): number => positions.reduce((a, p) => a + p.currentPriceUsd * p.qty, 0);

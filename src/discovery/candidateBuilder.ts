import { TokenCandidate } from '../types/domain.js';

export const buildCandidates = (tokens: TokenCandidate[]): TokenCandidate[] => {
  return tokens
    .filter((t) => !t.suspicious)
    .sort((a, b) => b.volume5mUsd - a.volume5mUsd)
    .slice(0, 30);
};

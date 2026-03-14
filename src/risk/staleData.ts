export const isFresh = (timestamp: number, maxAgeMs: number): boolean => (Date.now() - timestamp) <= maxAgeMs;

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
export const pct = (value: number, total: number): number => (total <= 0 ? 0 : (value / total) * 100);

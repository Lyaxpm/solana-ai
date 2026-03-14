export const now = (): number => Date.now();
export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

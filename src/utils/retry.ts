export async function withRetry<T>(fn: () => Promise<T>, retries = 2, backoffMs = 400): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (i + 1)));
      }
    }
  }
  throw lastErr;
}

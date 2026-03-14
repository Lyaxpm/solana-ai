import { AppLogger } from '../cli/logger.js';
import { Env } from '../config/env.js';
import { DexScreenerClient, HeliusClient, JupiterClient, SolanaRpcClient } from '../types/api.js';

export async function runHealthChecks(
  env: Env,
  deps: { solana: SolanaRpcClient; dex: DexScreenerClient; helius: HeliusClient; jupiter: JupiterClient },
  logger: AppLogger
): Promise<{ canTrade: boolean }> {
  const solanaOk = await deps.solana.ping();
  const dexOk = (await deps.dex.fetchTrendingSolanaPairs()).length >= 0;
  const heliusOk = env.HELIUS_API_KEY ? await deps.helius.ping() : true;
  const jupOk = env.JUPITER_API_KEY ? await deps.jupiter.ping() : true;

  logger.info({ solanaOk, dexOk, heliusOk, jupOk }, 'startup checks');
  const canTrade = solanaOk && dexOk;
  return { canTrade };
}

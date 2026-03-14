import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  SOLANA_RPC_URL: z.string().url().default('https://api.mainnet-beta.solana.com'),
  HELIUS_API_KEY: z.string().optional().default(''),
  JUPITER_API_KEY: z.string().optional().default(''),
  BOT_PRIVATE_KEY: z.string().optional().default(''),
  LIVE_TRADING: z.coerce.boolean().default(false),
  PAPER_TRADING: z.coerce.boolean().default(true),
  KILL_SWITCH: z.coerce.boolean().default(false),
  TOTAL_CAPITAL_USD: z.coerce.number().positive().default(10),
  MAX_OPEN_POSITIONS: z.coerce.number().int().positive().default(1),
  MAX_POSITION_USD: z.coerce.number().positive().default(2),
  MAX_DAILY_LOSS_USD: z.coerce.number().positive().default(1),
  RESERVE_SOL_MIN: z.coerce.number().nonnegative().default(0.02),
  MIN_LIQUIDITY_USD: z.coerce.number().nonnegative().default(15000),
  MIN_VOLUME_5M_USD: z.coerce.number().nonnegative().default(2500),
  MAX_SLIPPAGE_BPS: z.coerce.number().nonnegative().default(180),
  WALLET_SCORE_THRESHOLD: z.coerce.number().min(0).max(100).default(70),
  COIN_SCORE_THRESHOLD: z.coerce.number().min(0).max(100).default(70),
  HARD_STOP_PCT: z.coerce.number().positive().default(10),
  TAKE_PROFIT_PCT: z.coerce.number().positive().default(15),
  TRAILING_STOP_PCT: z.coerce.number().positive().default(8),
  MAX_HOLD_MINUTES: z.coerce.number().int().positive().default(180),
  SCAN_INTERVAL_SECONDS: z.coerce.number().int().positive().default(60),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),
  DB_PATH: z.string().default('./bot.sqlite'),
  BOT_WALLET_ADDRESS: z.string().default('paper-wallet')
});

export type Env = z.infer<typeof schema>;

export function loadEnv(): Env {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment: ${msg}`);
  }
  const env = parsed.data;
  if (env.LIVE_TRADING && !env.BOT_PRIVATE_KEY) {
    throw new Error('LIVE_TRADING=true requires BOT_PRIVATE_KEY');
  }
  if (env.LIVE_TRADING && env.PAPER_TRADING) {
    throw new Error('Set PAPER_TRADING=false when LIVE_TRADING=true to avoid ambiguous mode');
  }
  return env;
}

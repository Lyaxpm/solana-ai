import { printBanner } from './cli/banner.js';
import { createLogger } from './cli/logger.js';
import { riskSummary } from './cli/statusView.js';
import { loadEnv } from './config/env.js';
import { openDb } from './db/sqlite.js';
import { runMigrations } from './db/migrations.js';
import { DiscoveredTokensRepo } from './db/repositories/discoveredTokensRepo.js';
import { DiscoveredWalletsRepo } from './db/repositories/discoveredWalletsRepo.js';
import { WalletScoresRepo } from './db/repositories/walletScoresRepo.js';
import { CoinScoresRepo } from './db/repositories/coinScoresRepo.js';
import { SignalsRepo } from './db/repositories/signalsRepo.js';
import { TradesRepo } from './db/repositories/tradesRepo.js';
import { PositionsRepo } from './db/repositories/positionsRepo.js';
import { DexScreenerCollector } from './collectors/dexscreener.js';
import { HeliusCollector } from './collectors/helius.js';
import { JupiterCollector } from './collectors/jupiter.js';
import { SolanaRpcCollector } from './collectors/solanaRpc.js';
import { runHealthChecks } from './risk/healthChecks.js';
import { TrendingTokensDiscovery } from './discovery/trendingTokens.js';
import { WalletDiscovery } from './discovery/walletDiscovery.js';
import { WalletActivityService } from './discovery/walletActivity.js';
import { PaperBroker } from './execution/paperBroker.js';
import { LiveBroker } from './execution/liveBroker.js';
import { Trader } from './execution/trader.js';
import { Monitor } from './services/monitor.js';
import { Scheduler } from './services/scheduler.js';
import { Orchestrator } from './services/orchestrator.js';

async function main(): Promise<void> {
  printBanner();
  const env = loadEnv();
  const logger = createLogger(env);

  logger.info('env validated');
  const db = openDb(env.DB_PATH);
  runMigrations(db);
  logger.info('database initialized');

  const solana = new SolanaRpcCollector(env.SOLANA_RPC_URL);
  const dex = new DexScreenerCollector();
  const helius = new HeliusCollector(env.HELIUS_API_KEY);
  const jupiter = new JupiterCollector(env.JUPITER_API_KEY);

  const health = await runHealthChecks(env, { solana, dex, helius, jupiter }, logger);
  const mode = env.LIVE_TRADING ? 'LIVE' : 'PAPER';
  logger.info({ mode }, 'active mode');
  logger.info(`\n${riskSummary(env)}`);

  if (env.LIVE_TRADING) {
    const balanceSol = await solana.getBalance(env.BOT_WALLET_ADDRESS);
    logger.info({ balanceSol }, 'wallet balance check');
    if (balanceSol < env.RESERVE_SOL_MIN) {
      logger.error('fee reserve too low - stopping in fail-closed mode');
      process.exit(1);
    }
  }

  const broker = env.LIVE_TRADING ? new LiveBroker(env, jupiter) : new PaperBroker(env.TOTAL_CAPITAL_USD);
  const trader = new Trader(broker, new TradesRepo(db), new PositionsRepo(db), logger);
  const orchestrator = new Orchestrator(
    env,
    logger,
    {
      tokens: new TrendingTokensDiscovery(dex),
      wallets: new WalletDiscovery(helius),
      activity: new WalletActivityService()
    },
    {
      tokens: new DiscoveredTokensRepo(db),
      wallets: new DiscoveredWalletsRepo(db),
      walletScores: new WalletScoresRepo(db),
      coinScores: new CoinScoresRepo(db),
      positions: new PositionsRepo(db),
      signals: new SignalsRepo(db)
    },
    broker,
    trader,
    new Monitor(db),
    new Scheduler()
  );

  const shutdown = (): void => {
    logger.warn('shutdown signal received');
    orchestrator.stop();
    db.close();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await orchestrator.start(health.canTrade);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('fatal startup error', err);
  process.exit(1);
});

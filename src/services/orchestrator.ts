import { AppLogger } from '../cli/logger.js';
import { renderLoopSummary, renderStrategyDecision } from '../cli/renderers.js';
import { Env } from '../config/env.js';
import { DiscoveredTokensRepo } from '../db/repositories/discoveredTokensRepo.js';
import { DiscoveredWalletsRepo } from '../db/repositories/discoveredWalletsRepo.js';
import { WalletScoresRepo } from '../db/repositories/walletScoresRepo.js';
import { CoinScoresRepo } from '../db/repositories/coinScoresRepo.js';
import { PositionsRepo } from '../db/repositories/positionsRepo.js';
import { SignalsRepo } from '../db/repositories/signalsRepo.js';
import { Monitor } from './monitor.js';
import { TrendingTokensDiscovery } from '../discovery/trendingTokens.js';
import { WalletDiscovery } from '../discovery/walletDiscovery.js';
import { WalletActivityService } from '../discovery/walletActivity.js';
import { buildCandidates } from '../discovery/candidateBuilder.js';
import { deriveCoinFeature } from '../scoring/features.js';
import { computeWalletScore } from '../scoring/walletScore.js';
import { computeCoinScore } from '../scoring/coinScore.js';
import { buildSignal } from '../strategy/engine.js';
import { canEnter } from '../strategy/entry.js';
import { shouldExit } from '../strategy/exit.js';
import { computePositionSizeUsd } from '../strategy/sizing.js';
import { Broker } from '../execution/broker.js';
import { Trader } from '../execution/trader.js';
import { isFresh } from '../risk/staleData.js';
import { STALE_DATA_MS } from '../config/constants.js';
import { Scheduler } from './scheduler.js';
import { guardrailReject } from '../risk/guardrails.js';

export class Orchestrator {
  private running = true;

  constructor(
    private readonly env: Env,
    private readonly logger: AppLogger,
    private readonly discovery: { tokens: TrendingTokensDiscovery; wallets: WalletDiscovery; activity: WalletActivityService },
    private readonly repos: {
      tokens: DiscoveredTokensRepo;
      wallets: DiscoveredWalletsRepo;
      walletScores: WalletScoresRepo;
      coinScores: CoinScoresRepo;
      positions: PositionsRepo;
      signals: SignalsRepo;
    },
    private readonly broker: Broker,
    private readonly trader: Trader,
    private readonly monitor: Monitor,
    private readonly scheduler: Scheduler
  ) {}

  stop(): void { this.running = false; }

  async start(canTrade = true): Promise<void> {
    while (this.running) {
      let tradesEntered = 0;
      let tradesExited = 0;

      const rawTokens = await this.discovery.tokens.run();
      const candidates = buildCandidates(rawTokens);
      this.repos.tokens.upsertMany(candidates);

      const wallets = await this.discovery.wallets.run(candidates.slice(0, 10));
      for (const wallet of wallets) this.repos.wallets.upsert(wallet, 5, Date.now());

      for (const wallet of wallets) {
        const wf = await this.discovery.activity.buildFeatures(wallet);
        this.repos.walletScores.saveFeature(wf);
        const ws = computeWalletScore(wf, this.env);
        this.repos.walletScores.saveScore(ws);
      }

      for (const token of candidates) {
        const cf = deriveCoinFeature(token);
        this.repos.coinScores.saveFeature(cf);
        this.repos.coinScores.saveScore(computeCoinScore(cf, this.env));
      }

      const openPositions = await this.broker.getPositions();

      for (const wallet of wallets.slice(0, 3)) {
        const ws = this.repos.walletScores.get(wallet);
        const token = candidates[0];
        if (!ws || !token) continue;
        const cs = this.repos.coinScores.get(token.mint);
        if (!cs) continue;

        const quote = { estSlippageBps: Math.max(40, 25000 / token.liquidityUsd), feeUsd: 0.07 };
        const balance = await this.broker.getBalance();
        const sizeUsd = computePositionSizeUsd(balance, this.env);
        const stale = isFresh(token.fetchedAt, STALE_DATA_MS);
        const hardReject = guardrailReject({ env: this.env, balanceUsd: balance, reserveSol: 0.25, estFeeUsd: quote.feeUsd, dataFresh: stale });
        const entry = canEnter({
          env: this.env,
          walletScore: ws,
          coinScore: cs,
          openPositions: openPositions.length,
          estSlippageBps: quote.estSlippageBps,
          estFeeUsd: quote.feeUsd,
          positionUsd: sizeUsd,
          dataFresh: stale,
          blacklisted: false,
          killSwitch: this.env.KILL_SWITCH,
          dailyLossHit: false
        });

        const reasons = [...hardReject, ...entry.reasons];
        const decision = hardReject.length === 0 && entry.ok && canTrade ? 'BUY' : 'SKIP';
        const signal = buildSignal(ws, cs, decision, reasons);
        this.repos.signals.save(signal);
        this.logger.info(`\n${renderStrategyDecision(signal)}`);

        if (decision === 'BUY') {
          await this.trader.enter(token.mint, wallet, sizeUsd, quote.estSlippageBps, quote.feeUsd);
          tradesEntered += 1;
        }
      }

      for (const p of openPositions) {
        const evaluation = shouldExit(p, p.currentPriceUsd * (1 + (Math.random() - 0.5) * 0.08), this.env, Date.now());
        if (evaluation.exit) {
          await this.trader.exit(p, 90, 0.07);
          tradesExited += 1;
          this.logger.info({ reasons: evaluation.reasons, positionId: p.id }, 'exit conditions met');
        }
      }

      const pnl = await this.broker.snapshotPnl();
      const snapshot = {
        balanceUsd: await this.broker.getBalance(),
        realizedPnlUsd: pnl.realizedPnlUsd,
        unrealizedPnlUsd: pnl.unrealizedPnlUsd,
        openPositions: (await this.broker.getPositions()).length
      };
      this.monitor.saveSnapshot(snapshot);

      this.logger.info(renderLoopSummary({
        tokensScanned: candidates.length,
        walletsEvaluated: wallets.length,
        signalsGenerated: Math.min(wallets.length, 3),
        tradesEntered,
        tradesExited,
        snapshot,
        nextScanSec: this.env.SCAN_INTERVAL_SECONDS
      }));

      await this.scheduler.waitNext(this.env.SCAN_INTERVAL_SECONDS);
    }
  }
}

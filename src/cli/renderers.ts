import chalk from 'chalk';
import Table from 'cli-table3';
import { PortfolioSnapshot, SignalDecision } from '../types/domain.js';
import { fmtUsd } from '../utils/format.js';

export const renderStrategyDecision = (signal: SignalDecision): string => {
  const color = signal.decision === 'BUY' ? chalk.green : chalk.yellow;
  return [
    chalk.magenta('[STRATEGY]'),
    `Wallet: ${signal.walletScore.toFixed(1)}/100`,
    `Coin: ${signal.coinScore.toFixed(1)}/100`,
    `Decision: ${color(signal.decision)}`,
    'Reasons:',
    ...signal.reasons.map((r) => `- ${r}`)
  ].join('\n');
};

export const renderLoopSummary = (summary: {
  tokensScanned: number;
  walletsEvaluated: number;
  signalsGenerated: number;
  tradesEntered: number;
  tradesExited: number;
  snapshot: PortfolioSnapshot;
  nextScanSec: number;
}): string => {
  const table = new Table({ head: ['Metric', 'Value'] });
  table.push(
    ['tokens scanned', summary.tokensScanned],
    ['wallets evaluated', summary.walletsEvaluated],
    ['signals generated', summary.signalsGenerated],
    ['trades entered', summary.tradesEntered],
    ['trades exited', summary.tradesExited],
    ['open positions', summary.snapshot.openPositions],
    ['realized pnl', fmtUsd(summary.snapshot.realizedPnlUsd)],
    ['unrealized pnl', fmtUsd(summary.snapshot.unrealizedPnlUsd)],
    ['balance', fmtUsd(summary.snapshot.balanceUsd)],
    ['next scan', `${summary.nextScanSec}s`]
  );
  return `\n${chalk.blue('[LOOP SUMMARY]')}\n${table.toString()}\n`;
};

import { AppLogger } from '../cli/logger.js';
import { PositionsRepo } from '../db/repositories/positionsRepo.js';
import { TradesRepo } from '../db/repositories/tradesRepo.js';
import { Broker } from './broker.js';

export class Trader {
  constructor(
    private readonly broker: Broker,
    private readonly tradesRepo: TradesRepo,
    private readonly positionsRepo: PositionsRepo,
    private readonly logger: AppLogger
  ) {}

  async enter(mint: string, sourceWallet: string, amountUsd: number, estSlippageBps: number, feeUsd: number): Promise<boolean> {
    const { trade, position } = await this.broker.placeBuy({ mint, amountUsd, estSlippageBps, feeUsd, sourceWallet });
    this.tradesRepo.save(trade);
    this.positionsRepo.save(position);
    this.logger.info({ mint, amountUsd }, 'trade entered');
    return true;
  }

  async exit(position: { id: string; mint: string; qty: number; entryPriceUsd: number; currentPriceUsd: number; openedAt: number; sourceWallet: string }, estSlippageBps: number, feeUsd: number): Promise<boolean> {
    const { trade } = await this.broker.placeSell({ position, estSlippageBps, feeUsd });
    this.tradesRepo.save(trade);
    this.positionsRepo.close(position.id);
    this.logger.info({ mint: position.mint, positionId: position.id }, 'trade exited');
    return true;
  }
}

import Database from 'better-sqlite3';

export class DiscoveredWalletsRepo {
  constructor(private readonly db: Database.Database) {}

  upsert(wallet: string, observations: number, updatedAt: number): void {
    this.db.prepare(`
      INSERT INTO discovered_wallets (wallet, observations, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(wallet) DO UPDATE SET observations=excluded.observations, updated_at=excluded.updated_at
    `).run(wallet, observations, updatedAt);
  }

  list(minObservations = 1): string[] {
    return this.db.prepare('SELECT wallet FROM discovered_wallets WHERE observations >= ? ORDER BY updated_at DESC').all(minObservations).map((r: any) => r.wallet);
  }
}

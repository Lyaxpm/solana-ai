import Database from 'better-sqlite3';
import { id } from '../../utils/ids.js';

export class RiskEventsRepo {
  constructor(private readonly db: Database.Database) {}
  record(eventType: string, message: string, createdAt: number): void {
    this.db.prepare('INSERT INTO risk_events (id, event_type, message, created_at) VALUES (?, ?, ?, ?)').run(id(), eventType, message, createdAt);
  }
}

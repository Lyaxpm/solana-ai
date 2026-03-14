import Database from 'better-sqlite3';
import { schemaSql } from './schema.js';

export function runMigrations(db: Database.Database): void {
  db.exec(schemaSql);
}

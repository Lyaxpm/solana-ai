import Database from 'better-sqlite3';

export function openDb(path: string): Database.Database {
  return new Database(path);
}

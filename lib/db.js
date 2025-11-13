import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      // Uncomment line 12 and comment line 13 for development environment
      // filename: path.join(process.cwd(), 'data', 'database.sqlite'),
      filename: '/app/data/database.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}
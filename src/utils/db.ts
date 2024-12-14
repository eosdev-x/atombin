import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export const initDatabase = async () => {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  // Create pastes table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      language TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `);
  
  return db;
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};

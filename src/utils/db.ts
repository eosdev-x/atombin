import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
const DB_NAME = 'atombin_db';

const saveToIndexedDB = async (data: Uint8Array) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('sqlitedb', 'readwrite');
      const store = tx.objectStore('sqlitedb');
      store.put(data, 'dbstate');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('sqlitedb');
    };
  });
};

const loadFromIndexedDB = async (): Promise<Uint8Array | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('sqlitedb', 'readonly');
      const store = tx.objectStore('sqlitedb');
      const getRequest = store.get('dbstate');
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('sqlitedb');
    };
  });
};

export const initDatabase = async () => {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  // Try to load existing database
  const savedData = await loadFromIndexedDB();
  
  if (savedData) {
    try {
      db = new SQL.Database(savedData);
    } catch (error) {
      console.error('Error loading saved database:', error);
      db = new SQL.Database(); // Create new if loading fails
    }
  } else {
    db = new SQL.Database();
  }
  
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

// Save database state after each operation
export const saveDatabase = async () => {
  if (!db) return;
  const data = db.export();
  await saveToIndexedDB(data);
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};

import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
const DB_NAME = 'atombin_db';

const saveToIndexedDB = async (data: Uint8Array) => {
  console.log('Saving database to IndexedDB, size:', data.length);
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
      reject(request.error);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('sqlitedb', 'readwrite');
      const store = tx.objectStore('sqlitedb');
      store.put(data, 'dbstate');
      tx.oncomplete = () => {
        console.log('Database saved successfully');
        resolve();
      };
      tx.onerror = (event) => {
        console.error('Error in transaction:', event);
        reject(tx.error);
      };
    };

    request.onupgradeneeded = (event) => {
      console.log('Creating IndexedDB store');
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('sqlitedb');
    };
  });
};

const loadFromIndexedDB = async (): Promise<Uint8Array | null> => {
  console.log('Loading database from IndexedDB');
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
      reject(request.error);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('sqlitedb', 'readonly');
      const store = tx.objectStore('sqlitedb');
      const getRequest = store.get('dbstate');
      getRequest.onsuccess = () => {
        console.log('Database loaded, exists:', !!getRequest.result);
        resolve(getRequest.result || null);
      };
      getRequest.onerror = (event) => {
        console.error('Error getting database:', event);
        reject(getRequest.error);
      };
    };

    request.onupgradeneeded = (event) => {
      console.log('Creating IndexedDB store');
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('sqlitedb');
    };
  });
};

export const initDatabase = async () => {
  if (db) {
    console.log('Using existing database instance');
    return db;
  }
  
  console.log('Initializing new database');
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  // Try to load existing database
  const savedData = await loadFromIndexedDB();
  
  if (savedData) {
    try {
      console.log('Creating database from saved data');
      db = new SQL.Database(savedData);
    } catch (error) {
      console.error('Error loading saved database:', error);
      console.log('Creating new empty database');
      db = new SQL.Database();
    }
  } else {
    console.log('No saved data found, creating new database');
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

  // Debug: Check if table exists and has data
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables in database:', tables);
  const count = db.exec('SELECT COUNT(*) FROM pastes');
  console.log('Number of pastes:', count);
  
  return db;
};

// Save database state after each operation
export const saveDatabase = async () => {
  if (!db) {
    console.warn('No database instance to save');
    return;
  }
  console.log('Exporting database');
  const data = db.export();
  console.log('Saving database, size:', data.length);
  await saveToIndexedDB(data);
};

export const closeDatabase = () => {
  if (db) {
    console.log('Closing database');
    db.close();
    db = null;
  }
};

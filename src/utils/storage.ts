import { nanoid } from 'nanoid';
import type { Paste } from '../types/paste';
import { initDatabase, saveDatabase } from './db';

const EXPIRATION_HOURS = 24;

export const createPaste = async (content: string, language: string): Promise<Paste> => {
  console.log('Creating new paste with language:', language);
  const now = Date.now();
  const paste: Paste = {
    id: nanoid(10),
    content,
    language,
    createdAt: now,
    expiresAt: now + (EXPIRATION_HOURS * 60 * 60 * 1000)
  };

  const db = await initDatabase();
  console.log('Inserting paste:', paste.id);
  db.run(
    'INSERT INTO pastes (id, content, language, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    [paste.id, paste.content, paste.language, paste.createdAt, paste.expiresAt]
  );
  
  // Save database state after creating paste
  console.log('Saving database after insert');
  await saveDatabase();
  
  return paste;
};

export const getPasteById = async (id: string): Promise<Paste | null> => {
  console.log('Getting paste by id:', id);
  const db = await initDatabase();
  console.log('Running select query');
  const result = db.exec(
    'SELECT * FROM pastes WHERE id = ? AND expires_at > ?',
    [id, Date.now()]
  );
  
  console.log('Query result:', result);
  if (!result.length || !result[0].values.length) {
    console.log('No paste found or expired');
    return null;
  }
  
  const row = result[0].values[0];
  console.log('Found paste:', row);
  return {
    id: String(row[0]),
    content: String(row[1]),
    language: String(row[2]),
    createdAt: Number(row[3]),
    expiresAt: Number(row[4])
  };
};

export const deletePaste = async (id: string): Promise<void> => {
  console.log('Deleting paste:', id);
  const db = await initDatabase();
  db.run('DELETE FROM pastes WHERE id = ?', [id]);
  
  // Save database state after deleting paste
  console.log('Saving database after delete');
  await saveDatabase();
};

export const getAllPastes = async (): Promise<Paste[]> => {
  try {
    console.log('Getting all non-expired pastes');
    const db = await initDatabase();
    const result = db.exec(
      'SELECT * FROM pastes WHERE expires_at > ? ORDER BY created_at DESC',
      [Date.now()]
    );
    
    if (!result.length) {
      console.log('No pastes found');
      return [];
    }
    
    console.log('Found pastes:', result[0].values.length);
    return result[0].values.map(row => ({
      id: String(row[0]),
      content: String(row[1]),
      language: String(row[2]),
      createdAt: Number(row[3]),
      expiresAt: Number(row[4])
    }));
  } catch (error) {
    console.error('Error getting pastes:', error);
    return [];
  }
};
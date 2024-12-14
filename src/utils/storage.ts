import { nanoid } from 'nanoid';
import type { Paste } from '../types/paste';
import { initDatabase } from './db';

const EXPIRATION_HOURS = 24;

export const createPaste = async (content: string, language: string): Promise<Paste> => {
  const now = Date.now();
  const paste: Paste = {
    id: nanoid(10),
    content,
    language,
    createdAt: now,
    expiresAt: now + (EXPIRATION_HOURS * 60 * 60 * 1000)
  };

  const db = await initDatabase();
  db.run(
    'INSERT INTO pastes (id, content, language, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    [paste.id, paste.content, paste.language, paste.createdAt, paste.expiresAt]
  );
  
  return paste;
};

export const getPasteById = async (id: string): Promise<Paste | null> => {
  const db = await initDatabase();
  const result = db.exec(
    'SELECT * FROM pastes WHERE id = ? AND expires_at > ?',
    [id, Date.now()]
  );
  
  if (!result.length || !result[0].values.length) return null;
  
  const [pasteId, content, language, createdAt, expiresAt] = result[0].values[0];
  return {
    id: pasteId,
    content,
    language,
    createdAt,
    expiresAt
  };
};

export const deletePaste = async (id: string): Promise<void> => {
  const db = await initDatabase();
  db.run('DELETE FROM pastes WHERE id = ?', [id]);
};

export const getAllPastes = async (): Promise<Paste[]> => {
  try {
    const db = await initDatabase();
    const result = db.exec(
      'SELECT * FROM pastes WHERE expires_at > ? ORDER BY created_at DESC',
      [Date.now()]
    );
    
    if (!result.length) return [];
    
    return result[0].values.map(([id, content, language, createdAt, expiresAt]) => ({
      id,
      content,
      language,
      createdAt,
      expiresAt
    }));
  } catch (error) {
    console.error('Error getting pastes:', error);
    return [];
  }
};
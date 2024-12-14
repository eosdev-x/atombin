import { nanoid } from 'nanoid';
import type { Paste } from '../types/paste';

const STORAGE_KEY = 'pastebin_snippets';
const EXPIRATION_HOURS = 24;

export const createPaste = (content: string, language: string): Paste => {
  const now = Date.now();
  const paste: Paste = {
    id: nanoid(10),
    content,
    language,
    createdAt: now,
    expiresAt: now + (EXPIRATION_HOURS * 60 * 60 * 1000)
  };

  const existingPastes = getAllPastes();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingPastes, paste]));
  
  return paste;
};

export const getPasteById = (id: string): Paste | null => {
  const pastes = getAllPastes();
  const paste = pastes.find(p => p.id === id);
  
  if (!paste) return null;
  
  // Check if expired
  if (Date.now() > paste.expiresAt) {
    deletePaste(id);
    return null;
  }
  
  return paste;
};

export const deletePaste = (id: string): void => {
  const pastes = getAllPastes();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(pastes.filter(p => p.id !== id))
  );
};

export const getAllPastes = (): Paste[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
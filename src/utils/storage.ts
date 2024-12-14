import { nanoid } from 'nanoid';
import type { Paste } from '../types/paste';
import { supabase } from './supabase';

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

  const { error } = await supabase
    .from('pastes')
    .insert([{
      id: paste.id,
      content: paste.content,
      language: paste.language,
      created_at: paste.createdAt,
      expires_at: paste.expiresAt
    }]);

  if (error) {
    console.error('Error creating paste:', error);
    throw error;
  }

  return paste;
};

export const getPasteById = async (id: string): Promise<Paste | null> => {
  const { data, error } = await supabase
    .from('pastes')
    .select('*')
    .eq('id', id)
    .gt('expires_at', Date.now())
    .single();

  if (error) {
    console.error('Error getting paste:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    content: data.content,
    language: data.language,
    createdAt: data.created_at,
    expiresAt: data.expires_at
  };
};

export const deletePaste = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pastes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting paste:', error);
    throw error;
  }
};

export const getAllPastes = async (): Promise<Paste[]> => {
  const { data, error } = await supabase
    .from('pastes')
    .select('*')
    .gt('expires_at', Date.now())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting pastes:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    content: row.content,
    language: row.language,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  }));
};
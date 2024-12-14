import { nanoid } from 'nanoid';
import type { Paste } from '../types/paste';
import { supabase } from './supabase';

const EXPIRATION_HOURS = 24;

export const createPaste = async (content: string, language: string): Promise<Paste> => {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    const now = Date.now();
    const id = nanoid(10);
    
    const paste: Paste = {
      id,
      content: content.trim(),
      language,
      createdAt: now,
      expiresAt: now + (EXPIRATION_HOURS * 60 * 60 * 1000)
    };

    console.log('Creating paste:', {
      id: paste.id,
      contentLength: paste.content.length,
      language: paste.language,
      preview: paste.content.substring(0, 100) + '...'
    });

    const { data, error } = await supabase
      .from('pastes')
      .insert([{
        id: paste.id,
        content: paste.content,
        language: paste.language,
        created_at: new Date(paste.createdAt).toISOString(),
        expires_at: new Date(paste.expiresAt).toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating paste:', error);
      throw new Error(`Failed to create paste: ${error.message}`);
    }

    console.log('Successfully created paste:', {
      id: data.id,
      contentLength: data.content.length,
      language: data.language
    });

    return paste;
  } catch (err) {
    console.error('Error in createPaste:', err);
    throw err;
  }
};

export const getPasteById = async (id: string): Promise<Paste | null> => {
  const { data, error } = await supabase
    .from('pastes')
    .select('*')
    .eq('id', id)
    .gt('expires_at', new Date().toISOString())
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
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime()
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
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting pastes:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    content: row.content,
    language: row.language,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime()
  }));
};
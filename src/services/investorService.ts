
import { supabase } from '@/integrations/supabase/client';

// Types for tags and notes
export interface PitchTag {
  id: string;
  pitchId: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface PitchNote {
  id: string;
  pitchId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Save a tag for a pitch
export const addTagToPitch = async (pitchId: string, tagName: string): Promise<PitchTag | null> => {
  try {
    // For now, we'll use a client-side implementation
    // In a real application, this would be stored in Supabase
    const tagId = `${pitchId}-${tagName}-${Date.now()}`;
    const userId = (await supabase.auth.getUser()).data.user?.id || '';
    
    const newTag: PitchTag = {
      id: tagId,
      pitchId,
      userId,
      name: tagName,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage for demonstration
    const existingTags = JSON.parse(localStorage.getItem('pitchTags') || '[]');
    localStorage.setItem('pitchTags', JSON.stringify([...existingTags, newTag]));
    
    return newTag;
  } catch (error) {
    console.error('Error adding tag:', error);
    return null;
  }
};

// Get tags for a pitch
export const getTagsForPitch = async (pitchId: string): Promise<PitchTag[]> => {
  try {
    // For now, we'll use a client-side implementation
    const allTags = JSON.parse(localStorage.getItem('pitchTags') || '[]');
    return allTags.filter((tag: PitchTag) => tag.pitchId === pitchId);
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
};

// Remove a tag from a pitch
export const removeTagFromPitch = async (tagId: string): Promise<boolean> => {
  try {
    const existingTags = JSON.parse(localStorage.getItem('pitchTags') || '[]');
    const updatedTags = existingTags.filter((tag: PitchTag) => tag.id !== tagId);
    localStorage.setItem('pitchTags', JSON.stringify(updatedTags));
    return true;
  } catch (error) {
    console.error('Error removing tag:', error);
    return false;
  }
};

// Save a note for a pitch
export const addNoteToPitch = async (pitchId: string, content: string): Promise<PitchNote | null> => {
  try {
    // For now, we'll use a client-side implementation
    const noteId = `${pitchId}-${Date.now()}`;
    const userId = (await supabase.auth.getUser()).data.user?.id || '';
    
    const newNote: PitchNote = {
      id: noteId,
      pitchId,
      userId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for demonstration
    const existingNotes = JSON.parse(localStorage.getItem('pitchNotes') || '[]');
    localStorage.setItem('pitchNotes', JSON.stringify([...existingNotes, newNote]));
    
    return newNote;
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
};

// Get notes for a pitch
export const getNotesForPitch = async (pitchId: string): Promise<PitchNote[]> => {
  try {
    // For now, we'll use a client-side implementation
    const allNotes = JSON.parse(localStorage.getItem('pitchNotes') || '[]');
    return allNotes.filter((note: PitchNote) => note.pitchId === pitchId);
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

// Common predefined tags for investors
export const COMMON_TAGS = ['AI', 'Climate', 'Fintech', 'Health', 'EdTech', 'B2B', 'B2C', 'SaaS', 'Hardware', 'Marketplace'];

// Filter options
export const FUNDING_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];
export const REGIONS = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania', 'Global'];
export const INDUSTRIES = ['AI/ML', 'Climate Tech', 'Fintech', 'Health Tech', 'EdTech', 'Enterprise SaaS', 'Consumer', 'Hardware', 'Marketplace', 'Web3/Crypto'];

// Update multiple pitches status
export const updateMultiplePitchesStatus = async (pitchIds: string[], status: string): Promise<boolean> => {
  try {
    // In a real application, this would be a batch update operation in Supabase
    // For now, we'll simulate success
    console.log(`Updating ${pitchIds.length} pitches to status: ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating pitches:', error);
    return false;
  }
};


import { supabase } from '@/integrations/supabase/client';
import { Pitch } from './types/pitch';
import { mockPitches } from './mockData/pitchMockData';
import { transformDatabasePitchToPitch } from './utils/pitchUtils';

// Get all pitches
export const getPitches = async (): Promise<Pitch[]> => {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .select(`
        *,
        profiles:user_id (name, role)
      `);

    if (error) {
      console.error('Error fetching pitches:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform database records to Pitch interface
    return data.map(transformDatabasePitchToPitch);
  } catch (error) {
    console.error('Error in getPitches:', error);
    return [];
  }
};

// Get pitches filtered by the current user's email
export const getFounderPitches = async (userEmail: string): Promise<Pitch[]> => {
  try {
    // Get user from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return [];
    }
    
    // Get pitches by user_id
    const { data, error } = await supabase
      .from('pitches')
      .select(`
        *,
        profiles:user_id (name, role)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching founder pitches:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform database records to Pitch interface
    return data.map(pitch => {
      const transformed = transformDatabasePitchToPitch(pitch);
      // Use the provided userEmail for founder pitches
      return {
        ...transformed,
        email: userEmail
      };
    });
  } catch (error) {
    console.error('Error in getFounderPitches:', error);
    return [];
  }
};

// Get a single pitch by ID
export const getPitchById = async (id: string): Promise<Pitch | undefined> => {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .select(`
        *,
        profiles:user_id (name, role)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching pitch by ID:', error);
      // Fallback to mock data in case of error
      return mockPitches.find(pitch => pitch.id === id);
    }

    if (!data) {
      return mockPitches.find(pitch => pitch.id === id);
    }

    // Transform database record to Pitch interface
    return transformDatabasePitchToPitch(data);
  } catch (error) {
    console.error('Error in getPitchById:', error);
    return mockPitches.find(pitch => pitch.id === id);
  }
};

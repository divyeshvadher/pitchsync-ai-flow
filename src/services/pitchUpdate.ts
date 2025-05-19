
import { supabase } from '@/integrations/supabase/client';
import { Pitch } from './types/pitch';
import { getPitchById } from './pitchGet';

// Update pitch status
export const updatePitchStatus = async (id: string, status: Pitch['status']): Promise<Pitch> => {
  try {
    // Update status in Supabase
    const { data, error } = await supabase
      .from('pitches')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pitch status in Supabase:', error);
      throw error;
    }

    // Get the full pitch details after status update
    const updatedPitch = await getPitchById(id);
    if (!updatedPitch) {
      throw new Error(`Pitch with id ${id} not found after status update`);
    }

    return updatedPitch;
  } catch (error) {
    console.error('Error in updatePitchStatus:', error);
    throw error;
  }
};

// Get the founder's user_id for a specific pitch
export const getPitchFounderUserId = async (pitchId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .select('user_id')
      .eq('id', pitchId)
      .single();

    if (error) {
      console.error('Error getting founder user_id:', error);
      throw error;
    }

    return data?.user_id || null;
  } catch (error) {
    console.error('Error in getPitchFounderUserId:', error);
    return null;
  }
};

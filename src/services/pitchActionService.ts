
import { supabase } from '@/integrations/supabase/client';

export interface PitchAction {
  pitchId: string;
  action: 'shortlisted' | 'rejected' | 'forwarded';
  notes?: string;
}

export const submitPitchAction = async ({ pitchId, action, notes }: PitchAction) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get pitch details
    const { data: pitch, error: pitchError } = await supabase
      .from('pitches')
      .select('user_id, company_name')
      .eq('id', pitchId)
      .single();

    if (pitchError || !pitch) {
      throw new Error('Pitch not found');
    }

    // Update pitch status
    const { error: updateError } = await supabase
      .from('pitches')
      .update({ status: action })
      .eq('id', pitchId);

    if (updateError) {
      throw new Error('Failed to update pitch status');
    }

    // Send email notification to founder
    const { error: emailError } = await supabase.functions.invoke('send-pitch-action-notification', {
      body: {
        pitch_id: pitchId,
        action,
        investor_id: user.id,
        founder_id: pitch.user_id,
        company_name: pitch.company_name,
        notes
      }
    });

    if (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't throw error here as the main action succeeded
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting pitch action:', error);
    throw error;
  }
};

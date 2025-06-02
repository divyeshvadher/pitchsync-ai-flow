
import { supabase } from '@/integrations/supabase/client';

export interface PitchAction {
  pitchId: string;
  action: 'shortlisted' | 'rejected' | 'forwarded';
  notes?: string;
}

export const submitPitchAction = async ({ pitchId, action, notes }: PitchAction) => {
  try {
    console.log('Starting pitch action submission:', { pitchId, action, notes });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('User not authenticated');
    }
    console.log('Current user:', user.id);

    // Get pitch details including founder user_id and company_name
    const { data: pitch, error: pitchError } = await supabase
      .from('pitches')
      .select('user_id, company_name')
      .eq('id', pitchId)
      .single();

    if (pitchError || !pitch) {
      console.error('Pitch fetch error:', pitchError);
      throw new Error('Pitch not found');
    }
    console.log('Pitch details:', pitch);

    // Update pitch status first
    const { error: updateError } = await supabase
      .from('pitches')
      .update({ status: action })
      .eq('id', pitchId);

    if (updateError) {
      console.error('Pitch status update error:', updateError);
      throw new Error('Failed to update pitch status');
    }
    console.log('Pitch status updated successfully');

    // Send email notification to founder
    console.log('Invoking email notification function...');
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-pitch-action-notification', {
      body: {
        pitch_id: pitchId,
        action,
        investor_id: user.id,
        founder_id: pitch.user_id,
        company_name: pitch.company_name,
        notes: notes || null
      }
    });

    console.log('Email function response:', emailData);
    
    if (emailError) {
      console.error('Email function error:', emailError);
      // Don't throw error here as the main action succeeded
      console.warn('Email notification failed but pitch action was successful');
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting pitch action:', error);
    throw error;
  }
};

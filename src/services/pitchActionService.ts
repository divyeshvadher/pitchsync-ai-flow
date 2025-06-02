
import { supabase } from '@/integrations/supabase/client';

export interface PitchAction {
  pitchId: string;
  action: 'shortlisted' | 'rejected' | 'forwarded';
  notes?: string;
}

export const submitPitchAction = async ({ pitchId, action, notes }: PitchAction) => {
  try {
    console.log('=== STARTING PITCH ACTION SUBMISSION ===');
    console.log('Pitch ID:', pitchId);
    console.log('Action:', action);
    console.log('Notes:', notes);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('User not authenticated');
    }
    console.log('Current user ID:', user.id);

    // Get pitch details including founder user_id and company_name
    console.log('Fetching pitch details...');
    const { data: pitch, error: pitchError } = await supabase
      .from('pitches')
      .select('user_id, company_name')
      .eq('id', pitchId)
      .single();

    if (pitchError || !pitch) {
      console.error('Pitch fetch error:', pitchError);
      throw new Error('Pitch not found');
    }
    console.log('Pitch details found:', pitch);

    // Update pitch status first
    console.log('Updating pitch status...');
    const { error: updateError } = await supabase
      .from('pitches')
      .update({ status: action })
      .eq('id', pitchId);

    if (updateError) {
      console.error('Pitch status update error:', updateError);
      throw new Error('Failed to update pitch status');
    }
    console.log('Pitch status updated successfully to:', action);

    // Send email notification to founder
    console.log('=== SENDING EMAIL NOTIFICATION ===');
    const emailPayload = {
      pitch_id: pitchId,
      action,
      investor_id: user.id,
      founder_id: pitch.user_id,
      company_name: pitch.company_name,
      notes: notes || null
    };
    console.log('Email payload:', emailPayload);

    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-pitch-action-notification', {
      body: emailPayload
    });

    console.log('Email function response data:', emailData);
    console.log('Email function response error:', emailError);
    
    if (emailError) {
      console.error('=== EMAIL FUNCTION ERROR ===');
      console.error('Error details:', emailError);
      // Don't throw here - we want to show a warning but not fail the main action
      console.warn('Email notification failed but pitch action was successful');
      return { 
        success: true, 
        emailSent: false, 
        emailError: emailError.message || 'Email notification failed' 
      };
    }

    if (emailData?.error) {
      console.error('=== EMAIL FUNCTION RETURNED ERROR ===');
      console.error('Email error from function:', emailData.error);
      return { 
        success: true, 
        emailSent: false, 
        emailError: emailData.error 
      };
    }

    console.log('=== EMAIL NOTIFICATION SUCCESS ===');
    console.log('Email ID:', emailData?.emailId);
    
    return { 
      success: true, 
      emailSent: true, 
      emailId: emailData?.emailId 
    };
    
  } catch (error) {
    console.error('=== PITCH ACTION SUBMISSION ERROR ===');
    console.error('Error details:', error);
    throw error;
  }
};

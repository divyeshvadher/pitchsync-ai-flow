
import { supabase } from '@/integrations/supabase/client';
import { Pitch } from './types/pitch';
import { v4 as uuidv4 } from 'uuid';
import { extractAnswersForDatabase } from './utils/pitchUtils';

// Create a new pitch
export const createPitch = async (pitch: Omit<Pitch, 'id' | 'status' | 'createdAt' | 'aiSummary' | 'aiScore'>): Promise<Pitch> => {
  try {
    // Generate AI summary and score (in a real app, this would be done by an AI service)
    const aiSummary = `${pitch.companyName} is developing ${pitch.description} The founder is seeking ${pitch.fundingAmount} at ${pitch.fundingStage} stage.`;
    const aiScore = Math.floor(Math.random() * 30) + 65; // Random score between 65-95
    
    // Extract answers for database fields
    const { problem_statement, solution_description, traction, team_description, growth_projections } = extractAnswersForDatabase(pitch);

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Prepare data for Supabase
    const pitchData = {
      id: uuidv4(),
      company_name: pitch.companyName,
      company_description: pitch.description,
      industry: pitch.industry,
      location: pitch.location,
      funding_stage: pitch.fundingStage,
      funding_amount: parseFloat(pitch.fundingAmount.replace(/[^0-9.-]+/g, "") || "0"),
      pitch_deck_url: pitch.pitchDeckUrl,
      intro_video_url: pitch.videoUrl,
      problem_statement,
      solution_description,
      traction,
      team_description,
      growth_projections,
      user_id: user.id,
      status: 'new',
      ai_score: aiScore
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('pitches')
      .insert([pitchData])
      .select()
      .single();

    if (error) {
      console.error('Error creating pitch in Supabase:', error);
      throw error;
    }

    // Return the created pitch in the format expected by the frontend
    return {
      id: data.id,
      companyName: data.company_name,
      founderName: pitch.founderName,
      email: pitch.email,
      industry: data.industry || '',
      location: data.location || '',
      description: data.company_description || '',
      fundingStage: data.funding_stage || '',
      fundingAmount: String(data.funding_amount || '0'),
      pitchDeckUrl: data.pitch_deck_url || '/placeholder.svg',
      videoUrl: data.intro_video_url,
      status: data.status as Pitch['status'] || 'new',
      createdAt: data.created_at || new Date().toISOString(),
      answers: pitch.answers,
      aiSummary,
      aiScore,
    };
  } catch (error) {
    console.error('Error in createPitch:', error);
    throw error;
  }
};

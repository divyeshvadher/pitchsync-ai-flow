
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

// Get portfolio analytics data
export const getPortfolioAnalytics = async (timeRange: string, industry: string, stage: string) => {
  const getStartDate = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1W': return new Date(now.setDate(now.getDate() - 7));
      case '1M': return new Date(now.setMonth(now.getMonth() - 1));
      case '3M': return new Date(now.setMonth(now.getMonth() - 3));
      case '6M': return new Date(now.setMonth(now.getMonth() - 6));
      case '1Y': return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return new Date(now.setMonth(now.getMonth() - 1)); // Default to 1 month
    }
  };

  const startDate = getStartDate(timeRange).toISOString();
  try {
    // Fetch pitch flow trends with filters
    let query = supabase
      .from('pitches')
      .select('created_at, ai_score, industry, funding_stage')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true });

    // Apply industry filter
    if (industry !== 'all') {
      query = query.eq('industry', industry);
    }

    // Apply funding stage filter
    if (stage !== 'all') {
      query = query.eq('funding_stage', stage);
    }

    const { data: pitchData, error: pitchError } = await query;

    if (pitchError) {
      console.error('Error fetching pitch data:', pitchError);
      throw pitchError;
    }

    // Fetch engagement metrics with time filter
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('created_at, sender_id, receiver_id, pitch_id, pitches!inner(industry, funding_stage)')
      .gte('created_at', startDate)
      .eq(industry !== 'all' ? 'pitches.industry' : 'pitches.industry', industry !== 'all' ? industry : undefined)
      .eq(stage !== 'all' ? 'pitches.funding_stage' : 'pitches.funding_stage', stage !== 'all' ? stage : undefined);

    if (messageError) {
      console.error('Error fetching message data:', messageError);
      throw messageError;
    }

    // Fetch pitch deck views with filters
    const { data: viewData, error: viewError } = await supabase
      .from('pitches')
      .select('pitch_id, created_at, pitches!inner(industry, funding_stage)')
      .gte('created_at', startDate)
      .eq(industry !== 'all' ? 'pitches.industry' : 'pitches.industry', industry !== 'all' ? industry : undefined)
      .eq(stage !== 'all' ? 'pitches.funding_stage' : 'pitches.funding_stage', stage !== 'all' ? stage : undefined);

    if (viewError) {
      console.error('Error fetching pitch views:', viewError);
      throw viewError;
    }

    if (!pitchData || !messageData || !viewData) {
      console.error('No data returned from one or more queries');
      throw new Error('Failed to fetch analytics data');
    }

    // Process pitch flow data by month
    const pitchFlowByMonth = pitchData.reduce((acc: any, pitch: any) => {
      const month = new Date(pitch.created_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { count: 0, aiScore: 0, pitches: 0 };
      }
      acc[month].count++;
      acc[month].aiScore += pitch.ai_score;
      acc[month].pitches++;
      return acc;
    }, {});

    // Calculate average AI scores and format pitch flow data
    const pitchFlow = Object.entries(pitchFlowByMonth).map(([month, data]: [string, any]) => ({
      month,
      count: data.count,
      aiScore: Math.round(data.aiScore / data.pitches)
    }));

    // Process industry distribution
    const industryDistribution = pitchData.reduce((acc: any, pitch: any) => {
      if (!acc[pitch.industry]) acc[pitch.industry] = 0;
      acc[pitch.industry]++;
      return acc;
    }, {});

    const industryData = Object.entries(industryDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Calculate response times
    const responseTimeData = messageData.reduce((acc: any, message: any) => {
      const month = new Date(message.created_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { quick: 0, average: 0, slow: 0, total: 0 };
      }
      // Calculate response time in hours
      const responseTime = Math.random() * 72; // Replace with actual calculation
      if (responseTime < 24) acc[month].quick++;
      else if (responseTime < 48) acc[month].average++;
      else acc[month].slow++;
      acc[month].total++;
      return acc;
    }, {});

    // Format response time data as percentages
    const responseTime = Object.entries(responseTimeData).map(([month, data]: [string, any]) => ({
      month,
      quick: Math.round((data.quick / data.total) * 100),
      average: Math.round((data.average / data.total) * 100),
      slow: Math.round((data.slow / data.total) * 100)
    }));

    // Process pitch deck views
    const pitchDeckData = viewData.reduce((acc: any, view: any) => {
      const month = new Date(view.created_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { high: 0, medium: 0, low: 0, total: 0 };
      }
      const viewCount = view.view_count;
      if (viewCount > 5) acc[month].high++;
      else if (viewCount > 2) acc[month].medium++;
      else acc[month].low++;
      acc[month].total++;
      return acc;
    }, {});

    // Format pitch deck data as percentages
    const pitchDeckViews = Object.entries(pitchDeckData).map(([month, data]: [string, any]) => ({
      month,
      high: Math.round((data.high / data.total) * 100),
      medium: Math.round((data.medium / data.total) * 100),
      low: Math.round((data.low / data.total) * 100)
    }));

    return {
      pitchFlow,
      industryData,
      responseTime,
      pitchDeckViews,
      followUpData: [] // Implement follow-up tracking in a separate table
    };
  } catch (error) {
    console.error('Error getting portfolio analytics:', error);
    return null;
  }
};

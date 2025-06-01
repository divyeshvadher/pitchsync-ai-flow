
import { supabase } from '@/integrations/supabase/client';

export interface PitchFlowData {
  month: string;
  count: number;
  aiScore: number;
}

export interface IndustryData {
  name: string;
  value: number;
}

export interface EngagementData {
  month: string;
  quick: number;
  average: number;
  slow: number;
}

export interface PitchDeckViewData {
  month: string;
  views: number;
  uniqueViews: number;
}

export const getAnalyticsData = async (timeRange: string = '1M', industryFilter: string = 'all', fundingStageFilter: string = 'all') => {
  try {
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Build query with filters
    let query = supabase
      .from('pitches')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (industryFilter !== 'all') {
      query = query.eq('industry', industryFilter);
    }

    if (fundingStageFilter !== 'all') {
      query = query.eq('funding_stage', fundingStageFilter);
    }

    const { data: pitches, error } = await query;

    if (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }

    // Process pitch flow data
    const pitchFlowData = processPitchFlowData(pitches || [], timeRange);
    
    // Process industry distribution
    const industryData = processIndustryData(pitches || []);
    
    // Process engagement data (mock for now, would need additional tables)
    const responseTimeData = processResponseTimeData(pitches || [], timeRange);
    
    // Process pitch deck views (mock for now, would need additional tables)
    const pitchDeckViews = processPitchDeckViewsData(pitches || [], timeRange);

    return {
      pitchFlow: pitchFlowData,
      industryData,
      responseTime: responseTimeData,
      pitchDeckViews
    };
  } catch (error) {
    console.error('Error in getAnalyticsData:', error);
    throw error;
  }
};

const processPitchFlowData = (pitches: any[], timeRange: string): PitchFlowData[] => {
  const groupedData = new Map<string, { count: number; totalScore: number; scoreCount: number }>();
  
  pitches.forEach(pitch => {
    const date = new Date(pitch.created_at);
    const key = timeRange === '1W' 
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const existing = groupedData.get(key) || { count: 0, totalScore: 0, scoreCount: 0 };
    existing.count += 1;
    
    if (pitch.ai_score) {
      existing.totalScore += pitch.ai_score;
      existing.scoreCount += 1;
    }
    
    groupedData.set(key, existing);
  });

  return Array.from(groupedData.entries()).map(([month, data]) => ({
    month,
    count: data.count,
    aiScore: data.scoreCount > 0 ? Math.round(data.totalScore / data.scoreCount) : 0
  }));
};

const processIndustryData = (pitches: any[]): IndustryData[] => {
  const industryCount = new Map<string, number>();
  
  pitches.forEach(pitch => {
    if (pitch.industry) {
      const current = industryCount.get(pitch.industry) || 0;
      industryCount.set(pitch.industry, current + 1);
    }
  });

  return Array.from(industryCount.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

const processResponseTimeData = (pitches: any[], timeRange: string): EngagementData[] => {
  // This would ideally come from actual response time data
  // For now, generating realistic mock data based on pitch counts
  const months = getMonthsForTimeRange(timeRange);
  
  return months.map(month => ({
    month,
    quick: Math.floor(Math.random() * 30) + 10, // 10-40%
    average: Math.floor(Math.random() * 40) + 30, // 30-70%
    slow: Math.floor(Math.random() * 30) + 10 // 10-40%
  }));
};

const processPitchDeckViewsData = (pitches: any[], timeRange: string): PitchDeckViewData[] => {
  // This would ideally come from actual view tracking data
  const months = getMonthsForTimeRange(timeRange);
  
  return months.map(month => ({
    month,
    views: Math.floor(Math.random() * 100) + 50,
    uniqueViews: Math.floor(Math.random() * 80) + 30
  }));
};

const getMonthsForTimeRange = (timeRange: string): string[] => {
  const months = [];
  const now = new Date();
  
  let monthCount = 1;
  switch (timeRange) {
    case '1W':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case '1M':
      monthCount = 1;
      break;
    case '3M':
      monthCount = 3;
      break;
    case '6M':
      monthCount = 6;
      break;
    case '1Y':
      monthCount = 12;
      break;
    default:
      monthCount = 1;
  }
  
  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }
  
  return months;
};

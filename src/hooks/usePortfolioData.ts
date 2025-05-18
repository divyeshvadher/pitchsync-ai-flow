
import { useQuery } from '@tanstack/react-query';
import { getPitches } from '@/services/pitchService';
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

export const usePortfolioData = () => {
  const { user } = useAuth();
  
  // Fetch all pitches data
  const { data: pitches, isLoading } = useQuery({
    queryKey: ['investorPitches'],
    queryFn: getPitches,
    enabled: !!user?.id,
  });
  
  // Filter for shortlisted/portfolio pitches
  const portfolioPitches = useMemo(() => 
    pitches?.filter(pitch => pitch.status === 'shortlisted') || [], 
    [pitches]
  );
  
  // Calculate total funding amount
  const totalFunding = useMemo(() => portfolioPitches.reduce((sum, pitch) => {
    const amount = parseFloat(pitch.fundingAmount) || 0;
    return sum + amount;
  }, 0), [portfolioPitches]);
  
  // Group by industry for pie chart
  const industryData = useMemo(() => {
    if (!portfolioPitches.length) return [];
    
    const industryMap = new Map<string, number>();
    
    portfolioPitches.forEach(pitch => {
      const industry = pitch.industry || 'Other';
      const amount = parseFloat(pitch.fundingAmount) || 0;
      
      if (industryMap.has(industry)) {
        industryMap.set(industry, industryMap.get(industry)! + amount);
      } else {
        industryMap.set(industry, amount);
      }
    });
    
    return Array.from(industryMap).map(([name, value]) => ({ name, value }));
  }, [portfolioPitches]);
  
  // Group by funding stage for another chart
  const stageData = useMemo(() => {
    if (!portfolioPitches.length) return [];
    
    const stageMap = new Map<string, number>();
    
    portfolioPitches.forEach(pitch => {
      const stage = pitch.fundingStage || 'Other';
      const amount = parseFloat(pitch.fundingAmount) || 0;
      
      if (stageMap.has(stage)) {
        stageMap.set(stage, stageMap.get(stage)! + amount);
      } else {
        stageMap.set(stage, amount);
      }
    });
    
    return Array.from(stageMap).map(([name, value]) => ({ name, value }));
  }, [portfolioPitches]);

  const avgDealSize = useMemo(() => 
    portfolioPitches.length ? (totalFunding / portfolioPitches.length) : 0,
    [totalFunding, portfolioPitches.length]
  );

  return {
    portfolioPitches,
    isLoading,
    totalFunding,
    avgDealSize,
    industryData,
    stageData
  };
};

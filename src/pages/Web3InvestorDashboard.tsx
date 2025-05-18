
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import Web3PitchCarousel from '@/components/Web3PitchCarousel';
import { getPitches } from '@/services/pitchService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  FUNDING_STAGES,
  INDUSTRIES,
  REGIONS,
} from '@/services/investorService';

const Web3InvestorDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'dashboard';
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fundingStageFilter, setFundingStageFilter] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number | null>(null);

  // Fetch all pitches
  const { data: allPitches, isLoading } = useQuery({
    queryKey: ['investorPitches'],
    queryFn: getPitches,
    enabled: !!user?.id,
  });

  // Filter pitches based on criteria
  const filteredPitches = allPitches?.filter(pitch => {
    // Apply search query filter
    if (searchQuery && !pitch.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !pitch.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply funding stage filter
    if (fundingStageFilter.length > 0 && !fundingStageFilter.includes(pitch.fundingStage)) {
      return false;
    }
    
    // Apply industry filter
    if (industryFilter.length > 0 && !industryFilter.includes(pitch.industry)) {
      return false;
    }
    
    // Apply location filter
    if (locationFilter.length > 0 && !locationFilter.includes(pitch.location)) {
      return false;
    }
    
    // Apply AI score filter
    if (minScore !== null && (pitch.aiScore || 0) < minScore) {
      return false;
    }
    if (maxScore !== null && (pitch.aiScore || 0) > maxScore) {
      return false;
    }
    
    return true;
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    
    // Subscribe to changes on the pitches table
    const channel = supabase
      .channel('public:pitches')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pitches',
        },
        () => {
          // Invalidate and refetch pitches when changes occur
          queryClient.invalidateQueries({ queryKey: ['investorPitches'] });
        }
      )
      .subscribe();

    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const toggleFundingStageFilter = (stage: string) => {
    setFundingStageFilter(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage) 
        : [...prev, stage]
    );
  };

  const toggleIndustryFilter = (industry: string) => {
    setIndustryFilter(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry) 
        : [...prev, industry]
    );
  };

  const toggleLocationFilter = (location: string) => {
    setLocationFilter(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFundingStageFilter([]);
    setIndustryFilter([]);
    setLocationFilter([]);
    setMinScore(null);
    setMaxScore(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Discover Innovative Startups
            </h1>
            <p className="text-gray-400 mt-2 font-mono">Browse, filter, and connect with the next big things</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Search input */}
            <div className="relative w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search pitches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[220px] bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            
            {/* Filter button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(fundingStageFilter.length > 0 || industryFilter.length > 0 || locationFilter.length > 0 || minScore !== null || maxScore !== null) && (
                    <span className="ml-1 bg-neon-purple text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {fundingStageFilter.length + industryFilter.length + locationFilter.length + (minScore !== null || maxScore !== null ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto bg-gray-900 border-gray-700 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Filter Pitches</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Narrow down pitches based on your investment criteria
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* Funding Stage Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white">Funding Stage</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {FUNDING_STAGES.map(stage => (
                        <div 
                          key={stage} 
                          onClick={() => toggleFundingStageFilter(stage)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            fundingStageFilter.includes(stage) 
                              ? 'bg-neon-purple text-white' 
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          {stage}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Industry Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white">Industry</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {INDUSTRIES.map(industry => (
                        <div 
                          key={industry} 
                          onClick={() => toggleIndustryFilter(industry)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            industryFilter.includes(industry) 
                              ? 'bg-neon-purple text-white' 
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Region Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white">Region</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {REGIONS.map(region => (
                        <div 
                          key={region} 
                          onClick={() => toggleLocationFilter(region)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            locationFilter.includes(region) 
                              ? 'bg-neon-purple text-white' 
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          {region}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Score Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-white">AI Score Range</h3>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        min={0} 
                        max={100}
                        value={minScore || ''}
                        onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : null)}
                        className="w-20 bg-gray-800 border-gray-700 text-white"
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        min={0} 
                        max={100}
                        value={maxScore || ''}
                        onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : null)}
                        className="w-20 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Clear all
                    </Button>
                    <Button 
                      onClick={() => setIsFilterOpen(false)}
                      className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                    >
                      Apply filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Carousel Section with filtered data */}
        <Web3PitchCarousel pitches={filteredPitches || []} isLoading={isLoading} />
        
        {/* Additional dashboard content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-neon-purple mb-4 flex items-center">
              <span className="w-2 h-6 bg-neon-purple rounded-full mr-2"></span>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {filteredPitches && filteredPitches.slice(0, 3).map((pitch) => (
                <div key={pitch.id} className="border-b border-white/10 pb-3 last:border-0">
                  <p className="text-white/90">New pitch submitted from <span className="text-neon-cyan">{pitch.companyName}</span></p>
                  <p className="text-xs text-gray-400">{new Date(pitch.createdAt).toLocaleTimeString()}</p>
                </div>
              ))}
              {(!filteredPitches || filteredPitches.length === 0) && (
                <div className="text-gray-400">No recent activity</div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-neon-blue mb-4 flex items-center">
              <span className="w-2 h-6 bg-neon-blue rounded-full mr-2"></span>
              Top Industries
            </h2>
            <div className="space-y-3">
              {[
                { name: 'AI', value: 68, color: 'neon-purple' },
                { name: 'Web3', value: 52, color: 'neon-blue' },
                { name: 'Fintech', value: 43, color: 'neon-cyan' },
                { name: 'Health', value: 37, color: 'neon-green' }
              ].map((industry) => (
                <div key={industry.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{industry.name}</span>
                    <span className="font-mono">{industry.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${industry.color}`}
                      style={{ 
                        width: `${industry.value}%`,
                        backgroundColor: `var(--tw-colors-${industry.color})` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Web3InvestorDashboard;

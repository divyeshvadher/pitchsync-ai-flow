
import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPitches, Pitch } from '@/services/pitchService';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Web3PitchCard from './Web3PitchCard';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const domains = ['All', 'AI', 'Web3', 'Fintech', 'Health', 'EdTech'];

const Web3PitchCarousel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const isMobile = useIsMobile();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: pitches, isLoading } = useQuery({
    queryKey: ['pitches'],
    queryFn: getPitches,
  });

  const filteredPitches = pitches?.filter((pitch: Pitch) => {
    const matchesSearch = 
      pitch.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pitch.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = 
      selectedDomain === 'All' || 
      pitch.industry.toLowerCase() === selectedDomain.toLowerCase();
    
    return matchesSearch && matchesDomain;
  });

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in py-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 px-4 md:px-0">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search pitches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-cyber-dark/80 border-neon-purple/30 focus:border-neon-purple/80 
                       focus:shadow-[0_0_8px_theme('colors.neon.purple')] transition-all"
          />
        </div>
        
        <div className="flex items-center overflow-x-auto scrollbar-none space-x-2 pb-2 md:pb-0">
          {domains.map((domain) => (
            <Button
              key={domain}
              variant="outline"
              size="sm"
              onClick={() => handleDomainSelect(domain)}
              className={`
                cyber-button whitespace-nowrap px-4 py-2 text-xs
                ${selectedDomain === domain 
                  ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_8px_theme(\'colors.neon.purple\')]' 
                  : ''}
              `}
            >
              {domain === 'All' && <Filter size={14} className="mr-2" />}
              {domain}
            </Button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin"></div>
          </div>
        </div>
      ) : filteredPitches && filteredPitches.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="px-4 md:px-0">
            {filteredPitches.map((pitch) => (
              <CarouselItem key={pitch.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Web3PitchCard pitch={pitch} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-end mt-6 space-x-4">
            <CarouselPrevious className="relative h-10 w-10 cyber-button rounded-full inset-auto
                                        left-auto transform-none" />
            <CarouselNext className="relative h-10 w-10 cyber-button rounded-full inset-auto
                                       right-auto transform-none" />
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-cyber-dark/50 rounded-xl border border-white/10">
          <p className="text-gray-400 mb-4">No pitches found matching your criteria</p>
          <Button
            variant="outline" 
            className="cyber-button"
            onClick={() => {
              setSearchTerm('');
              setSelectedDomain('All');
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* Mobile search button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button
            className="rounded-full w-14 h-14 bg-neon-purple border-white/20 shadow-neon"
            onClick={handleSearchFocus}
          >
            <Search size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Web3PitchCarousel;

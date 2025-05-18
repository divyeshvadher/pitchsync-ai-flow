
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pitch } from '@/services/types/pitch';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';

interface Web3PitchCarouselProps {
  pitches?: Pitch[];
  isLoading?: boolean;
}

const Web3PitchCarousel: React.FC<Web3PitchCarouselProps> = ({ 
  pitches = [],
  isLoading = false
}) => {
  const navigate = useNavigate();

  const handleViewPitch = (pitchId: string) => {
    navigate(`/pitch/${pitchId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[320px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (pitches.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">No pitches available</h3>
        <p className="text-gray-400">Be the first to submit a pitch!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-6 min-w-max">
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className="w-72 md:w-80 flex-shrink-0 glass-card p-2 rounded-lg flex flex-col 
                      relative group transition-all duration-300 hover:scale-[1.02] overflow-hidden
                      border border-neon-purple/30 hover:border-neon-purple/70"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-neon-purple/20 opacity-50 
                        group-hover:opacity-70 transition-opacity z-0"
            ></div>

            <div className="p-4 z-10 relative">
              <h3 className="text-lg font-bold text-white mb-1">{pitch.companyName}</h3>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="text-xs py-1 px-2 rounded-full bg-neon-blue/20 text-neon-blue font-mono">
                    {pitch.industry || "Tech"}
                  </div>
                </div>
                <div className="text-xs text-gray-400">{pitch.location}</div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-3 mb-3 min-h-[60px]">
                {pitch.description}
              </p>

              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <span>{pitch.fundingStage}</span>
                  <span>Seeking: {pitch.fundingAmount}</span>
                </div>

                <div className="relative pt-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-gray-400">AI Score</span>
                    <span className="text-neon-purple font-mono">{pitch.aiScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                      style={{ width: `${pitch.aiScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <button
                className="mt-4 w-full py-2 bg-transparent border border-neon-purple/50 rounded-md
                        text-neon-purple text-sm hover:bg-neon-purple/10 transition-colors
                        group-hover:border-neon-purple flex items-center justify-center gap-2"
                onClick={() => handleViewPitch(pitch.id)}
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Web3PitchCarousel;


import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { Pitch } from '@/services/pitchService';
import { useNavigate } from 'react-router-dom';

interface Web3PitchCardProps {
  pitch: Pitch;
}

const Web3PitchCard: React.FC<Web3PitchCardProps> = ({ pitch }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const getIndustryColor = (industry: string) => {
    const industries: Record<string, string> = {
      'AI': 'neon-purple',
      'Fintech': 'neon-blue',
      'Web3': 'neon-cyan',
      'Health': 'neon-green',
      'EdTech': 'neon-yellow',
    };
    
    return industries[industry] || 'neon-purple';
  };

  const industryColor = getIndustryColor(pitch.industry);
  
  return (
    <div 
      className="pitch-card flex flex-col h-[330px] cursor-pointer"
      style={{ "--glow-color": `var(--tw-colors-${industryColor})` } as React.CSSProperties}
      onClick={() => navigate(`/pitch/${pitch.id}`)}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between">
          <Badge 
            className="bg-gradient-to-r from-neon-purple/80 to-neon-blue/80 border-0 
                      text-white px-3 py-1 text-xs font-mono tracking-wide"
          >
            {pitch.fundingStage}
          </Badge>
          
          <div className="flex items-center gap-1">
            <button 
              className={`like-button ${liked ? 'active' : ''}`} 
              onClick={handleLike}
              aria-label="Like pitch"
            >
              <Heart 
                size={16} 
                className={`transition-all ${liked ? 'fill-neon-pink text-neon-pink' : 'text-neon-pink/70'}`}
              />
            </button>
            <span className="text-xs font-mono text-neon-pink/70">{likeCount}</span>
          </div>
        </div>
        
        <h3 className="mt-3 text-xl font-bold tracking-tight text-white bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
          {pitch.companyName}
        </h3>
        
        <p className="mt-2 text-sm text-gray-300 line-clamp-3">
          {pitch.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span 
            className="tag"
            style={{ "--glow-color": `var(--tw-colors-${industryColor})` } as React.CSSProperties}
          >
            {pitch.industry}
          </span>
          <span className="tag">{pitch.location}</span>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10 bg-cyber-dark/80 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Founder</p>
          <p className="text-sm text-white font-medium">{pitch.founderName}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-400 text-right">Funding</p>
          <p className="text-sm text-white font-medium font-mono">{pitch.fundingAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default Web3PitchCard;

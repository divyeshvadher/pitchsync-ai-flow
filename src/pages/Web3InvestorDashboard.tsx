
import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSearchParams } from 'react-router-dom';
import Web3PitchCarousel from '@/components/Web3PitchCarousel';

const Web3InvestorDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'dashboard';

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Discover Innovative Startups
          </h1>
          <p className="text-gray-400 mt-2 font-mono">Browse, filter, and connect with the next big things</p>
        </div>
        
        {/* Carousel Section */}
        <Web3PitchCarousel />
        
        {/* Additional dashboard content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-neon-purple mb-4 flex items-center">
              <span className="w-2 h-6 bg-neon-purple rounded-full mr-2"></span>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-white/10 pb-3 last:border-0">
                  <p className="text-white/90">New pitch submitted from <span className="text-neon-cyan">TechVenture #{i}</span></p>
                  <p className="text-xs text-gray-400">{i} hour{i !== 1 ? 's' : ''} ago</p>
                </div>
              ))}
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

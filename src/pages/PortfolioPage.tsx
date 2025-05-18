
import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import SummaryCard from '@/components/portfolio/SummaryCard';
import PieChartCard from '@/components/portfolio/PieChartCard';
import PortfolioList from '@/components/portfolio/PortfolioList';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const PortfolioPage: React.FC = () => {
  const {
    portfolioPitches,
    isLoading,
    totalFunding,
    avgDealSize,
    industryData,
    stageData
  } = usePortfolioData();
  
  // Chart color configurations
  const industryColorConfig = {
    'AI/ML': { color: '#8884d8' },
    'Climate Tech': { color: '#82ca9d' },
    'Fintech': { color: '#ffc658' },
    'Health Tech': { color: '#ff8042' },
    'EdTech': { color: '#0088FE' },
    'Enterprise SaaS': { color: '#00C49F' },
    'Consumer': { color: '#FFBB28' },
  };
  
  const stageColorConfig = {
    'Pre-seed': { color: '#8884d8' },
    'Seed': { color: '#82ca9d' },
    'Series A': { color: '#ffc658' },
    'Series B': { color: '#ff8042' },
    'Series C+': { color: '#0088FE' },
    'Growth': { color: '#00C49F' },
    'Other': { color: '#FFBB28' },
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard 
            title="Total Companies" 
            value={portfolioPitches.length} 
            isLoading={isLoading} 
          />
          
          <SummaryCard 
            title="Total Funding" 
            value={`$${totalFunding.toLocaleString()}`} 
            isLoading={isLoading} 
          />
          
          <SummaryCard 
            title="Avg. Deal Size" 
            value={`$${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PieChartCard 
            title="Industry Allocation"
            description="Distribution of investments across industries"
            data={industryData}
            isLoading={isLoading}
            icon={PieChartIcon}
            colorMap={industryColorConfig}
          />
          
          <PieChartCard 
            title="Funding Stage Breakdown"
            description="Investment distribution by funding stage"
            data={stageData}
            isLoading={isLoading}
            icon={PieChartIcon}
            colorMap={stageColorConfig}
          />
        </div>
        
        {/* Portfolio List */}
        <PortfolioList 
          portfolioPitches={portfolioPitches}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default PortfolioPage;

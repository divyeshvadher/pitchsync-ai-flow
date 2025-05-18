
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPitches } from '@/services/pitchService';
import { useAuth } from '@/context/AuthContext';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch all pitches data
  const { data: pitches, isLoading } = useQuery({
    queryKey: ['investorPitches'],
    queryFn: getPitches,
    enabled: !!user?.id,
  });
  
  // Filter for shortlisted/portfolio pitches
  const portfolioPitches = pitches?.filter(pitch => pitch.status === 'shortlisted') || [];
  
  // Calculate total funding amount
  const totalFunding = portfolioPitches.reduce((sum, pitch) => {
    const amount = parseFloat(pitch.fundingAmount) || 0;
    return sum + amount;
  }, 0);
  
  // Group by industry for pie chart
  const industryData = React.useMemo(() => {
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
  const stageData = React.useMemo(() => {
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
  
  // Define chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number) => [`$${value.toLocaleString()}`, 'Amount'];
  const customLabelFormatter = (label: any) => label;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">{portfolioPitches.length}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  ${totalFunding.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  ${portfolioPitches.length ? (totalFunding / portfolioPitches.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Industry Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Industry Allocation
              </CardTitle>
              <CardDescription>Distribution of investments across industries</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : !industryData.length ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No portfolio data available
                </div>
              ) : (
                <ChartContainer 
                  config={{
                    'AI/ML': { color: '#8884d8' },
                    'Climate Tech': { color: '#82ca9d' },
                    'Fintech': { color: '#ffc658' },
                    'Health Tech': { color: '#ff8042' },
                    'EdTech': { color: '#0088FE' },
                    'Enterprise SaaS': { color: '#00C49F' },
                    'Consumer': { color: '#FFBB28' },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {industryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={customTooltipFormatter}
                        labelFormatter={customLabelFormatter}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Funding Stage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Funding Stage Breakdown
              </CardTitle>
              <CardDescription>Investment distribution by funding stage</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : !stageData.length ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No portfolio data available
                </div>
              ) : (
                <ChartContainer 
                  config={{
                    'Pre-seed': { color: '#8884d8' },
                    'Seed': { color: '#82ca9d' },
                    'Series A': { color: '#ffc658' },
                    'Series B': { color: '#ff8042' },
                    'Series C+': { color: '#0088FE' },
                    'Growth': { color: '#00C49F' },
                    'Other': { color: '#FFBB28' },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {stageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={customTooltipFormatter}
                        labelFormatter={customLabelFormatter}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Portfolio List */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Companies</CardTitle>
            <CardDescription>Companies you've shortlisted</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !portfolioPitches.length ? (
              <div className="text-center py-8 text-muted-foreground">
                You haven't shortlisted any companies yet.
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-5 font-medium p-4 border-b bg-muted/50">
                  <div>Company</div>
                  <div>Founder</div>
                  <div>Industry</div>
                  <div>Funding Stage</div>
                  <div className="text-right">Amount</div>
                </div>
                {portfolioPitches.map((pitch) => (
                  <div key={pitch.id} className="grid grid-cols-5 p-4 items-center hover:bg-muted/50 border-b last:border-0">
                    <div className="font-medium">{pitch.companyName}</div>
                    <div>{pitch.founderName}</div>
                    <div>{pitch.industry || 'N/A'}</div>
                    <div>{pitch.fundingStage || 'N/A'}</div>
                    <div className="text-right">${parseFloat(pitch.fundingAmount || '0').toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PortfolioPage;

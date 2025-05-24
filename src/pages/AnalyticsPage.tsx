import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Remove or comment out until date-range-picker component is implemented
// import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPortfolioAnalytics } from '@/services/investorService';
import { supabase } from '@/integrations/supabase/client';

// Default empty data structures for loading state
const emptyData = {
  pitchFlow: [],
  industryData: [],
  responseTime: [],
  pitchDeckViews: [],
  followUpData: []
};

// Consistent color scheme for engagement levels
const COLORS = {
  high: '#22c55e',     // Green for positive/high engagement
  medium: '#f59e0b',   // Orange for medium engagement
  low: '#ef4444',      // Red for low engagement
  quick: '#22c55e',    // Green for quick response
  average: '#f59e0b',  // Orange for average response
  slow: '#ef4444',     // Red for slow response
  active: '#22c55e',   // Green for active follow-up
  passive: '#f59e0b',  // Orange for passive follow-up
  none: '#ef4444',     // Red for no follow-up
};

// Custom tooltip formatter
const percentageFormatter = (value: number) => `${value}%`;

const AnalyticsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState('1M');
  const [industry, setIndustry] = useState('all');
  const [stage, setStage] = useState('all');

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['portfolioAnalytics', timeRange, industry, stage],
    queryFn: () => getPortfolioAnalytics(timeRange, industry, stage),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    // Create a single channel for all table changes
    const subscription = supabase
      .channel('analytics_changes')
      .on('postgres_changes', {
        event: '*',  // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'pitches',
      }, () => {
        console.log('Pitch data changed, refreshing analytics...');
        queryClient.invalidateQueries({ queryKey: ['portfolioAnalytics', timeRange, industry, stage] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, () => {
        console.log('Message data changed, refreshing analytics...');
        queryClient.invalidateQueries({ queryKey: ['portfolioAnalytics', timeRange, industry, stage] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pitch_views',
      }, () => {
        console.log('Pitch view data changed, refreshing analytics...');
        queryClient.invalidateQueries({ queryKey: ['portfolioAnalytics', timeRange, industry, stage] });
      })
      .subscribe((status) => {
        console.log(`Supabase real-time subscription status: ${status}`);
      });

    return () => {
      console.log('Unsubscribing from Supabase real-time updates');
      subscription.unsubscribe();
    };
  }, [queryClient, timeRange, industry, stage]); // Include filter dependencies

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error loading analytics data</h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Please try again later'}
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['portfolioAnalytics', timeRange, industry, stage] })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show data or empty state
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <div className="flex flex-wrap gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="health">Health Tech</SelectItem>
                <SelectItem value="climate">Climate Tech</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="seriesA">Series A</SelectItem>
                <SelectItem value="seriesB">Series B</SelectItem>
                <SelectItem value="seriesC">Series C+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pitch Flow Trends */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Pitch Flow Trends</CardTitle>
              <CardDescription>Number of pitches received over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.pitchFlow || emptyData.pitchFlow} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Pitch Count" />
                    <Line type="monotone" dataKey="aiScore" stroke="#82ca9d" name="Avg AI Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Industry Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
              <CardDescription>Breakdown by industry sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData?.industryData || emptyData.industryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {(analyticsData?.industryData || emptyData.industryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[Object.keys(COLORS)[index % Object.keys(COLORS).length]]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Founder Engagement Section */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Founder Engagement Metrics</CardTitle>
              <CardDescription>Detailed breakdown of founder interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Response Time Trends */}
                <div className="h-[300px]">
                  <h3 className="text-lg font-semibold mb-2">Response Time Trends</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData?.responseTime || emptyData.responseTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={percentageFormatter} />
                      <Tooltip formatter={percentageFormatter} />
                      <Line type="monotone" dataKey="quick" stroke={COLORS.quick} name="Quick Response" />
                      <Line type="monotone" dataKey="average" stroke={COLORS.average} name="Average Response" />
                      <Line type="monotone" dataKey="slow" stroke={COLORS.slow} name="Slow Response" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pitch Deck Views */}
                <div className="h-[300px]">
                  <h3 className="text-lg font-semibold mb-2">Pitch Deck Engagement</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData?.pitchDeckViews || emptyData.pitchDeckViews} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={percentageFormatter} />
                      <Tooltip formatter={percentageFormatter} />
                      <Line type="monotone" dataKey="high" stroke={COLORS.high} name="High Views" />
                      <Line type="monotone" dataKey="medium" stroke={COLORS.medium} name="Medium Views" />
                      <Line type="monotone" dataKey="low" stroke={COLORS.low} name="Low Views" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Follow-up Activity */}
                <div className="h-[300px]">
                  <h3 className="text-lg font-semibold mb-2">Follow-up Activity</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData?.followUpData || emptyData.followUpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={percentageFormatter} />
                      <Tooltip formatter={percentageFormatter} />
                      <Line type="monotone" dataKey="active" stroke={COLORS.active} name="Active Follow-up" />
                      <Line type="monotone" dataKey="passive" stroke={COLORS.passive} name="Passive Follow-up" />
                      <Line type="monotone" dataKey="none" stroke={COLORS.none} name="No Follow-up" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
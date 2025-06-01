
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, PieChart, BarChart3, MessageCircle, Calendar, Filter } from 'lucide-react';
import { getAnalyticsData } from '@/services/analyticsService';
import PitchFlowChart from '@/components/analytics/PitchFlowChart';
import IndustryDistributionChart from '@/components/analytics/IndustryDistributionChart';
import EngagementMetricsChart from '@/components/analytics/EngagementMetricsChart';
import MetricsSummaryCards from '@/components/analytics/MetricsSummaryCards';
import { Skeleton } from '@/components/ui/skeleton';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [industry, setIndustry] = useState('all');
  const [fundingStage, setFundingStage] = useState('all');

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange, industry, fundingStage],
    queryFn: () => getAnalyticsData(timeRange, industry, fundingStage),
  });

  const timeRangeOptions = [
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
  ];

  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Climate Tech', label: 'Climate Tech' },
    { value: 'Fintech', label: 'Fintech' },
    { value: 'Health Tech', label: 'Health Tech' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'Enterprise SaaS', label: 'Enterprise SaaS' },
    { value: 'Consumer', label: 'Consumer' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Marketplace', label: 'Marketplace' },
    { value: 'Web3/Crypto', label: 'Web3/Crypto' },
  ];

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'Pre-seed', label: 'Pre-seed' },
    { value: 'Seed', label: 'Seed' },
    { value: 'Series A', label: 'Series A' },
    { value: 'Series B', label: 'Series B' },
    { value: 'Series C+', label: 'Series C+' },
    { value: 'Growth', label: 'Growth' },
  ];

  const clearFilters = () => {
    setTimeRange('1M');
    setIndustry('all');
    setFundingStage('all');
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Analytics Unavailable</h1>
            <p className="text-muted-foreground mt-2">Unable to load analytics data. Please try again later.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
            <p className="text-muted-foreground">
              Real-time insights into your investment pipeline and portfolio performance
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={fundingStage} onValueChange={setFundingStage}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <MetricsSummaryCards data={analyticsData} isLoading={isLoading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pitch Flow Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pitch Flow & AI Score Trends
              </CardTitle>
              <CardDescription>
                Monthly pitch volume and average AI quality scores over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <PitchFlowChart data={analyticsData?.pitchFlow || []} />
              )}
            </CardContent>
          </Card>

          {/* Industry Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Industry Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of pitches by industry vertical
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <IndustryDistributionChart data={analyticsData?.industryData || []} />
              )}
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Engagement Metrics
              </CardTitle>
              <CardDescription>
                Response times and pitch deck viewing patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <EngagementMetricsChart 
                  responseTimeData={analyticsData?.responseTime || []}
                  pitchDeckData={analyticsData?.pitchDeckViews || []}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;

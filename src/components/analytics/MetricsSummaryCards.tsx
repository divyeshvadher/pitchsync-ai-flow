
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsSummaryCardsProps {
  data: any;
  isLoading: boolean;
}

const MetricsSummaryCards: React.FC<MetricsSummaryCardsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate summary metrics from data
  const totalPitches = data?.pitchFlow?.reduce((sum: number, item: any) => sum + item.count, 0) || 0;
  const avgAIScore = data?.pitchFlow?.length 
    ? Math.round(data.pitchFlow.reduce((sum: number, item: any) => sum + item.aiScore, 0) / data.pitchFlow.length)
    : 0;
  const avgResponseTime = data?.responseTime?.length
    ? Math.round(data.responseTime.reduce((sum: number, item: any) => sum + (item.quick * 12 + item.average * 36 + item.slow * 72), 0) / 
        (data.responseTime.length * 100))
    : 0;
  const topIndustry = data?.industryData?.length 
    ? data.industryData.reduce((max: any, item: any) => item.value > max.value ? item : max, data.industryData[0])?.name
    : 'N/A';

  const metrics = [
    {
      title: 'Total Pitches',
      value: totalPitches.toLocaleString(),
      description: 'Received this period',
      icon: TrendingUp,
      trend: '+12%',
    },
    {
      title: 'Avg AI Score',
      value: `${avgAIScore}/100`,
      description: 'Quality assessment',
      icon: Star,
      trend: '+5%',
    },
    {
      title: 'Response Time',
      value: `${avgResponseTime}h`,
      description: 'Average response',
      icon: Clock,
      trend: '-8%',
    },
    {
      title: 'Top Industry',
      value: topIndustry,
      description: 'Most active sector',
      icon: Target,
      trend: '23%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{metric.trend}</span> {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsSummaryCards;

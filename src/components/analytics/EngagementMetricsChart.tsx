
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ResponseTimeData {
  month: string;
  quick: number;
  average: number;
  slow: number;
}

interface PitchDeckViewData {
  month: string;
  views: number;
  uniqueViews: number;
}

interface EngagementMetricsChartProps {
  responseTimeData: ResponseTimeData[];
  pitchDeckData: PitchDeckViewData[];
}

const EngagementMetricsChart: React.FC<EngagementMetricsChartProps> = ({ 
  responseTimeData, 
  pitchDeckData 
}) => {
  const responseTimeConfig = {
    quick: {
      label: "Quick Response (<24h)",
      color: "#10b981",
    },
    average: {
      label: "Average Response (1-3d)",
      color: "#f59e0b",
    },
    slow: {
      label: "Slow Response (>3d)",
      color: "#ef4444",
    },
  };

  const pitchDeckConfig = {
    views: {
      label: "Total Views",
      color: "#3b82f6",
    },
    uniqueViews: {
      label: "Unique Views",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      {/* Response Time Chart */}
      <div>
        <h4 className="text-sm font-medium mb-3">Response Time Distribution</h4>
        <ChartContainer config={responseTimeConfig} className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={11}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="quick" fill="#10b981" stackId="a" />
              <Bar dataKey="average" fill="#f59e0b" stackId="a" />
              <Bar dataKey="slow" fill="#ef4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Pitch Deck Views Chart */}
      <div>
        <h4 className="text-sm font-medium mb-3">Pitch Deck Views</h4>
        <ChartContainer config={pitchDeckConfig} className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pitchDeckData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={11}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="uniqueViews" 
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default EngagementMetricsChart;

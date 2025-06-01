
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Clock, Eye } from 'lucide-react';

interface EngagementData {
  month: string;
  quick: number;
  average: number;
  slow: number;
  high?: number;
  medium?: number;
  low?: number;
}

interface EngagementMetricsChartProps {
  responseTimeData: EngagementData[];
  pitchDeckData: EngagementData[];
}

const EngagementMetricsChart: React.FC<EngagementMetricsChartProps> = ({ 
  responseTimeData, 
  pitchDeckData 
}) => {
  const [activeView, setActiveView] = useState<'response' | 'views'>('response');

  const responseChartConfig = {
    quick: {
      label: "< 24h",
      color: "#10b981",
    },
    average: {
      label: "24-48h",
      color: "#f59e0b",
    },
    slow: {
      label: "> 48h",
      color: "#ef4444",
    },
  };

  const viewsChartConfig = {
    high: {
      label: "High (>5 views)",
      color: "#8b5cf6",
    },
    medium: {
      label: "Medium (2-5 views)",
      color: "#06b6d4",
    },
    low: {
      label: "Low (1-2 views)",
      color: "#84cc16",
    },
  };

  const currentData = activeView === 'response' ? responseTimeData : pitchDeckData;
  const currentConfig = activeView === 'response' ? responseChartConfig : viewsChartConfig;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={activeView === 'response' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('response')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Response Times
        </Button>
        <Button
          variant={activeView === 'views' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('views')}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Deck Views
        </Button>
      </div>

      <ChartContainer config={currentConfig} className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
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
            {activeView === 'response' ? (
              <>
                <Bar dataKey="quick" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="average" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="slow" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <>
                <Bar dataKey="high" stackId="b" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="b" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="b" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="text-xs text-muted-foreground">
        {activeView === 'response' 
          ? 'Percentage breakdown of response times to founder messages'
          : 'Distribution of pitch deck viewing engagement levels'
        }
      </div>
    </div>
  );
};

export default EngagementMetricsChart;

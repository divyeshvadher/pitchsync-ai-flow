
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface PitchFlowData {
  month: string;
  count: number;
  aiScore: number;
}

interface PitchFlowChartProps {
  data: PitchFlowData[];
}

const PitchFlowChart: React.FC<PitchFlowChartProps> = ({ data }) => {
  const chartConfig = {
    count: {
      label: "Pitches",
      color: "#8884d8",
    },
    aiScore: {
      label: "AI Score",
      color: "#82ca9d",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
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
          <Bar 
            yAxisId="left"
            dataKey="count" 
            fill="#8884d8"
            opacity={0.7}
            radius={[4, 4, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="aiScore" 
            stroke="#82ca9d"
            strokeWidth={3}
            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PitchFlowChart;


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface IndustryData {
  name: string;
  value: number;
}

interface IndustryDistributionChartProps {
  data: IndustryData[];
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
  '#00C49F', '#FFBB28', '#FF8042', '#8dd1e1', '#d084d0'
];

const IndustryDistributionChart: React.FC<IndustryDistributionChartProps> = ({ data }) => {
  const chartConfig = data.reduce((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">
            <span className="text-blue-400">{data.value}</span> pitches
          </p>
          <p className="text-gray-300">
            <span className="text-green-400">{((data.value / data.payload.total) * 100).toFixed(1)}%</span> of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Add total to each data point for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <ChartContainer config={chartConfig} className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default IndustryDistributionChart;

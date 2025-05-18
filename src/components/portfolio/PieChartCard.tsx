
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from '@/components/ui/chart';
import { LucideIcon } from 'lucide-react';

interface DataItem {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  description: string;
  data: DataItem[];
  isLoading: boolean;
  icon: LucideIcon;
  colorMap: Record<string, { color: string }>;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  description,
  data,
  isLoading,
  icon: Icon,
  colorMap,
}) => {
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number) => [`$${value.toLocaleString()}`, 'Amount'];
  const customLabelFormatter = (label: any) => label;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : !data.length ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No portfolio data available
          </div>
        ) : (
          <ChartContainer 
            config={colorMap}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
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
                  {data.map((_, index) => (
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
  );
};

export default PieChartCard;

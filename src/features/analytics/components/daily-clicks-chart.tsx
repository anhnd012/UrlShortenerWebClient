import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { DailyClick } from '../types/analytics.types';

interface DailyClicksChartProps {
  data: DailyClick[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as DailyClick;
    const dateObj = new Date(item.date);
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <div className="rounded-card border border-border bg-surface p-3 shadow-lg">
        <p className="text-xs font-semibold text-text-secondary">{dateFormatted}</p>
        <p className="mt-1 text-sm font-bold text-primary">
          {payload[0].value} {payload[0].value === 1 ? 'click' : 'clicks'}
        </p>
      </div>
    );
  }
  return null;
};

export const DailyClicksChart: React.FC<DailyClicksChartProps> = ({ data }) => {
  const chartData = data.map((item) => {
    try {
      const date = new Date(item.date);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        ...item,
        label,
      };
    } catch {
      return {
        ...item,
        label: item.date,
      };
    }
  });

  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-subtle">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Clicks Over Time
        </h3>
        <span className="text-xs text-text-muted">Daily aggregation</span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#4F46E5"
              strokeWidth={2.5}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              dot={{ r: 4, stroke: '#4F46E5', strokeWidth: 1.5, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

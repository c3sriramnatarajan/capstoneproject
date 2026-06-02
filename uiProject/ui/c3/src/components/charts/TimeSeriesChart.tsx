import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import ContentSection from '@c3/app/ui/src/components/container/ContentSection';

interface TimeSeriesChartProps {
  title: string;
  unit: string;
  color: string;
  data: { date: string; value: number }[];
}

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const TimeSeriesChart = ({ title, unit, color, data }: TimeSeriesChartProps) => {
  return (
    <ContentSection title={`${title} (${unit})`}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#666' }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} tickFormatter={(v: number) => v.toLocaleString()} />
            <Tooltip
              labelFormatter={(label: string) => new Date(label).toLocaleString()}
              formatter={(value: number) => [`${value.toLocaleString()} ${unit}`, title]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
          No data available for this period.
        </p>
      )}
    </ContentSection>
  );
};

export default TimeSeriesChart;

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface YearBarChartProps {
  data: { year: number; value: number }[];
  onBarClick: (year: number) => void;
  selectedYear: number | null;
}

export const YearBarChart: React.FC<YearBarChartProps> = ({ data, onBarClick, selectedYear }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="year" 
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} 
          axisLine={false}
          tickLine={false}
          tickMargin={5}
          interval={0}
        />
        <YAxis 
          hide={false}
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
          axisLine={false}
          tickLine={false}
          domain={[100, 'auto']} 
        />
        <Tooltip 
          cursor={{ fill: '#fff7ed' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
          }}
          labelStyle={{ color: '#64748b', fontSize: '10px' }}
          itemStyle={{ color: '#ea580c', fontWeight: 600, fontSize: '12px' }}
        />
        <Bar 
          dataKey="value" 
          name="Avg CPI" 
          radius={[4, 4, 0, 0]}
          cursor="pointer"
          onClick={(data) => onBarClick(data.year)}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={selectedYear === entry.year ? '#ea580c' : '#f97316'}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
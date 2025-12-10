import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface CategoryChartProps {
  data: { name: string; value: number; inflation: number }[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-xs text-slate-400">NO DATA</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={10}
          tick={false}
          axisLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px' }}
          itemStyle={{ fontSize: '11px', color: '#fff' }}
          formatter={(val: number) => val.toFixed(1) + "%"}
        />
        <Bar dataKey="inflation" barSize={12} radius={[0, 2, 2, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.inflation > 5 ? '#ef4444' : '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
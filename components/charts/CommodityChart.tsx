import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, LabelList } from 'recharts';

interface CommodityChartProps {
  data: { name: string; value: number }[];
}

export const CommodityChart: React.FC<CommodityChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No Data</div>;

  // Restoring the multi-color palette for vibrant distinction
  const COLORS = [
    '#0ea5e9', // Sky Blue
    '#22c55e', // Green
    '#eab308', // Yellow
    '#f97316', // Orange
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#6366f1'  // Indigo
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        layout="vertical"
        data={data} 
        margin={{ top: 0, right: 30, left: 10, bottom: 0 }} 
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={120} 
          tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} 
          interval={0}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList 
            dataKey="value" 
            position="right" 
            style={{ fontSize: '11px', fill: '#64748b', fontWeight: 500 }} 
            formatter={(val: number) => val.toFixed(1)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, LabelList } from 'recharts';

interface CommodityChartProps {
  data: { name: string; value: number }[];
}

export const CommodityChart: React.FC<CommodityChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No Data</div>;

  // Stable Color Map for consistent visual identity across sector switches
  const COLOR_MAP: Record<string, string> = {
    "Vegetables": "#22c55e", // Green
    "Pulses": "#eab308", // Yellow
    "Oils and fats": "#f59e0b", // Amber
    "Meat and fish": "#ef4444", // Red
    "Spices": "#78350f", // Brown
    "Fuel and light": "#f97316", // Orange
    "Housing": "#6366f1", // Indigo
    "Clothing": "#ec4899" // Pink
  };
  
  const DEFAULT_COLOR = "#64748b"; // Slate

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        layout="vertical"
        data={data} 
        margin={{ top: 0, right: 30, left: 10, bottom: 0 }} 
        barSize={18}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={110} 
          tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} 
          interval={0}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }}
          itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={500}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${entry.name}`} 
              fill={COLOR_MAP[entry.name] || DEFAULT_COLOR} 
            />
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
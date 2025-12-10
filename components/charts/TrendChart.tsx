import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CPIDataPoint } from '../../types';

interface TrendChartProps {
  data: CPIDataPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Data Available</div>;

  const isSingleYear = data.length <= 12;

  // Calculate specific ticks to ensure every relevant label is shown
  const customTicks = useMemo(() => {
    if (isSingleYear) {
      // Show every data point (months) for single year view
      return data.map(d => d.Date);
    } else {
      // Show one point per year for the full view (first occurrence of each year)
      const seenYears = new Set();
      return data.filter(d => {
        if (seenYears.has(d.Year)) return false;
        seenYears.add(d.Year);
        return true;
      }).map(d => d.Date);
    }
  }, [data, isSingleYear]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="Date" 
          ticks={customTicks}
          interval={0} // Forces all calculated ticks to be displayed
          tick={{ fontSize: 11, fill: '#64748b' }} 
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(val) => {
             const parts = val.split('-');
             if (isSingleYear) {
                 const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                 return d.toLocaleString('default', { month: 'short' });
             }
             return parts[2];
          }}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#64748b' }} 
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          domain={['auto', 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px'
          }}
          labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          itemStyle={{ color: '#2563eb', fontWeight: 600, fontSize: '13px' }}
        />
        <Area 
          type="monotone" 
          dataKey="General index" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#colorIndex)" 
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#3b82f6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
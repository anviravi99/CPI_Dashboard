import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  subtext: string;
  isPercentage?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  value, 
  subtext, 
  isPercentage = false, 
  trend, 
  highlight = false,
  icon
}) => {
  return (
    <div className={`
      relative overflow-hidden rounded-lg border p-5 flex flex-col justify-between h-32 transition-all duration-200
      ${highlight 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
        : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:shadow-md'
      }
    `}>
      <div className="flex justify-between items-start mb-2">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
          {title}
        </p>
        {icon}
        {!icon && trend && (
          <div className={`
            flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full
            ${highlight 
               ? 'bg-white/20 text-white' 
               : (trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')
            }
          `}>
            {trend === 'up' && <ArrowUpRight size={12} />}
            {trend === 'down' && <ArrowDownRight size={12} />}
            {trend === 'neutral' && <Minus size={12} />}
            <span>{trend === 'up' ? '+2.4%' : trend === 'down' ? '-1.2%' : '0%'}</span>
          </div>
        )}
      </div>

      <div>
        <h2 className={`text-2xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </h2>
        <p className={`text-xs mt-1 truncate ${highlight ? 'text-indigo-200' : 'text-slate-400'}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};
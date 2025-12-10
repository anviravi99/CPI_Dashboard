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
      relative overflow-hidden rounded-xl border p-5 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md
      ${highlight 
        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-600 text-white' 
        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }
    `}>
      <div className="flex justify-between items-start">
        <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
          {title}
        </p>
        {icon && <div>{icon}</div>}
        {!icon && trend && (
          <div className={`
            flex items-center justify-center w-6 h-6 rounded-full 
            ${highlight ? 'bg-white/20' : (trend === 'up' ? 'bg-green-50' : 'bg-red-50')}
          `}>
            {trend === 'up' && <ArrowUpRight size={14} className={highlight ? 'text-white' : 'text-green-600'} />}
            {trend === 'down' && <ArrowDownRight size={14} className={highlight ? 'text-white' : 'text-red-600'} />}
            {trend === 'neutral' && <Minus size={14} className={highlight ? 'text-white' : 'text-slate-400'} />}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <h2 className={`text-3xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </h2>
        <p className={`text-xs mt-1 truncate ${highlight ? 'text-indigo-100' : 'text-slate-400'}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  currency?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
}

export default function StatCard({ 
  label, 
  value, 
  currency = true, 
  trend = 'neutral',
  trendValue,
  variant = 'default'
}: StatCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger': return 'bg-danger-50 border-danger-100';
      case 'success': return 'bg-success-50 border-success-100';
      case 'warning': return 'bg-warning-50 border-warning-100';
      default: return 'bg-white border-slate-100';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'danger': return 'text-danger-700';
      case 'success': return 'text-success-700';
      case 'warning': return 'text-warning-700';
      default: return 'text-slate-900';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-slate-400';

  return (
    <div className={`stat-card ${getVariantClasses()}`}>
      <span className="stat-label">{label}</span>
      <div className="flex items-end justify-between">
        <span className={`stat-value ${getValueColor()}`}>
          {currency ? formatCurrency(value) : value.toLocaleString()}
        </span>
        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

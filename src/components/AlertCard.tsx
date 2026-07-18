import React from 'react';
import { AlertTriangle, Package, Banknote, Users, Clock } from 'lucide-react';
import type { AnomalyAlert } from '../types';
import { cn } from '../lib/utils';

interface AlertCardProps {
  alert: AnomalyAlert;
  onReview?: () => void;
  onDismiss?: () => void;
}

const typeConfig = {
  till_variance: { icon: Banknote, color: 'danger', label: 'Cash Variance' },
  stock_variance: { icon: Package, color: 'warning', label: 'Stock Variance' },
  sku_pattern: { icon: AlertTriangle, color: 'warning', label: 'SKU Pattern' },
  shift_pattern: { icon: Users, color: 'danger', label: 'Shift Pattern' },
};

export default function AlertCard({ alert, onReview, onDismiss }: AlertCardProps) {
  const config = typeConfig[alert.type];
  const Icon = config.icon;

  const colorClasses = {
    danger: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-dukaguard-50 border-dukaguard-200 text-dukaguard-800',
  };

  const scoreColor = alert.score > 0.7 ? 'text-danger-600' : alert.score > 0.4 ? 'text-warning-600' : 'text-dukaguard-600';
  const scoreBg = alert.score > 0.7 ? 'bg-danger-100' : alert.score > 0.4 ? 'bg-warning-100' : 'bg-dukaguard-100';

  return (
    <div className={cn('card border-l-4', colorClasses[config.color as keyof typeof colorClasses])}>
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', scoreBg)}>
          <Icon className={cn('h-5 w-5', scoreColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {config.label}
            </span>
            <span className={cn('badge text-xs', scoreBg, scoreColor)}>
              {(alert.score * 100).toFixed(0)}%
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 text-sm">{alert.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{new Date(alert.generatedAt).toLocaleDateString()}</span>
          </div>
          {(onReview || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onReview && (
                <button onClick={onReview} className="btn-sm btn-ghost text-xs px-3 py-1.5">
                  Review
                </button>
              )}
              {onDismiss && (
                <button onClick={onDismiss} className="btn-sm btn-ghost text-xs px-3 py-1.5 text-slate-400">
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

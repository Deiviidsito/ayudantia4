import type { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
};

export function StatCard({ icon, label, value, subtitle, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center text-accent-700">
            {icon}
          </div>
          <div>
            <p className="text-sm text-brand-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-brand-900 mt-0.5">{value}</p>
          </div>
        </div>
      </div>
      {subtitle && <p className="text-xs text-brand-400 mt-3">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        </div>
      )}
    </div>
  );
}

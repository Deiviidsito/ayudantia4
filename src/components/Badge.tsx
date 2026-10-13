import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
};

const variantStyles: Record<string, string> = {
  success: 'bg-green-100 text-green-800 ring-green-600/20',
  warning: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  error: 'bg-red-100 text-red-800 ring-red-600/20',
  neutral: 'bg-brand-100 text-brand-700 ring-brand-600/20',
  accent: 'bg-accent-100 text-accent-800 ring-accent-700/20',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}

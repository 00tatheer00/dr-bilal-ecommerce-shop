import React from 'react';
import { cn } from '@/lib/utils';
import type { BadgeVariant } from '@/types';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-surface text-text-secondary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error: 'bg-error-light text-error',
  info: 'bg-blue-50 text-info',
  brand: 'bg-brand-light text-brand',
};

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-body-xs inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

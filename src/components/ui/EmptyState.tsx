import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 text-text-secondary opacity-40">
          {icon}
        </div>
      )}
      <h3 className="text-heading-md mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm text-text-secondary mb-6 max-w-sm">{description}</p>
      )}
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </a>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

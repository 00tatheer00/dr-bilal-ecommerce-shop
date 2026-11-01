'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from '@/types';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#7A0C2E] via-[#560820] to-[#7A0C2E] text-white border border-[#DFB76C]/40 shadow-md hover:shadow-[0_10px_25px_rgba(122,12,46,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] btn-luxury-shine cursor-pointer',
  secondary:
    'bg-white border-2 border-[#7A0C2E] text-[#7A0C2E] hover:bg-[#7A0C2E] hover:text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer',
  ghost:
    'bg-transparent text-text-primary hover:bg-[#FDF2F4] hover:text-[#7A0C2E] active:scale-[0.98] cursor-pointer',
  danger:
    'bg-gradient-to-r from-[#991B1B] to-[#7A0C2E] text-white hover:shadow-lg active:scale-[0.98] cursor-pointer',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-xl tracking-wider',
  md: 'px-6 py-3 text-sm rounded-2xl tracking-wider',
  lg: 'px-8 py-3.5 text-sm sm:text-base rounded-2xl tracking-wider',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'text-button inline-flex items-center justify-center gap-2 font-bold transition-all duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A0C2E]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin text-[#DFB76C]" />}
      {children}
    </button>
  );
}

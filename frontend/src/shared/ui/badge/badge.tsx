import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium font-mono uppercase tracking-[0.05em] border transition-colors',
  {
    variants: {
      status: {
        pending: 'bg-[#1f1f1f] text-[#a4a19b] border-[#4b4b4b]',
        in_progress: 'bg-[#1a365d]/40 text-[#2b7fff] border-[#2b7fff]/40 animate-pulse',
        completed: 'bg-[#1f1f1f] text-[#eeeeee] border-[#eeeeee]/60',
        success: 'bg-[#182a1d] text-[#4ade80] border-[#22c55e]/40',
        failed: 'bg-[#2a1818] text-[#f87171] border-[#ef4444]/40',
        error: 'bg-[#2a1818] text-[#f87171] border-[#ef4444]/40',
        cancelled: 'bg-[#1f1f1f] text-[#5e5d59] border-[#323232] line-through',
        neutral: 'bg-[#262626] text-[#a4a19b] border-[#323232]',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  status?: 'pending' | 'in_progress' | 'completed' | 'success' | 'failed' | 'error' | 'cancelled' | 'neutral';
}

export function Badge({ className, status = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ status }), className)} {...props}>
      {children || status}
    </span>
  );
}

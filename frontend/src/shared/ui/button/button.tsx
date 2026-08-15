import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[4px] text-[14px] font-medium font-sans transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2b7fff] focus:ring-offset-2 focus:ring-offset-[#181818] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.99]',
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent border border-[#eeeeee] text-[#eeeeee] hover:bg-[#262626] hover:border-[#ffffff]',
        solid: 'bg-[#eeeeee] text-[#111111] hover:bg-[#ffffff] font-semibold',
        accent: 'bg-[#2b7fff] text-[#ffffff] hover:bg-[#256ee0] shadow-sm',
        danger: 'bg-[#2a1818] text-[#f87171] border border-[#ef4444]/40 hover:bg-[#381e1e]',
        subtle:
          'bg-[#1f1f1f] text-[#eeeeee] border border-[#323232] hover:bg-[#262626] hover:border-[#4b4b4b]',
      },
      size: {
        sm: 'h-8 px-3 text-[12px] gap-1.5',
        md: 'h-10 px-4 py-2 gap-2',
        lg: 'h-12 px-6 text-[15px] gap-2.5',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-current" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CopyButtonProps {
  text: string;
  label?: string;
  showTooltip?: boolean;
  className?: string;
  iconClassName?: string;
}

export function CopyButton({
  text,
  label,
  showTooltip = true,
  className,
  iconClassName = 'w-3.5 h-3.5',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        const timer = setTimeout(() => {
          setCopied(false);
        }, 1500);
        return () => clearTimeout(timer);
      } catch {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    },
    [text]
  );

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Скопировано!' : label || 'Скопировать в буфер'}
        className={cn(
          'inline-flex items-center gap-1.5 p-1 rounded-[4px] text-[#a4a19b] hover:text-[#eeeeee] hover:bg-[#262626] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#2b7fff] cursor-pointer',
          copied && 'text-[#4ade80] hover:text-[#4ade80]',
          className
        )}
        aria-label={label || 'Скопировать'}
      >
        {copied ? (
          <Check className={cn(iconClassName, 'text-[#4ade80] animate-in zoom-in-50 duration-150')} />
        ) : (
          <Copy className={iconClassName} />
        )}
        {label && <span className="text-[12px] font-sans">{label}</span>}
      </button>

      {/* Floating Copied Badge */}
      {showTooltip && copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#111111] text-[#4ade80] text-[10px] font-mono font-medium rounded-[3px] border border-[#1d4d33] shadow-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-90 duration-150 z-30">
          Скопировано!
        </span>
      )}
    </div>
  );
}

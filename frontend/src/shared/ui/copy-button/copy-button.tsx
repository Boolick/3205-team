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
    [text],
  );

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Скопировано!' : label || 'Скопировать в буфер'}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] p-1 text-[#a4a19b] transition-all duration-150 hover:bg-[#262626] hover:text-[#eeeeee] focus:ring-1 focus:ring-[#2b7fff] focus:outline-none',
          copied && 'text-[#4ade80] hover:text-[#4ade80]',
          className,
        )}
        aria-label={label || 'Скопировать'}
      >
        {copied ? (
          <Check
            className={cn(iconClassName, 'animate-in zoom-in-50 text-[#4ade80] duration-150')}
          />
        ) : (
          <Copy className={iconClassName} />
        )}
        {label && <span className="font-sans text-[12px]">{label}</span>}
      </button>

      {showTooltip && copied && (
        <span className="animate-in fade-in zoom-in-90 pointer-events-none absolute -top-7 left-1/2 z-30 -translate-x-1/2 rounded-[3px] border border-[#1d4d33] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-[#4ade80] shadow-md duration-150">
          Скопировано!
        </span>
      )}
    </div>
  );
}

import { Search } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { FilterStatus } from '../lib/filter-utils';

interface UrlFilterBarProps {
  selectedFilter: FilterStatus;
  searchQuery: string;
  counts: Record<FilterStatus, number>;
  onFilterChange: (filter: FilterStatus) => void;
  onSearchChange: (query: string) => void;
}

export function UrlFilterBar({
  selectedFilter,
  searchQuery,
  counts,
  onFilterChange,
  onSearchChange,
}: UrlFilterBarProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={cn(
            'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium transition-colors',
            selectedFilter === 'all'
              ? 'border-[#2b7fff] bg-[#2b7fff] text-[#ffffff]'
              : 'border-[#262626] bg-[#1a1a1a] text-[#a4a19b] hover:bg-[#262626] hover:text-[#eeeeee]',
          )}
        >
          Все ({counts.all})
        </button>

        {counts.success > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange('success')}
            className={cn(
              'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium transition-colors',
              selectedFilter === 'success'
                ? 'border-[#22c55e] bg-[#182a1d] text-[#4ade80]'
                : 'border-[#262626] bg-[#1a1a1a] text-[#a4a19b] hover:bg-[#262626] hover:text-[#eeeeee]',
            )}
          >
            Успешно ({counts.success})
          </button>
        )}

        {counts.error > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange('error')}
            className={cn(
              'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium transition-colors',
              selectedFilter === 'error'
                ? 'border-[#ef4444] bg-[#2a1818] text-[#f87171]'
                : 'border-[#262626] bg-[#1a1a1a] text-[#a4a19b] hover:bg-[#262626] hover:text-[#eeeeee]',
            )}
          >
            Ошибки ({counts.error})
          </button>
        )}

        {counts.in_progress > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange('in_progress')}
            className={cn(
              'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium transition-colors',
              selectedFilter === 'in_progress'
                ? 'border-[#2b7fff] bg-[#1a365d] text-[#2b7fff]'
                : 'border-[#262626] bg-[#1a1a1a] text-[#a4a19b] hover:bg-[#262626] hover:text-[#eeeeee]',
            )}
          >
            В процессе ({counts.in_progress})
          </button>
        )}

        {counts.pending > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange('pending')}
            className={cn(
              'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium transition-colors',
              selectedFilter === 'pending'
                ? 'border-[#4b4b4b] bg-[#262626] text-[#eeeeee]'
                : 'border-[#262626] bg-[#1a1a1a] text-[#a4a19b] hover:bg-[#262626] hover:text-[#eeeeee]',
            )}
          >
            В очереди ({counts.pending})
          </button>
        )}
      </div>

      <div className="relative min-w-[200px] sm:w-[240px]">
        <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#5e5d59]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по URL..."
          className="w-full rounded-[4px] border border-[#262626] bg-[#111111] py-1 pr-3 pl-8 font-sans text-[12px] text-[#eeeeee] placeholder-[#5e5d59] transition-colors focus:border-[#2b7fff] focus:outline-none"
        />
      </div>
    </div>
  );
}

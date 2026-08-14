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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={cn(
            'px-2.5 py-1 rounded-[4px] text-[12px] font-sans font-medium transition-colors cursor-pointer border',
            selectedFilter === 'all'
              ? 'bg-[#2b7fff] text-[#ffffff] border-[#2b7fff]'
              : 'bg-[#1a1a1a] text-[#a4a19b] border-[#262626] hover:bg-[#262626] hover:text-[#eeeeee]'
          )}
        >
          Все ({counts.all})
        </button>

        {counts.success > 0 && (
          <button
            type="button"
            onClick={() => onFilterChange('success')}
            className={cn(
              'px-2.5 py-1 rounded-[4px] text-[12px] font-sans font-medium transition-colors cursor-pointer border',
              selectedFilter === 'success'
                ? 'bg-[#182a1d] text-[#4ade80] border-[#22c55e]'
                : 'bg-[#1a1a1a] text-[#a4a19b] border-[#262626] hover:bg-[#262626] hover:text-[#eeeeee]'
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
              'px-2.5 py-1 rounded-[4px] text-[12px] font-sans font-medium transition-colors cursor-pointer border',
              selectedFilter === 'error'
                ? 'bg-[#2a1818] text-[#f87171] border-[#ef4444]'
                : 'bg-[#1a1a1a] text-[#a4a19b] border-[#262626] hover:bg-[#262626] hover:text-[#eeeeee]'
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
              'px-2.5 py-1 rounded-[4px] text-[12px] font-sans font-medium transition-colors cursor-pointer border',
              selectedFilter === 'in_progress'
                ? 'bg-[#1a365d] text-[#2b7fff] border-[#2b7fff]'
                : 'bg-[#1a1a1a] text-[#a4a19b] border-[#262626] hover:bg-[#262626] hover:text-[#eeeeee]'
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
              'px-2.5 py-1 rounded-[4px] text-[12px] font-sans font-medium transition-colors cursor-pointer border',
              selectedFilter === 'pending'
                ? 'bg-[#262626] text-[#eeeeee] border-[#4b4b4b]'
                : 'bg-[#1a1a1a] text-[#a4a19b] border-[#262626] hover:bg-[#262626] hover:text-[#eeeeee]'
            )}
          >
            В очереди ({counts.pending})
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[200px] sm:w-[240px]">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5e5d59]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по URL..."
          className="w-full bg-[#111111] border border-[#262626] rounded-[4px] pl-8 pr-3 py-1 text-[12px] font-sans text-[#eeeeee] placeholder-[#5e5d59] focus:border-[#2b7fff] focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}

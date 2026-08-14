import { JobItem, JobItemStatus } from '../../../entities/job';

export type FilterStatus = 'all' | JobItemStatus;

export function getJobUrlCounts(items: JobItem[]): Record<FilterStatus, number> {
  const counts: Record<FilterStatus, number> = {
    all: items.length,
    success: 0,
    error: 0,
    in_progress: 0,
    pending: 0,
    cancelled: 0,
  };

  items.forEach((item) => {
    if (counts[item.status] !== undefined) {
      counts[item.status] += 1;
    }
  });

  return counts;
}

export function filterJobUrls(
  items: JobItem[],
  statusFilter: FilterStatus,
  searchQuery: string
): JobItem[] {
  const query = searchQuery.toLowerCase().trim();

  return items.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = !query || item.url.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });
}

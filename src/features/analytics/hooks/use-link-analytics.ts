import { useQuery } from '@tanstack/react-query';
import { getLinkAnalytics } from '../api/get-link-analytics';
import type { AnalyticsFilters } from '../types/analytics.types';

export const useLinkAnalytics = (
  shortCode: string | undefined,
  filters: Partial<AnalyticsFilters>
) => {
  return useQuery({
    queryKey: ['analytics', shortCode, filters.from, filters.to, filters.timezone],
    queryFn: () => getLinkAnalytics(shortCode!, filters),
    enabled: !!shortCode && shortCode.trim() !== '',
    retry: false,
  });
};

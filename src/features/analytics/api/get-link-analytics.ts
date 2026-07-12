import { apiClient } from '../../../lib/api-client';
import type { LinkAnalytics, AnalyticsFilters } from '../types/analytics.types';

export const getLinkAnalytics = async (
  shortCode: string,
  filters?: Partial<AnalyticsFilters>
): Promise<LinkAnalytics> => {
  const { data } = await apiClient.get<LinkAnalytics>(`/api/v1/analytics/${shortCode}`, {
    params: filters,
  });
  return data;
};

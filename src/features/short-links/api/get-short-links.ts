import { apiClient } from '../../../lib/api-client';
import type { ShortLinkItem } from '../types/short-link.types';

export const getShortLinks = async (): Promise<ShortLinkItem[]> => {
  const { data } = await apiClient.get<ShortLinkItem[]>('/api/v1/urls');
  return data;
};

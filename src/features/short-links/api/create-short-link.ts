import { apiClient } from '../../../lib/api-client';
import type { CreateShortLinkRequest, CreateShortLinkResponse } from '../types/short-link.types';

export const createShortLink = async (
  request: CreateShortLinkRequest
): Promise<CreateShortLinkResponse> => {
  const { data } = await apiClient.post<CreateShortLinkResponse>('/api/v1/urls', request);
  return data;
};

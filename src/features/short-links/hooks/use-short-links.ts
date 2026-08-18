import { useQuery } from '@tanstack/react-query';
import { getShortLinks } from '../api/get-short-links';
import type { ShortLinkItem } from '../types/short-link.types';
import type { ApiError } from '../../../lib/api-client';

export const useShortLinks = () => {
  return useQuery<ShortLinkItem[], ApiError>({
    queryKey: ['short-links'],
    queryFn: getShortLinks,
    retry: false,
  });
};

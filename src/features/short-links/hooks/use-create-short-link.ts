import { useMutation } from '@tanstack/react-query';
import { createShortLink } from '../api/create-short-link';
import type { CreateShortLinkRequest, CreateShortLinkResponse } from '../types/short-link.types';
import type { ApiError } from '../../../lib/api-client';

export const useCreateShortLink = () => {
  return useMutation<
    CreateShortLinkResponse,
    ApiError,
    CreateShortLinkRequest
  >({
    mutationKey: ['create-short-link'],
    mutationFn: createShortLink,
  });
};

import { z } from 'zod';

export const normalizeUrl = (url: string): string => {
  if (!url) return url;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const isPrivateOrLocalUrl = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
    
    if (/^10\./.test(hostname)) return true;
    if (/^192\.168\./.test(hostname)) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return true;
    
    return false;
  } catch {
    return false;
  }
};

export const createShortLinkFormSchema = z.object({
  longUrl: z.string()
    .min(1, 'Enter a destination URL.')
    .max(2048, 'The URL must not exceed 2048 characters.')
    .transform((val) => normalizeUrl(val))
    .refine((val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'Enter a valid URL.')
    .refine((val) => !isPrivateOrLocalUrl(val), 'Private or local network addresses are not allowed.'),
  expirationPreset: z.enum(['7-days', '30-days', 'custom']),
  customExpirationDate: z.string().optional(),
  customExpirationTime: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required.'),
}).refine((data) => {
  if (data.expirationPreset === 'custom') {
    if (!data.customExpirationDate || !data.customExpirationTime) {
      return false;
    }
    try {
      const expirationDate = new Date(`${data.customExpirationDate}T${data.customExpirationTime}`);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: 'Expiration must be in the future.',
  path: ['customExpirationDate'],
});

export type CreateShortLinkFormValues = z.input<typeof createShortLinkFormSchema>;
export type CreateShortLinkTransformedValues = z.output<typeof createShortLinkFormSchema>;

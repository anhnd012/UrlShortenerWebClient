import axios, { AxiosError } from 'axios';
import { env } from './env';

export interface ApiError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface MockLinkItem {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  expiresAt: string;
  timezone: string;
  title: string;
  clicks: number;
  createdAt: string;
}

// Global mutable in-memory store for links in mock mode
const mockLinksList: MockLinkItem[] = [
  {
    shortCode: 'abc123',
    title: 'Google Java Style Guide',
    longUrl: 'https://google.github.io/styleguide/javaguide.html',
    shortUrl: `${env.publicShortUrlBase}/abc123`,
    createdAt: '2026-06-22T10:00:00',
    expiresAt: '2026-08-20T23:59:00',
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 120,
  },
  {
    shortCode: '4e8j1wH',
    title: 'Java Date Time Tutorial',
    longUrl: 'https://jenkov.com/tutorials/java-date-time/index.html',
    shortUrl: `${env.publicShortUrlBase}/4e8j1wH`,
    createdAt: '2026-06-13T09:15:00',
    expiresAt: '2026-07-10T23:59:00', // Expired on July 10, 2026 (local time is July 18, 2026)
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 45,
  },
  {
    shortCode: 'xyz789',
    title: 'Vite Config Documentation',
    longUrl: 'https://vite.dev/config/',
    shortUrl: `${env.publicShortUrlBase}/xyz789`,
    createdAt: '2026-07-01T14:30:00',
    expiresAt: '2026-09-01T23:59:00',
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 12,
  }
];

// Direct in-browser mock interceptor for rapid prototyping/mock mode
if (env.enableMockApi) {
  apiClient.interceptors.request.use(async (config) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const url = config.url || '';
    const method = config.method?.toLowerCase();

    // Mock create URL
    if (method === 'post' && (url === '/api/v1/urls' || url.endsWith('/api/v1/urls'))) {
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
      if (!body.longUrl) {
        config.adapter = () => Promise.reject({
          response: {
            status: 400,
            data: { message: 'Destination URL is required.' },
          },
          isAxiosError: true,
        });
      } else {
        const shortCode = body.backHalf || Math.random().toString(36).substring(2, 8);
        const shortUrl = `${env.publicShortUrlBase}/${shortCode}`;
        
        let title = body.title || 'Destination Link';
        if (!body.title) {
          try {
            const parsed = new URL(body.longUrl);
            title = parsed.hostname.replace('www.', '');
            title = title.charAt(0).toUpperCase() + title.slice(1);
          } catch {
            // ignore
          }
        }

        const newLink: MockLinkItem = {
          shortCode,
          title,
          longUrl: body.longUrl,
          shortUrl,
          createdAt: new Date().toISOString(),
          expiresAt: body.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: body.timezone || 'Asia/Ho_Chi_Minh',
          clicks: 0,
        };
        mockLinksList.push(newLink);

        config.adapter = () => Promise.resolve({
          data: {
            shortCode,
            shortUrl,
          },
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        } as any);
      }
      return config;
    }

    // Mock get all links
    if (method === 'get' && url.includes('/api/v1/urls')) {
      config.adapter = () => Promise.resolve({
        data: mockLinksList,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as any);
      return config;
    }

    // Mock get analytics
    if (method === 'get' && url.includes('/api/v1/analytics/')) {
      const parts = url.split('/api/v1/analytics/');
      const shortCode = parts[parts.length - 1].split('?')[0];

      if (shortCode === 'notfound' || shortCode === 'invalid') {
        config.adapter = () => Promise.reject({
          response: {
            status: 404,
            data: { message: 'No analytics were found for this short code.' },
          },
          isAxiosError: true,
        });
      } else {
        const dailyClicks: { date: string; clicks: number }[] = [];
        let totalClicks = 0;
        const today = new Date();

        // Check if there is an in-memory click count, otherwise generate random
        const link = mockLinksList.find((l) => l.shortCode === shortCode);
        const baseClicks = link ? link.clicks : 120;

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          let clicks = 0;
          if (shortCode === 'abc123' || (link && link.shortCode === 'abc123')) {
            clicks = [12, 18, 5, 22, 15, 28, 20][6 - i];
          } else {
            // Distribute base clicks roughly across 7 days
            clicks = Math.floor((baseClicks / 7) * (0.5 + Math.random()));
          }

          dailyClicks.push({ date: dateString, clicks });
          totalClicks += clicks;
        }

        config.adapter = () => Promise.resolve({
          data: {
            shortCode,
            totalClicks,
            dailyClicks,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as any);
      }
      return config;
    }

    return config;
  });
}

export const normalizeError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) || (error && typeof error === 'object' && 'isAxiosError' in error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      code?: string;
      fieldErrors?: Record<string, string>;
    }>;
    
    if (!axiosError.response) {
      return {
        message: 'Could not connect to the server.',
        code: 'NETWORK_ERROR',
      };
    }
    
    const status = axiosError.response.status;
    const data = axiosError.response.data;
    
    let message = data?.message || 'An unexpected error occurred.';
    const code = data?.code || `HTTP_${status}`;
    const fieldErrors = data?.fieldErrors;
    
    if (status === 400) {
      message = data?.message || 'Please review the form and try again.';
    } else if (status === 409) {
      message = data?.message || 'This short code already exists. Please try again.';
    } else if (status >= 500) {
      message = 'The server could not create the link. Try again later.';
    }
    
    return {
      status,
      code,
      message,
      fieldErrors,
    };
  }
  
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred.',
    code: 'UNKNOWN_ERROR',
  };
};

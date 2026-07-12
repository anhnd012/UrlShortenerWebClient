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

// Direct in-browser mock interceptor for rapid prototyping/mock mode
if (env.enableMockApi) {
  apiClient.interceptors.request.use(async (config) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const url = config.url || '';
    const method = config.method?.toLowerCase();

    // Mock create URL
    if (method === 'post' && (url === '/api/v1/urls' || url.endsWith('/api/v1/urls'))) {
      const body = JSON.parse(config.data || '{}');
      if (!body.longUrl) {
        return Promise.reject({
          response: {
            status: 400,
            data: { message: 'Destination URL is required.' },
          },
          isAxiosError: true,
        });
      }

      const shortCode = Math.random().toString(36).substring(2, 8);
      return {
        data: {
          shortCode,
          shortUrl: `${env.publicShortUrlBase}/${shortCode}`,
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      } as any;
    }

    // Mock get analytics
    if (method === 'get' && url.includes('/api/v1/analytics/')) {
      const parts = url.split('/api/v1/analytics/');
      const shortCode = parts[parts.length - 1].split('?')[0];

      if (shortCode === 'notfound' || shortCode === 'invalid') {
        return Promise.reject({
          response: {
            status: 404,
            data: { message: 'No analytics were found for this short code.' },
          },
          isAxiosError: true,
        });
      }

      const dailyClicks = [];
      let totalClicks = 0;
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const clicks = shortCode === 'abc123'
          ? [12, 18, 5, 22, 15, 28, 20][6 - i]
          : Math.floor(Math.random() * 30);
        dailyClicks.push({ date: dateString, clicks });
        totalClicks += clicks;
      }

      return {
        data: {
          shortCode,
          totalClicks,
          dailyClicks,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as any;
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

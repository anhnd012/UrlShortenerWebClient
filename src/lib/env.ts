const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const publicShortUrlBase = import.meta.env.VITE_PUBLIC_SHORT_URL_BASE;
const enableMockApi = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
const requireAuthForCreate = import.meta.env.VITE_REQUIRE_AUTH_FOR_CREATE === 'true';

if (!enableMockApi) {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined in environment variables.');
  }
  if (!publicShortUrlBase) {
    throw new Error('VITE_PUBLIC_SHORT_URL_BASE is not defined in environment variables.');
  }
}

export const env = {
  apiBaseUrl: apiBaseUrl || 'http://localhost:8080',
  publicShortUrlBase: publicShortUrlBase || 'http://localhost:8080',
  enableMockApi,
  requireAuthForCreate,
};

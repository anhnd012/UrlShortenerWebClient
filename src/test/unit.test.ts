import { describe, it, expect } from 'vitest';
import { normalizeUrl, isPrivateOrLocalUrl } from '../features/short-links/schemas/create-short-link.schema';
import { getDefaultTimezone, calculateExpirationDate, formatLocalDateTime } from '../lib/date-time';

describe('URL Validation & Normalization', () => {
  it('should prepend https:// if missing', () => {
    expect(normalizeUrl('google.com')).toBe('https://google.com');
    expect(normalizeUrl('http://google.com')).toBe('http://google.com');
    expect(normalizeUrl('https://google.com')).toBe('https://google.com');
  });

  it('should detect private and local URLs', () => {
    expect(isPrivateOrLocalUrl('https://localhost')).toBe(true);
    expect(isPrivateOrLocalUrl('http://127.0.0.1')).toBe(true);
    expect(isPrivateOrLocalUrl('https://192.168.1.10')).toBe(true);
    expect(isPrivateOrLocalUrl('http://10.0.0.1')).toBe(true);
    expect(isPrivateOrLocalUrl('https://172.16.0.5')).toBe(true);
    expect(isPrivateOrLocalUrl('https://google.com')).toBe(false);
  });
});

describe('Date & Time Utilities', () => {
  it('should get default timezone', () => {
    const tz = getDefaultTimezone();
    expect(tz).toBeDefined();
    expect(typeof tz).toBe('string');
  });

  it('should calculate offset date-time properly', () => {
    const now = new Date();
    const future = calculateExpirationDate(7);
    const diff = future.getTime() - now.getTime();
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(7);
  });

  it('should format ISO local string', () => {
    const date = new Date('2026-07-12T02:00:00.000Z');
    const formatted = formatLocalDateTime(date);
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });
});

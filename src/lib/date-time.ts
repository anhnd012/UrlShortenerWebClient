import { addDays, format } from 'date-fns';

export function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
  } catch {
    return 'Asia/Ho_Chi_Minh';
  }
}

export function calculateExpirationDate(days: number): Date {
  return addDays(new Date(), days);
}

export function formatLocalDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function formatReadableDate(dateStr: string, timezone?: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    // Format readable date like "July 20, 2026, 11:59 PM"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateStr;
  }
}

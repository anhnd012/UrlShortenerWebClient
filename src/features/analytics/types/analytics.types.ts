export interface DailyClick {
  date: string;
  clicks: number;
}

export interface LinkAnalytics {
  shortCode: string;
  totalClicks: number;
  dailyClicks: DailyClick[];
}

export interface AnalyticsFilters {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  timezone: string;
}

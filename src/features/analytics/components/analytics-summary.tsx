import React from 'react';
import { BarChart3, TrendingUp, Calendar, CalendarDays } from 'lucide-react';
import type { DailyClick } from '../types/analytics.types';
import { formatReadableDate } from '../../../lib/date-time';

interface AnalyticsSummaryProps {
  totalClicks: number;
  dailyClicks: DailyClick[];
  fromDateStr: string;
  toDateStr: string;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  totalClicks,
  dailyClicks,
  fromDateStr,
  toDateStr,
}) => {
  // 1. Calculate number of days in range
  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

  // 2. Average clicks per day
  const averageClicksPerDay = diffDays > 0 ? (totalClicks / diffDays).toFixed(1) : '0';

  // 3. Highest-click day
  let highestClickDay: DailyClick | null = null;
  if (dailyClicks && dailyClicks.length > 0) {
    highestClickDay = dailyClicks.reduce(
      (max, day) => (day.clicks > max.clicks ? day : max),
      dailyClicks[0]
    );
  }

  // Format dates for display
  const dateRangeDisplay = `${formatReadableDate(fromDateStr).split(',')[0]} - ${
    formatReadableDate(toDateStr).split(',')[0]
  }`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Clicks */}
      <div className="rounded-card border border-border bg-surface p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Total Clicks
          </span>
          <div className="rounded bg-primary-soft p-1.5 text-primary">
            <BarChart3 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-[28px] font-semibold leading-[34px] tracking-tight text-text-primary">
            {totalClicks}
          </span>
          <p className="mt-1 text-xs text-text-muted">Total redirects completed</p>
        </div>
      </div>

      {/* Average Clicks / Day */}
      <div className="rounded-card border border-border bg-surface p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Daily Average
          </span>
          <div className="rounded bg-success-soft p-1.5 text-success">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-[28px] font-semibold leading-[34px] tracking-tight text-text-primary">
            {averageClicksPerDay}
          </span>
          <p className="mt-1 text-xs text-text-muted">Clicks per day on average</p>
        </div>
      </div>

      {/* Highest Click Day */}
      <div className="rounded-card border border-border bg-surface p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Peak Day
          </span>
          <div className="rounded bg-warning-soft p-1.5 text-warning">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-[28px] font-semibold leading-[34px] tracking-tight text-text-primary truncate block">
            {highestClickDay && highestClickDay.clicks > 0
              ? `${highestClickDay.clicks} clicks`
              : '0 clicks'}
          </span>
          <p className="mt-1 text-xs text-text-muted truncate">
            {highestClickDay && highestClickDay.clicks > 0
              ? formatReadableDate(highestClickDay.date).split(',')[0]
              : 'No activity registered'}
          </p>
        </div>
      </div>

      {/* Filtered Range */}
      <div className="rounded-card border border-border bg-surface p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Reporting Range
          </span>
          <div className="rounded bg-info-soft p-1.5 text-info">
            <CalendarDays className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-base font-semibold leading-[34px] tracking-tight text-text-primary block truncate">
            {dateRangeDisplay}
          </span>
          <p className="mt-1 text-xs text-text-muted">
            {diffDays} {diffDays === 1 ? 'day' : 'days'} selected
          </p>
        </div>
      </div>
    </div>
  );
};

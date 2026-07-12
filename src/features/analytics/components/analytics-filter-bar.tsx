import React, { useState } from 'react';
import { Calendar, Globe, RefreshCw } from 'lucide-react';
import type { AnalyticsFilters } from '../types/analytics.types';
import { getDefaultTimezone } from '../../../lib/date-time';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh — GMT+7' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore — GMT+8' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo — GMT+9' },
  { value: 'Europe/London', label: 'Europe/London — GMT+0' },
  { value: 'Europe/Paris', label: 'Europe/Paris — GMT+1' },
  { value: 'America/New_York', label: 'America/New_York — GMT-5' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles — GMT-8' },
];

interface AnalyticsFilterBarProps {
  initialFilters: AnalyticsFilters;
  onApply: (filters: AnalyticsFilters) => void;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  initialFilters,
  onApply,
}) => {
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);
  const browserTz = getDefaultTimezone();
  
  const timezoneOptions = TIMEZONES.some((tz) => tz.value === browserTz)
    ? TIMEZONES
    : [{ value: browserTz, label: `${browserTz} — Local Timezone` }, ...TIMEZONES];

  const handleChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters);
  };

  const handleReset = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const resetVals = {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
      timezone: browserTz,
    };
    setFilters(resetVals);
    onApply(resetVals);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-subtle lg:flex-row lg:items-end"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-1">
        {/* From Date */}
        <div className="space-y-1.5 lg:w-48">
          <label
            htmlFor="from"
            className="flex items-center gap-1 text-xs font-semibold text-text-secondary"
          >
            <Calendar className="h-3.5 w-3.5" />
            From Date
          </label>
          <input
            type="date"
            id="from"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
            className="block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* To Date */}
        <div className="space-y-1.5 lg:w-48">
          <label
            htmlFor="to"
            className="flex items-center gap-1 text-xs font-semibold text-text-secondary"
          >
            <Calendar className="h-3.5 w-3.5" />
            To Date
          </label>
          <input
            type="date"
            id="to"
            value={filters.to}
            onChange={(e) => handleChange('to', e.target.value)}
            className="block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-1.5 flex-1">
          <label
            htmlFor="filter-timezone"
            className="flex items-center gap-1 text-xs font-semibold text-text-secondary"
          >
            <Globe className="h-3.5 w-3.5" />
            Timezone
          </label>
          <select
            id="filter-timezone"
            value={filters.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
          >
            {timezoneOptions.map((tz) => (
              <option
                key={tz.value}
                value={tz.value}
              >
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 lg:mb-0.5">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors lg:flex-none"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center rounded-button bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-colors lg:flex-none"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

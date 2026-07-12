import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/common/page-header';
import { AnalyticsFilterBar } from '../features/analytics/components/analytics-filter-bar';
import { AnalyticsSummary } from '../features/analytics/components/analytics-summary';
import { DailyClicksChart } from '../features/analytics/components/daily-clicks-chart';
import { DailyClicksTable } from '../features/analytics/components/daily-clicks-table';
import { useLinkAnalytics } from '../features/analytics/hooks/use-link-analytics';
import type { AnalyticsFilters } from '../features/analytics/types/analytics.types';
import type { ApiError } from '../lib/api-client';
import { getDefaultTimezone } from '../lib/date-time';
import { LoadingState } from '../components/common/loading-state';
import { ErrorState } from '../components/common/error-state';
import { EmptyState } from '../components/common/empty-state';
import { Search, Share2, PlusCircle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  // Search input state
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Initialize filters (last 7 days by default)
  const browserTz = getDefaultTimezone();
  const getInitialFilters = (): AnalyticsFilters => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    return {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
      timezone: browserTz,
    };
  };

  const [filters, setFilters] = useState<AnalyticsFilters>(getInitialFilters());

  // Fetch analytics if shortCode parameter exists
  const { data, isLoading, error, refetch } = useLinkAnalytics(shortCode, filters);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    
    // Inline validation
    if (!trimmed) {
      setSearchError('Enter a short code.');
      return;
    }
    if (trimmed.length > 20) {
      setSearchError('Short code must not exceed 20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(trimmed)) {
      setSearchError('Short code must only contain letters, numbers, hyphens, and underscores.');
      return;
    }

    setSearchError(null);
    navigate(`/analytics/${trimmed}`);
  };

  // 1. Search view (no short code in url)
  if (!shortCode) {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <PageHeader
          title="Search Analytics"
          description="Enter a short code to view redirect performance."
        />

        <form
          onSubmit={handleSearchSubmit}
          className="rounded-card border border-border bg-surface p-6 shadow-subtle space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="shortCode"
              className="block text-sm font-semibold text-text-primary"
            >
              Short Code
            </label>
            <div className="relative rounded-input shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="shortCode"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="e.g. abc123"
                className={`block w-full rounded-input border ${
                  searchError ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'
                } bg-surface py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none transition-colors`}
              />
            </div>
            {searchError && (
              <p className="text-xs font-medium text-danger">{searchError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-button bg-primary py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            View analytics
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Need to generate a code first?{' '}
            <Link to="/create" className="text-primary hover:underline font-semibold">
              Create a link
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // 2. Detail mode: loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description={`Performance for /${shortCode}`}
        />
        <LoadingState message="Loading link analytics..." />
      </div>
    );
  }

  // 3. Detail mode: error state
  if (error) {
    const apiError = error as ApiError;
    let errorTitle = 'Analytics could not be loaded';
    let errorDesc = apiError.message || 'An unexpected error occurred.';

    if (apiError.status === 404) {
      errorTitle = 'Link not found';
      errorDesc = 'No analytics were found for this short code.';
    } else if (apiError.status === 400) {
      errorTitle = 'Invalid parameters';
      errorDesc = 'The selected date range or timezone is invalid.';
    }

    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description={`Performance for /${shortCode}`}
        />
        <ErrorState
          title={errorTitle}
          description={errorDesc}
          onRetry={refetch}
        />
        <div className="flex justify-center">
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  // 4. Detail mode: empty state (no clicks recorded yet)
  if (!data || data.totalClicks === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description={`Performance for /${shortCode}`}
          actions={
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors"
            >
              Back to Search
            </Link>
          }
        />
        
        <AnalyticsFilterBar
          initialFilters={filters}
          onApply={setFilters}
        />

        <EmptyState
          title="No clicks yet"
          description="Share the short link to start collecting analytics. Once visitors open it, click details will appear here."
          icon={Share2}
          action={
            <div className="flex gap-3">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Create another link
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  // 5. Detail mode: success view (clicks recorded)
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={`Performance for /${shortCode}`}
        actions={
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors"
          >
            Back to Search
          </Link>
        }
      />

      <AnalyticsFilterBar
        initialFilters={filters}
        onApply={setFilters}
      />

      <AnalyticsSummary
        totalClicks={data.totalClicks}
        dailyClicks={data.dailyClicks}
        fromDateStr={filters.from}
        toDateStr={filters.to}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Line Chart */}
        <div className="lg:col-span-7">
          <DailyClicksChart data={data.dailyClicks} />
        </div>

        {/* Breakdown Table */}
        <div className="lg:col-span-5">
          <DailyClicksTable
            dailyClicks={data.dailyClicks}
            totalClicks={data.totalClicks}
          />
        </div>
      </div>
    </div>
  );
};

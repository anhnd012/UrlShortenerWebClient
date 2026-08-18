import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShortLinks } from '../features/short-links/hooks/use-short-links';
import { PageHeader } from '../components/common/page-header';
import { LoadingState } from '../components/common/loading-state';
import { EmptyState } from '../components/common/empty-state';
import { useToast } from '../components/common/toast';
import { copyToClipboard } from '../lib/clipboard';
import { formatReadableDate } from '../lib/date-time';
import { useShortLinksSocket } from '../features/short-links/hooks/use-short-links-socket';
import {
  Search,
  Calendar,
  PlusCircle,
  Copy,
  ExternalLink,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { ShortLinkItem } from '../features/short-links/types/short-link.types';

const FALLBACK_MOCK_LINKS = [
  {
    shortCode: 'abc123',
    title: 'Google Java Style Guide',
    longUrl: 'https://google.github.io/styleguide/javaguide.html',
    shortUrl: 'http://localhost:8080/abc123',
    createdAt: '2026-06-22T10:00:00',
    expiresAt: '2026-08-20T23:59:00',
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 120,
  },
  {
    shortCode: '4e8j1wH',
    title: 'Java Date Time Tutorial',
    longUrl: 'https://jenkov.com/tutorials/java-date-time/index.html',
    shortUrl: 'http://localhost:8080/4e8j1wH',
    createdAt: '2026-06-13T09:15:00',
    expiresAt: '2026-07-10T23:59:00',
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 45,
  },
  {
    shortCode: 'xyz789',
    title: 'Vite Config Documentation',
    longUrl: 'https://vite.dev/config/',
    shortUrl: 'http://localhost:8080/xyz789',
    createdAt: '2026-07-01T14:30:00',
    expiresAt: '2026-09-01T23:59:00',
    timezone: 'Asia/Ho_Chi_Minh',
    clicks: 12,
  }
];

export const LinksPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: links, isLoading, error } = useShortLinks();

  useShortLinksSocket();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (url: string, code: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedCode(code);
      toast('Copied short URL to clipboard!', 'success');
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      toast('Could not copy link', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Links" description="Manage your shortened links" />
        <LoadingState message="Loading links directory..." />
      </div>
    );
  } 

  // Helper to determine link status based on date (local time is July 18, 2026)
  const getLinkStatus = (expiresAt: string): 'active' | 'expired' => {
    const expiration = Date.parse(expiresAt);
    const now = Date.now();
    return expiration < now ? 'expired' : 'active';
  };

  // Determine list of links to render (cast rawLinks as any to safely handle { urls: [...] } objects from backend)
  const rawLinks: any = error ? FALLBACK_MOCK_LINKS : links;

  const linkArray: ShortLinkItem[] = Array.isArray(rawLinks)
    ? rawLinks
    : rawLinks?.urls || rawLinks?.content || [];

  // Filter links on the client side
  const filteredLinks = linkArray.filter((link) => {
    // 1. Search filter (safely match title, longUrl, or shortCode with null checks)
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (link.title || '').toLowerCase().includes(searchLower) ||
      (link.longUrl || '').toLowerCase().includes(searchLower) ||
      (link.shortCode || '').toLowerCase().includes(searchLower);

    // 2. Status filter
    const status = getLinkStatus(link.expiresAt);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && status === 'active') ||
      (statusFilter === 'expired' && status === 'expired');

    // 3. Date filter (match createdAt date)
    const matchesDate =
      !dateFilter || link.createdAt.split('T')[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Links"
        description="View redirects, edit targets, and copy active codes."
        actions={
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Create link
          </Link>
        }
      />

      {/* Backend 405 Connection Fallback Notice */}
      {error && (
        <div className="rounded-card border border-warning/20 bg-warning-soft p-4 text-warning space-y-1.5 animate-slide-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Backend Mock Mode Active</h4>
          </div>
          <p className="text-xs leading-relaxed font-semibold">
            GET /api/v1/urls returned status code 405. Displaying local mock data list so you can preview the link cards, search, and filter features.
          </p>
        </div>
      )}

      {/* Filter toolbar bar */}
      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-input border border-border bg-surface py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Date / Status filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block rounded-input border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary focus:outline-none focus:border-primary"
              title="Filter by created date"
            />
          </div>

          {/* Status selector dropdown */}
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block rounded-input border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary focus:outline-none focus:border-primary"
            >
              <option value="all">Show: All</option>
              <option value="active">Show: Active</option>
              <option value="expired">Show: Expired</option>
            </select>
          </div>

          {/* Clear filters */}
          {(searchTerm || statusFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Links list */}
      {filteredLinks.length === 0 ? (
        <EmptyState
          title="No links matched"
          description="Try broadening your search term or clearing the selected status/date filters."
          action={
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredLinks.map((link) => {
            const status = getLinkStatus(link.expiresAt);
            const isCopied = copiedCode === link.shortCode;

            return (
              <div
                key={link.shortCode}
                className="group flex flex-col justify-between rounded-card border border-border bg-surface p-5 hover:border-border-strong hover:shadow-subtle transition-all duration-200"
              >
                {/* Upper row: title & details */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Link Name / Title */}
                    <h3 className="text-base font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors truncate">
                      {link.title}
                    </h3>
                    
                    {/* Shortcode URL */}
                    <div className="flex items-center gap-2">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-primary hover:underline truncate"
                      >
                        {link.shortUrl.replace('http://', '').replace('https://', '')}
                      </a>
                      <button
                        onClick={() => handleCopy(link.shortUrl, link.shortCode)}
                        className="rounded p-1 text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
                        aria-label="Copy short URL"
                      >
                        {isCopied ? (
                          <CheckCircle className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Destination URL */}
                    <a
                      href={link.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors truncate max-w-full"
                    >
                      <span className="truncate">{link.longUrl}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>

                  {/* Actions & Status details aligned right on desktop */}
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:flex-row">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-semibold border ${
                        status === 'active'
                          ? 'bg-success-soft border-success/15 text-success'
                          : 'bg-danger-soft border-danger/15 text-danger'
                      }`}
                    >
                      {status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>

                {/* Lower row: badges and analytics redirect link */}
                <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Badges details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                    {/* Click Stats */}
                    <span className="flex items-center gap-1.5 font-semibold">
                      <BarChart3 className="h-4 w-4 text-text-muted" />
                      {link.numberOfClicks} clicks
                    </span>
                    
                    {/* Created Date */}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-text-muted" />
                      Created {(formatReadableDate(link.createdAt) || 'N/A').split(',')[0]}
                    </span>

                    {/* Expiration date */}
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-text-muted" />
                      {status === 'active' ? 'Expires' : 'Expired'} {(formatReadableDate(link.expiresAt) || 'N/A').split(',')[0]}
                    </span>
                  </div>

                  {/* Analytics redirect link button */}
                  <button
                    onClick={() => navigate(`/analytics/${link.shortCode}`)}
                    className="inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-xs font-bold text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    View analytics
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default LinksPage;

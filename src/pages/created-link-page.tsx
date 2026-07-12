import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Copy, ExternalLink, Calendar, PlusCircle, BarChart3, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/common/page-header';
import { useToast } from '../components/common/toast';
import { copyToClipboard } from '../lib/clipboard';
import { formatReadableDate } from '../lib/date-time';

export const CreatedLinkPage: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const result = location.state?.result as {
    shortCode: string;
    shortUrl: string;
    longUrl: string;
    expiresAt: string;
    timezone: string;
  } | undefined;

  const handleCopy = async () => {
    if (!result) return;
    const success = await copyToClipboard(result.shortUrl);
    if (success) {
      setCopied(true);
      toast('Short URL copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast('Could not copy the link', 'error');
    }
  };

  if (!result) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6">
        <div className="rounded-full bg-warning-soft p-3 text-warning mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          No recently created link was found
        </h2>
        <p className="text-sm text-text-secondary max-w-sm mb-6">
          To get a short link, configure your destination URL and click submit.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Create a short link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Your short link is ready"
        description="Copy it, open it, or view click analytics metrics."
      />

      <div className="rounded-card border border-border bg-surface p-6 shadow-subtle space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="rounded-full bg-success-soft p-3 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Link created successfully!
            </h3>
            <p className="text-sm text-text-secondary">
              The short URL has been generated and is now active.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
            Short URL
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={result.shortUrl}
              className="block w-full rounded-input border border-border bg-surface-muted px-4 py-3 text-sm text-primary font-semibold select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-[110px] justify-center"
              aria-label="Copy short link"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-2">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
              Destination URL
            </span>
            <a
              href={result.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline truncate max-w-full"
            >
              <span className="truncate">{result.longUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
            </a>
          </div>

          <div className="space-y-1">
            <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
              Expires On
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
              <Calendar className="h-4 w-4 text-text-secondary" />
              <span className="truncate">
                {formatReadableDate(result.expiresAt, result.timezone)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/create"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Create another link
          </Link>

          <Link
            to={`/analytics/${result.shortCode}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-button bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            View analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

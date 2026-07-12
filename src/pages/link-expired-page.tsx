import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarX, PlusCircle } from 'lucide-react';
import { formatReadableDate } from '../lib/date-time';

export const LinkExpiredPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const expiresAt = searchParams.get('expiredAt');
  const timezone = searchParams.get('timezone') || undefined;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <div className="rounded-full bg-danger-soft p-4 text-danger mb-4 border border-danger/10 shadow-subtle">
        <CalendarX className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        This link has expired
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        The owner configured this link to expire. Access is no longer available.
      </p>

      {expiresAt && (
        <div className="bg-surface-muted rounded-card border border-border p-3 mb-8 w-full text-xs text-text-secondary">
          <strong>Expired on:</strong>{' '}
          <span className="text-text-primary font-semibold">
            {formatReadableDate(expiresAt, timezone)}
          </span>
        </div>
      )}

      <Link
        to="/create"
        className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        Create a new short link
      </Link>
    </div>
  );
};

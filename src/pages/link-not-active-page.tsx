import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, PlusCircle } from 'lucide-react';
import { formatReadableDate } from '../lib/date-time';

export const LinkNotActivePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeFrom = searchParams.get('activeFrom');
  const timezone = searchParams.get('timezone') || undefined;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <div className="rounded-full bg-warning-soft p-4 text-warning mb-4 border border-warning/10 shadow-subtle">
        <Clock className="h-10 w-10 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        This link is not active yet
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        This short link has not reached its activation time. Please check back later.
      </p>

      {activeFrom && (
        <div className="bg-surface-muted rounded-card border border-border p-3 mb-8 w-full text-xs text-text-secondary">
          <strong>Available starting:</strong>{' '}
          <span className="text-text-primary font-semibold">
            {formatReadableDate(activeFrom, timezone)}
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

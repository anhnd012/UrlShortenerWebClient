import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, PlusCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <div className="rounded-full bg-surface-muted p-4 text-text-muted mb-4 border border-border shadow-subtle animate-pulse">
        <HelpCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        Link not found
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed mb-8">
        The short link may be incorrect, has been removed, or no longer exists. Please verify the URL code.
      </p>
      <Link
        to="/create"
        className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <PlusCircle className="h-4 w-4" />
        Create a new short link
      </Link>
    </div>
  );
};
export default NotFoundPage;

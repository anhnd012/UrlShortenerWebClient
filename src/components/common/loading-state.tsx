import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading dashboard...',
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm font-medium text-text-secondary">{message}</p>
    </div>
  );
};

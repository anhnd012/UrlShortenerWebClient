import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon: Icon = HelpCircle,
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface p-8 text-center shadow-subtle">
      <div className="rounded-full bg-surface-muted p-3 text-text-muted mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
};

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-8">
      <div>
        <h1 className="text-[28px] font-semibold leading-[34px] tracking-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-[22px] text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

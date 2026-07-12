import React from 'react';
import { Menu, Link2 } from 'lucide-react';
import { UserMenu } from './user-menu';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 shadow-subtle lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-text-secondary hover:bg-surface-muted lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <Link2 className="h-5 w-5 text-primary" />
          <span className="text-md font-semibold tracking-tight text-text-primary">
            LinkFlow
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
};

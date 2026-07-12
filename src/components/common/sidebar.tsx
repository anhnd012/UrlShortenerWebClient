import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link2, BarChart3, PlusCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { to: '/create', label: 'Create Link', icon: PlusCircle },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-text-primary/20 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-300 lg:static lg:translate-x-0',
          // Desktop Width sizing
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-60',
          // Mobile responsive overlay
          isMobileOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header Title */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link2 className="h-6 w-6 text-primary flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-lg font-semibold tracking-tight text-text-primary truncate animate-slide-in">
                LinkFlow
              </span>
            )}
          </div>
          
          {/* Close button for Mobile drawer */}
          <button
            onClick={onMobileClose}
            className="rounded p-1 text-text-secondary hover:bg-surface-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              title={isCollapsed && !isMobileOpen ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-button py-2.5 text-sm font-semibold transition-all',
                  isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate animate-slide-in">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button on Desktop */}
        <div className="hidden border-t border-border p-3 lg:flex justify-end">
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="rounded-button border border-border p-1.5 text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full flex justify-center"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Footer / Version Tag */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="border-t border-border p-4 text-center animate-slide-in">
            <p className="text-[10px] text-text-muted">LinkFlow Dashboard v1.0</p>
          </div>
        )}
      </aside>
    </>
  );
};

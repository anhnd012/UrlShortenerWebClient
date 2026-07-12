import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/sidebar';
import { Topbar } from '../components/common/topbar';

const LOCAL_STORAGE_KEY = 'linkflow.sidebar.collapsed';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, String(isCollapsed));
    } catch (err) {
      console.warn('Failed to save sidebar collapsed state in localStorage', err);
    }
  }, [isCollapsed]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Nav */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      
      {/* Main Panel Content */}
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300">
        <Topbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1280px] animate-slide-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

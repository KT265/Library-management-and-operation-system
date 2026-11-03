import React from 'react';
import { Outlet } from 'react-router-dom';
import { StorefrontHeader } from '../components/common/StorefrontHeader';
import { FloatingCartDrawer } from '../components/common/FloatingCartDrawer';
import { StorefrontFooter } from '../components/common/StorefrontFooter';
import { ToastNotification } from '../components/common/ToastNotification';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* 1. Fixed Top Navigation Bar */}
      <StorefrontHeader />

      {/* 2. Main Viewport Content Area */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-14rem)] flex flex-col flex-1">
        <Outlet />
      </main>

      {/* 3. Global Floating Cart FAB & Slide-over Drawer */}
      <FloatingCartDrawer />

      {/* 4. Global Toast Notification Container */}
      <ToastNotification />

      {/* 5. Editorial Commerce 4-Column Footer */}
      <StorefrontFooter />
    </div>
  );
};

export default StorefrontLayout;

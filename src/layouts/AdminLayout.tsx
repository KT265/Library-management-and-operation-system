import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Fixed 72-unit Sidebar */}
      <AdminSidebar />

      {/* Main Offset Container (72-unit left padding) */}
      <div className="pl-72 min-h-screen flex flex-col bg-surface">
        {/* Fixed Top Header */}
        <AdminHeader />

        {/* Child Screen Outlet Container */}
        <main className="relative pt-20 w-full px-gutter-lg bg-surface min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

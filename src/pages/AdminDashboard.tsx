import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { DashboardHeader } from '../components/admin-dashboard/DashboardHeader';
import { KpiMetricsBento } from '../components/admin-dashboard/KpiMetricsBento';
import { SalesTrajectoryChart } from '../components/admin-dashboard/SalesTrajectoryChart';
import { RecentOrdersTable } from '../components/admin-dashboard/RecentOrdersTable';
import { LowStockAlertsCard } from '../components/admin-dashboard/LowStockAlertsCard';

export const AdminDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('30');
  const showToast = useStore((state) => state.showToast);

  const handleExportReport = () => {
    showToast?.('Đang kết xuất báo cáo tổng quan hoạt động kinh doanh định dạng PDF/CSV...');
  };

  return (
    <div
      id="admin-dashboard-page"
      data-testid="admin-dashboard-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-xl"
    >
      {/* 1. Header with Title, Range Selector, and Export Action */}
      <DashboardHeader
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onExportReport={handleExportReport}
      />

      {/* 2. Top 4 KPI Metric Bento Cards */}
      <KpiMetricsBento />

      {/* 3. Sales Trajectory & Run-Rate SVG Visualization */}
      <SalesTrajectoryChart />

      {/* 4. Bottom Grid: Recent Orders & Warehouse Stock Alerts */}
      <div
        id="dashboard-bottom-grid"
        data-testid="admin-dashboard-bottom-grid"
        className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg"
      >
        {/* Left: Recent Orders Stream */}
        <RecentOrdersTable />

        {/* Right: Low Stock Alerts */}
        <LowStockAlertsCard />
      </div>
    </div>
  );
};

export default AdminDashboard;

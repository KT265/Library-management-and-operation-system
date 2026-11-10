import React from 'react';

export const KpiMetricsBento: React.FC = () => {
  return (
    <div
      id="dashboard-kpi-grid"
      data-testid="admin-dashboard-kpi-grid"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md"
    >
      {/* Card 1: Doanh thu thuần */}
      <div
        id="revenueMetric"
        data-testid="admin-dashboard-kpi-card-revenue"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary-container/40 blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Doanh thu thuần
          </span>
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-revenue-value"
              data-testid="admin-dashboard-kpi-value-revenue"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              1.225.000.000 ₫
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Đơn hàng thành công */}
      <div
        id="ordersMetric"
        data-testid="admin-dashboard-kpi-card-orders"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Đơn hàng thành công
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-orders-value"
              data-testid="admin-dashboard-kpi-value-orders"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              1.482
            </span>
            <span className="text-secondary font-title-sm text-title-sm">đơn</span>
          </div>
        </div>
      </div>

      {/* Card 3: Sách tồn kho */}
      <div
        id="circulationMetric"
        data-testid="admin-dashboard-kpi-card-circulation"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Tổng đầu sách
          </span>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">auto_stories</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-circulation-value"
              data-testid="admin-dashboard-kpi-value-circulation"
              className="font-display-md text-display-md font-bold text-tertiary tracking-tight num-tabular"
            >
              324
            </span>
            <span className="text-tertiary font-title-sm text-title-sm">cuốn</span>
          </div>          
        </div>
      </div>

      {/* Card 4: Độc giả hoạt động */}
      <div
        id="patronsMetric"
        data-testid="admin-dashboard-kpi-card-patrons"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Độc giả hoạt động
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-patrons-value"
              data-testid="admin-dashboard-kpi-value-patrons"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              8.920
            </span>
            <span className="text-secondary font-title-sm text-title-sm">thành viên</span>
          </div>       
        </div>
      </div>
    </div>
  );
};

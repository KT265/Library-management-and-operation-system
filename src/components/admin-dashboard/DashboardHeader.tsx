import React from 'react';

interface DashboardHeaderProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  return (
    <div
      id="dashboard-header"
      data-testid="admin-dashboard-header"
      className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
    >
      <div>
        <h1
          id="admin-dashboard-title"
          data-testid="admin-dashboard-header-title"
          className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight"
        >
          Tổng quan Hoạt động
        </h1>
        <p
          id="admin-dashboard-subtitle"
          data-testid="admin-dashboard-header-subtitle"
          className="font-body-md text-body-md text-secondary mt-1"
        >
          Báo cáo thống kê doanh số, tiến độ lưu hành và lưu lượng độc giả thời gian thực
        </p>
      </div>

      {/* Actions: Date Range Selector Pill */}
      <div
        id="dashboard-header-actions"
        data-testid="admin-dashboard-header-actions"
        className="flex items-center gap-space-sm flex-wrap"
      >
        <div
          id="date-range-container"
          data-testid="admin-dashboard-header-range-wrapper"
          className="relative inline-flex items-center bg-surface-container-lowest rounded-full px-space-md py-2 shadow-sm text-on-surface border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-outline text-[18px] mr-2">
            calendar_today
          </span>
          <select
            id="date-range-select"
            data-testid="admin-dashboard-header-range-select"
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value)}
            className="bg-transparent font-label-lg text-label-lg text-on-surface focus:outline-none cursor-pointer appearance-none pr-6"
          >
            <option value="1">Hôm nay</option>
            <option value="7">Tuần này</option>
            <option value="30">30 ngày qua</option>
            <option value="90">Quý này</option>
          </select>
          <span className="material-symbols-outlined text-outline text-[16px] absolute right-3 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
};

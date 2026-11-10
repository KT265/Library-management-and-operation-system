import React from 'react';

interface UsersKpisGridProps {
  adminCount: number;
  userCount: number;
}

export const UsersKpisGrid: React.FC<UsersKpisGridProps> = ({
  adminCount,
  userCount,
}) => {
  return (
    <div
      id="users-kpis-grid"
      data-testid="admin-users-kpis-grid"
      className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-xl w-full"
    >
      {/* Metric 1: Admin */}
      <div
        id="kpi-card-admin"
        data-testid="admin-users-kpi-admin"
        className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex flex-col justify-between border border-surface-container/40"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-secondary font-semibold">
            Quản trị viên (Admin)
          </span>
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-admin-count"
              data-testid="admin-users-kpi-admin-count"
              className="font-headline-md text-headline-md text-primary font-bold"
            >
              {adminCount.toLocaleString('vi-VN')}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
            Toàn quyền hệ thống &amp; phân hệ quản trị
          </p>
        </div>
      </div>

      {/* Metric 2: User */}
      <div
        id="kpi-card-user"
        data-testid="admin-users-kpi-user"
        className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex flex-col justify-between border border-surface-container/40"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-secondary font-semibold">
            Người dùng (User)
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">person</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-user-count"
              data-testid="admin-users-kpi-user-count"
              className="font-headline-md text-headline-md text-on-surface font-bold"
            >
              {userCount.toLocaleString('vi-VN')}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
            Mua sách, bình luận và quản lý đơn
          </p>
        </div>
      </div>
    </div>
  );
};

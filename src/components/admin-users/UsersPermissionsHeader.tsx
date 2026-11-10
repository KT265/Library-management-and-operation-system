import React from 'react';

export interface UsersPermissionsHeaderProps {
  onOpenCreateModal?: () => void;
  onExportCSV?: () => void;
}

export const UsersPermissionsHeader: React.FC<UsersPermissionsHeaderProps> = () => {
  return (
    <div
      id="users-permissions-header"
      data-testid="admin-users-header"
      className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-xs mb-space-lg"
    >
      <div className="space-y-1">
        <h1
          id="users-permissions-title"
          data-testid="admin-users-title"
          className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold"
        >
          Quản lý Phân quyền Người dùng
        </h1>
        <p
          id="users-permissions-description"
          data-testid="admin-users-description"
          className="font-body-md text-body-md text-on-surface-variant max-w-2xl"
        >
          Quản lý danh sách tài khoản, kiểm soát quyền hạn truy cập và chỉ định vai trò (Quản trị viên / Người dùng) trên toàn hệ thống BookVerse.
        </p>
      </div>
    </div>
  );
};

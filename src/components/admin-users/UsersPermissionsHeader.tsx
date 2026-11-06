import React from 'react';

interface UsersPermissionsHeaderProps {
  onOpenCreateModal: () => void;
  onExportCSV: () => void;
}

export const UsersPermissionsHeader: React.FC<UsersPermissionsHeaderProps> = ({
  onOpenCreateModal,
  onExportCSV,
}) => {
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

      <div
        id="users-permissions-actions"
        data-testid="admin-users-actions"
        className="flex items-center gap-space-sm shrink-0 flex-wrap"
      >
        <button
          type="button"
          id="btn-export-users-csv"
          data-testid="admin-users-btn-export-csv"
          onClick={onExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-xs cursor-pointer"
          title="Xuất dữ liệu người dùng ra file CSV"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Xuất CSV</span>
        </button>

        <button
          type="button"
          id="btn-create-new-user"
          data-testid="admin-users-btn-create-user"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow-sm transition-all cursor-pointer"
          title="Thêm tài khoản người dùng mới"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Thêm người dùng mới</span>
        </button>
      </div>
    </div>
  );
};

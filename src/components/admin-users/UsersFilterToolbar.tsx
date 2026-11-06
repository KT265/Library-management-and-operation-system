import React from 'react';
import { UserRole, UserStatus } from './types';

interface UsersFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: 'all' | UserRole;
  onRoleSelect: (role: 'all' | UserRole) => void;
  selectedStatus: 'all' | UserStatus;
  onStatusChange: (status: 'all' | UserStatus) => void;
  onRefresh: () => void;
  totalCount: number;
  adminCount: number;
  userCount: number;
}

export const UsersFilterToolbar: React.FC<UsersFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleSelect,
  selectedStatus,
  onStatusChange,
  onRefresh,
  totalCount,
  adminCount,
  userCount,
}) => {
  return (
    <div
      id="users-filter-toolbar"
      data-testid="admin-users-toolbar"
      className="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm mb-space-md border border-surface-container/40"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        {/* Search Box */}
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="userSearchInput"
            data-testid="admin-users-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo họ tên, email, UID hoặc số điện thoại..."
            className="w-full h-11 pl-11 pr-10 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              id="btn-clear-user-search"
              data-testid="admin-users-btn-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Role Tabs Pills */}
          <div
            id="role-filter-pills"
            data-testid="admin-users-role-pills"
            className="p-1 rounded-full bg-surface-container flex items-center text-label-sm font-label-sm"
          >
            <button
              type="button"
              id="role-pill-all"
              data-testid="admin-users-role-pill-all"
              onClick={() => onRoleSelect('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedRole === 'all'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tất cả ({totalCount.toLocaleString('vi-VN')})
            </button>

            <button
              type="button"
              id="role-pill-admin"
              data-testid="admin-users-role-pill-admin"
              onClick={() => onRoleSelect('admin')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Quản trị viên ({adminCount.toLocaleString('vi-VN')})
            </button>

            <button
              type="button"
              id="role-pill-user"
              data-testid="admin-users-role-pill-user"
              onClick={() => onRoleSelect('user')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedRole === 'user'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Người dùng ({userCount.toLocaleString('vi-VN')})
            </button>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              id="statusFilter"
              data-testid="admin-users-status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as 'all' | UserStatus)}
              className="h-10 pl-4 pr-9 rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-transparent hover:border-outline-variant/60 transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Tạm khóa</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            id="btn-refresh-user-table"
            data-testid="admin-users-btn-refresh"
            onClick={onRefresh}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shadow-xs"
            title="Làm mới dữ liệu"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

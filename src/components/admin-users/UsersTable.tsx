import React from 'react';
import { AdminManagedUser } from './types';
import { UserTableRow } from './UserTableRow';

interface UsersTableProps {
  users: AdminManagedUser[];
  onEditRole: (user: AdminManagedUser) => void;
  onToggleLock: (user: AdminManagedUser) => void;
  onViewSecurityLog: (user: AdminManagedUser) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalSystemCount: number;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEditRole,
  onToggleLock,
  onViewSecurityLog,
  currentPage,
  onPageChange,
  totalSystemCount,
}) => {
  const hasUsers = users.length > 0;
  const pageSize = 7;

  // When user dataset exceeds pageSize (e.g. after interactive user additions in session),
  // slice to current page view; if baseline sample dataset (length <= pageSize),
  // display the showcase sample rows across mocked pages.
  let displayedUsers = users;
  let startIndex = 0;
  let endIndex = 0;

  if (hasUsers) {
    if (users.length > pageSize) {
      const pageStartIndex = (currentPage - 1) * pageSize;
      const sliced = users.slice(pageStartIndex, pageStartIndex + pageSize);
      displayedUsers = sliced.length > 0 ? sliced : users.slice(0, pageSize);
      startIndex = pageStartIndex + 1;
      endIndex = Math.min(pageStartIndex + displayedUsers.length, totalSystemCount);
    } else {
      displayedUsers = users;
      startIndex = Math.min((currentPage - 1) * pageSize + 1, totalSystemCount);
      endIndex = Math.min(
        startIndex + (currentPage === 1 ? users.length : pageSize) - 1,
        totalSystemCount
      );
    }
  }

  const displayRange = hasUsers
    ? `${startIndex.toLocaleString('vi-VN')} - ${Math.max(startIndex, endIndex).toLocaleString('vi-VN')}`
    : '0';

  return (
    <div
      id="users-table-container"
      data-testid="admin-users-table-container"
      className="bg-surface-container-lowest rounded-DEFAULT shadow-sm overflow-hidden mb-space-md border border-surface-container/40"
    >
      <div className="overflow-x-auto">
        <table
          id="userTable"
          data-testid="admin-users-table"
          className="w-full text-left font-body-md text-body-md min-w-[760px]"
        >
          <thead>
            <tr className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider border-b border-surface-container">
              <th className="py-3.5 px-space-md font-semibold">Người dùng &amp; Tài khoản</th>
              <th className="py-3.5 px-space-md font-semibold">Số điện thoại</th>
              <th className="py-3.5 px-space-md font-semibold">Chi tiêu tích lũy</th>
              <th className="py-3.5 px-space-md font-semibold">Vai trò phân quyền</th>
              <th className="py-3.5 px-space-md font-semibold">Trạng thái</th>
              <th className="py-3.5 px-space-md font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody
            id="userTableBody"
            data-testid="admin-users-table-body"
            className="divide-y divide-surface-container"
          >
            {hasUsers &&
              displayedUsers.map((u) => (
                <UserTableRow
                  key={u.id}
                  user={u}
                  onEditRole={onEditRole}
                  onToggleLock={onToggleLock}
                  onViewSecurityLog={onViewSecurityLog}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!hasUsers && (
        <div
          id="noResultsState"
          data-testid="admin-users-empty-state"
          className="py-space-xl px-space-md text-center"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-high text-secondary flex items-center justify-center mx-auto mb-space-sm shadow-xs">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <h4 className="font-title-md text-title-md text-primary font-bold">
            Không tìm thấy tài khoản phù hợp
          </h4>
          <p className="font-body-sm text-body-sm text-secondary mt-1">
            Vui lòng thử từ khóa khác hoặc điều chỉnh lại bộ lọc vai trò.
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      <div
        id="users-pagination-footer"
        data-testid="admin-users-pagination"
        className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container"
      >
        <div className="font-body-sm text-body-sm text-secondary">
          Hiển thị{' '}
          <span className="font-semibold text-on-surface">
            {displayRange}
          </span>{' '}
          trong{' '}
          <span className="font-semibold text-on-surface">
            {totalSystemCount.toLocaleString('vi-VN')}
          </span>{' '}
          tài khoản
        </div>

        <div className="flex items-center gap-1 font-label-md text-label-md">
          <button
            type="button"
            id="btn-page-prev"
            data-testid="admin-users-page-prev"
            disabled={!hasUsers || currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded-full bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Trang trước"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <button
            type="button"
            id="btn-page-1"
            data-testid="admin-users-page-1"
            disabled={!hasUsers}
            onClick={() => onPageChange(1)}
            className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              currentPage === 1
                ? 'bg-primary text-on-primary'
                : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            1
          </button>

          <button
            type="button"
            id="btn-page-2"
            data-testid="admin-users-page-2"
            disabled={!hasUsers}
            onClick={() => onPageChange(2)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              currentPage === 2
                ? 'bg-primary text-on-primary font-semibold'
                : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            2
          </button>

          <button
            type="button"
            id="btn-page-3"
            data-testid="admin-users-page-3"
            disabled={!hasUsers}
            onClick={() => onPageChange(3)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              currentPage === 3
                ? 'bg-primary text-on-primary font-semibold'
                : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            3
          </button>

          <span className="px-1 text-outline">...</span>

          <button
            type="button"
            id="btn-page-last"
            data-testid="admin-users-page-last"
            disabled={!hasUsers}
            onClick={() => onPageChange(407)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              currentPage === 407
                ? 'bg-primary text-on-primary font-semibold'
                : 'hover:bg-surface-container text-on-surface'
            }`}
          >
            407
          </button>

          <button
            type="button"
            id="btn-page-next"
            data-testid="admin-users-page-next"
            disabled={!hasUsers || currentPage >= 407}
            onClick={() => onPageChange(Math.min(407, currentPage + 1))}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Trang sau"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

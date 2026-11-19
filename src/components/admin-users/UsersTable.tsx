import React from 'react';
import { AdminManagedUser } from './types';
import { UserTableRow } from './UserTableRow';

interface UsersTableProps {
  users: AdminManagedUser[];
  onEditRole: (user: AdminManagedUser) => void;
  onToggleLock?: (user: AdminManagedUser) => void;
  onViewSecurityLog?: (user: AdminManagedUser) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalSystemCount?: number;
  itemsPerPage?: number;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEditRole,
  currentPage,
  onPageChange,
  itemsPerPage = 7,
}) => {
  const hasUsers = users.length > 0;
  const pageSize = itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  const pageStartIndex = (currentPage - 1) * pageSize;
  const displayedUsers = hasUsers
    ? users.slice(pageStartIndex, pageStartIndex + pageSize)
    : [];

  const getPaginationItems = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  };

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
              <th className="py-3.5 px-space-md font-semibold">Vai trò phân quyền</th>
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
        className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-end border-t border-surface-container"
      >
        <div className="flex items-center gap-1 font-label-md text-label-md">
          <button
            type="button"
            id="btn-page-prev"
            data-testid="admin-users-page-prev"
            disabled={!hasUsers || currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded-full bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Trang trước"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {hasUsers &&
            getPaginationItems().map((item, idx) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-outline select-none flex items-center justify-center"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(item);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  id={`btn-page-${pageNum}`}
                  data-testid={`admin-users-page-${pageNum}`}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center shadow-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

          <button
            type="button"
            id="btn-page-next"
            data-testid="admin-users-page-next"
            disabled={!hasUsers || currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Trang sau"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

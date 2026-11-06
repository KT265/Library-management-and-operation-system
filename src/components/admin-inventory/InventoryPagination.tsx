import React from 'react';

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export const InventoryPagination: React.FC<InventoryPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div
      id="inventoryPagination"
      data-testid="admin-inventory-pagination"
      className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface font-body-sm text-body-sm"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <span
          id="pagination-count-indicator"
          data-testid="admin-inventory-pagination-indicator"
          className="text-secondary"
        >
          Hiển thị <span className="font-semibold text-primary num-tabular">{startItem}</span> -{' '}
          <span className="font-semibold text-primary num-tabular">{endItem}</span> trên tổng số{' '}
          <span className="font-semibold text-primary num-tabular">{totalItems}</span> ấn bản
        </span>

        <div className="inline-flex items-center gap-2">
          <label htmlFor="rowsPerPageSelect" className="text-secondary text-xs">
            Số dòng mỗi trang:
          </label>
          <select
            id="rowsPerPageSelect"
            data-testid="admin-inventory-pagination-select-rows"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          id="btn-prev-page"
          data-testid="admin-inventory-pagination-btn-prev"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
            currentPage <= 1
              ? 'border-outline-variant/20 text-outline/50 cursor-not-allowed bg-surface-container-lowest'
              : 'border-outline-variant/40 text-primary hover:bg-surface-container cursor-pointer'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Trước</span>
        </button>

        <span
          id="page-indicator-text"
          data-testid="admin-inventory-pagination-current-page"
          className="px-3 py-1 font-semibold text-primary text-xs num-tabular"
        >
          Trang {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          id="btn-next-page"
          data-testid="admin-inventory-pagination-btn-next"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
            currentPage >= totalPages
              ? 'border-outline-variant/20 text-outline/50 cursor-not-allowed bg-surface-container-lowest'
              : 'border-outline-variant/40 text-primary hover:bg-surface-container cursor-pointer'
          }`}
        >
          <span>Sau</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

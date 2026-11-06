import React from 'react';
import { VoucherFilterOptions } from './types';

interface VoucherToolbarProps {
  filterOptions: VoucherFilterOptions;
  onFilterChange: (updates: Partial<VoucherFilterOptions>) => void;
  onRefresh: () => void;
  matchCount: number;
}

export const VoucherToolbar: React.FC<VoucherToolbarProps> = ({
  filterOptions,
  onFilterChange,
  onRefresh,
  matchCount,
}) => {
  return (
    <div
      id="voucher-toolbar"
      data-testid="admin-vouchers-toolbar"
      className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
    >
      {/* Top Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined text-outline text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            id="voucher-search-input"
            name="searchVoucherInput"
            data-testid="admin-vouchers-toolbar-input-search"
            value={filterOptions.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder="Tìm mã ưu đãi, tên chiến dịch hoặc điều khoản áp dụng..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          />
          {filterOptions.searchTerm && (
            <button
              type="button"
              id="clear-voucher-search-btn"
              data-testid="admin-vouchers-toolbar-btn-clear-search"
              onClick={() => onFilterChange({ searchTerm: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Dropdowns & Refresh Cluster */}
        <div className="flex items-center gap-space-sm flex-wrap">
          {/* Status Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              id="status-filter-select"
              data-testid="admin-vouchers-toolbar-select-status"
              value={filterOptions.statusFilter}
              onChange={(e) =>
                onFilterChange({
                  statusFilter: e.target.value as VoucherFilterOptions['statusFilter'],
                })
              }
              className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
            >
              <option value="all">Tất cả trạng thái (All Statuses)</option>
              <option value="active">Đang áp dụng (Active Only)</option>
              <option value="expiring">Sắp hết hạn (Expiring Soon)</option>
              <option value="expired">Đã hết hạn (Expired)</option>
            </select>
            <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Discount Type Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              id="type-filter-select"
              data-testid="admin-vouchers-toolbar-select-type"
              value={filterOptions.typeFilter}
              onChange={(e) =>
                onFilterChange({
                  typeFilter: e.target.value as VoucherFilterOptions['typeFilter'],
                })
              }
              className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
            >
              <option value="all">Tất cả loại giảm (All Discount Types)</option>
              <option value="fixed">Giảm số tiền cố định (₫)</option>
              <option value="percent">Giảm theo tỷ lệ phần trăm (%)</option>
              <option value="shipping">Miễn phí vận chuyển (Free Shipping)</option>
            </select>
            <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Match Count Indicator */}
          <span
            id="vouchers-match-count"
            data-testid="admin-vouchers-toolbar-match-count"
            className="text-xs text-secondary font-medium whitespace-nowrap hidden sm:inline-block"
          >
            Hiển thị: <strong className="text-primary num-tabular">{matchCount}</strong> mã
          </span>

          {/* Refresh Table Button */}
          <button
            type="button"
            id="refresh-table-btn"
            data-testid="admin-vouchers-toolbar-btn-refresh"
            title="Làm mới danh sách"
            onClick={onRefresh}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface flex items-center justify-center transition-transform hover:scale-105 active:rotate-180 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

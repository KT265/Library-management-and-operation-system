import React from 'react';
import { OrdersFilterState } from './types';

interface OrdersFilterToolbarProps {
  filterState: OrdersFilterState;
  onFilterChange: (updates: Partial<OrdersFilterState>) => void;
  onResetFilters: () => void;
}

export const OrdersFilterToolbar: React.FC<OrdersFilterToolbarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
}) => {
  const statusTabs: { key: OrdersFilterState['statusChip']; label: string }[] = [
    { key: 'All', label: 'Tất cả' },
    { key: 'Pending', label: 'Chờ xử lý' },
    { key: 'Delivered', label: 'Đã giao hàng' },
    { key: 'Cancelled', label: 'Đã huỷ' },
  ];

  return (
    <div
      id="orders-filter-toolbar"
      data-testid="admin-orders-toolbar"
      className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
    >
      {/* Upper Row: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined text-outline text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            id="orderSearchInput"
            name="searchOrdersInput"
            data-testid="admin-orders-toolbar-input-search"
            value={filterState.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder="Lọc theo mã đơn hàng, tên độc giả hoặc tựa sách..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          />
          {filterState.searchTerm && (
            <button
              type="button"
              id="clear-order-search-btn"
              data-testid="admin-orders-toolbar-btn-clear-search"
              onClick={() => onFilterChange({ searchTerm: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Payment Filter Dropdown */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="relative inline-flex items-center">
            <select
              id="orderFilterStatus"
              data-testid="admin-orders-toolbar-select-payment"
              value={filterState.paymentFilter}
              onChange={(e) =>
                onFilterChange({
                  paymentFilter: e.target.value as OrdersFilterState['paymentFilter'],
                })
              }
              className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
            >
              <option value="all">Phương thức: Tất cả</option>
              <option value="vietqr">Thanh toán qua VietQR</option>
              <option value="cod">Thanh toán tiền mặt khi nhận hàng (COD)</option>
            </select>
            <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          <button
            type="button"
            id="btn-reset-order-filters"
            data-testid="admin-orders-toolbar-btn-reset"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-outline-variant/30 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* Lower Row: Status Chips & Date Range Picker */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container-high/60">
        {/* Status Chips */}
        <div
          id="order-status-chips"
          data-testid="admin-orders-toolbar-chips"
          className="flex items-center gap-1.5 flex-wrap"
        >
          {statusTabs.map((tab) => {
            const isActive = filterState.statusChip === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                id={`chip-status-${tab.key.toLowerCase()}`}
                data-testid={`admin-orders-toolbar-chip-${tab.key.toLowerCase()}`}
                onClick={() => onFilterChange({ statusChip: tab.key })}
                className={`filter-chip px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'active-filter bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-low text-secondary hover:text-on-surface border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Vietnamese Date Range Controls */}
        <div
          id="orders-date-range-container"
          data-testid="admin-orders-toolbar-date-range"
          className="flex items-center gap-2 text-xs text-secondary flex-wrap"
        >
          <span className="font-medium text-on-surface">Khoảng thời gian:</span>
          <div className="inline-flex items-center gap-1">
            <label htmlFor="fromDateInput" className="text-secondary">
              Từ ngày
            </label>
            <input
              type="date"
              id="fromDateInput"
              data-testid="admin-orders-toolbar-input-from-date"
              value={filterState.fromDate}
              onChange={(e) => onFilterChange({ fromDate: e.target.value })}
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="inline-flex items-center gap-1">
            <label htmlFor="toDateInput" className="text-secondary">
              Đến ngày
            </label>
            <input
              type="date"
              id="toDateInput"
              data-testid="admin-orders-toolbar-input-to-date"
              value={filterState.toDate}
              onChange={(e) => onFilterChange({ toDate: e.target.value })}
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { StockFilterType, SortOptionType } from './types';

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  stockFilter: StockFilterType;
  onStockChange: (stk: StockFilterType) => void;
  sortOption: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
  categories: string[];
  onExportCsv: () => void;
}

export const InventoryToolbar: React.FC<InventoryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  sortOption,
  onSortChange,
  categories,
}) => {
  return (
    <div
      id="inventory-toolbar"
      data-testid="admin-inventory-toolbar"
      className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md"
    >
      {/* Search Input Box */}
      <div className="relative flex-1 min-w-[260px]">
        <span className="material-symbols-outlined text-outline text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          search
        </span>
        <input
          type="text"
          id="searchInventoryInput"
          data-testid="admin-inventory-toolbar-input-search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo mã ISBN-13, tựa sách, tác giả..."
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            id="clear-search-btn"
            data-testid="admin-inventory-toolbar-btn-clear-search"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Cluster */}
      <div className="flex items-center gap-space-sm flex-wrap">
        {/* Category Filter Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            id="categoryFilterSelect"
            data-testid="admin-inventory-toolbar-select-category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="all">Tất cả thể loại</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Stock Filter Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            id="stockFilterSelect"
            data-testid="admin-inventory-toolbar-select-stock"
            value={stockFilter}
            onChange={(e) => onStockChange(e.target.value as StockFilterType)}
            className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="all">Tất cả tình trạng</option>
            <option value="healthy">Tồn kho tốt (&gt; 10 cuốn)</option>
            <option value="low">Sắp hết (1 - 5 cuốn)</option>
            <option value="out">Hết hàng (0 cuốn)</option>
          </select>
          <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Sort Selector */}
        <div className="relative inline-flex items-center">
          <select
            id="sortSelect"
            data-testid="admin-inventory-toolbar-select-sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOptionType)}
            className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 pr-8 text-label-md font-label-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="stock-desc">Tồn kho giảm dần</option>
            <option value="stock-asc">Tồn kho tăng dần</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
          <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
};

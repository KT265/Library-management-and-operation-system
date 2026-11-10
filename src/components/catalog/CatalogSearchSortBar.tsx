import React from 'react';

export type CatalogSortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'rated';

interface CatalogSearchSortBarProps {
  displayedCount: number;
  totalCount: number;
  sortBy: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  onToggleMobileFilter: () => void;
}

export const CatalogSearchSortBar: React.FC<CatalogSearchSortBarProps> = ({
  displayedCount,
  totalCount,
  sortBy,
  onSortChange,
  onToggleMobileFilter,
}) => {
  return (
    <div
      id="catalog-search-sort-bar"
      data-testid="catalog-search-sort-bar-container"
      className="bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        {/* Left: Title & Count Badge */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <h2
            data-testid="catalog-search-sort-heading"
            className="font-title-md text-title-md font-bold text-primary"
            aria-label="Catalog Results"
          >
            Danh mục tuyển chọn
            <span className="sr-only"> (Catalog Results)</span>
          </h2>
          <span
            data-testid="catalog-search-sort-badge-count"
            className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold"
          >
            Hiển thị {displayedCount} trên {totalCount} ấn phẩm
          </span>
        </div>

        {/* Right: Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            id="mobileFilterToggle"
            data-testid="catalog-search-sort-btn-mobile-filter"
            aria-label="Refine Filters"
            onClick={onToggleMobileFilter}
            className="lg:hidden flex items-center gap-2 px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Bộ lọc</span>
            <span className="sr-only"> (Refine Filters)</span>
          </button>

          <label
            htmlFor="sortDropdown"
            className="font-label-md text-label-md text-on-surface-variant shrink-0"
          >
            Sắp xếp:
          </label>
          <div className="relative min-w-[210px]">
            <select
              id="sortDropdown"
              data-testid="catalog-search-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
              className="w-full appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
            >
              <option value="featured">Nổi bật & Tuyển chọn</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
              <option value="newest">Mới nhập kho</option>
              <option value="rated">Đánh giá cao nhất</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

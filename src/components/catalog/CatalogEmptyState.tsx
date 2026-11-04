import React from 'react';

interface CatalogEmptyStateProps {
  onResetFilters: () => void;
}

export const CatalogEmptyState: React.FC<CatalogEmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div
      id="catalog-empty-state"
      data-testid="catalog-empty-state-container"
      className="w-full py-16 text-center bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center"
    >
      <span className="material-symbols-outlined text-outline text-[48px] mb-2 block">search_off</span>
      <h3
        data-testid="catalog-empty-state-title"
        className="font-title-lg text-title-lg font-bold text-primary mb-1"
      >
        Không tìm thấy cuốn sách nào phù hợp
        <span className="sr-only"> (No books matched your criteria)</span>
      </h3>
      <p
        data-testid="catalog-empty-state-desc"
        className="font-body-md text-on-surface-variant mb-4 max-w-md"
      >
        Hãy thử tìm kiếm với từ khóa khác hoặc bỏ bớt các tiêu chí lọc để khám phá thêm nhiều ấn bản thú vị.
      </p>
      <button
        type="button"
        data-testid="catalog-empty-state-btn-reset"
        onClick={onResetFilters}
        className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-lg shadow-sm hover:bg-primary-container transition-all cursor-pointer"
      >
        Xóa tìm kiếm &amp; Đặt lại bộ lọc
      </button>
    </div>
  );
};

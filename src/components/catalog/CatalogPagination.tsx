import React from 'react';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div
      id="catalog-pagination"
      data-testid="catalog-pagination-container"
      className="mt-space-lg bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md"
    >
      {/* Page status text */}
      <div
        data-testid="catalog-pagination-status"
        className="font-body-sm text-body-sm text-on-surface-variant"
      >
        Trang <span className="font-bold text-primary">{currentPage}</span> /{' '}
        <span className="font-bold text-primary">{totalPages}</span>
        <span className="sr-only">
          Page <span className="font-bold text-primary">{currentPage}</span> of{' '}
          <span className="font-bold text-primary">{totalPages}</span>
        </span>{' '}
        (Hiển thị {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
        {Math.min(currentPage * pageSize, totalItems)} trên {totalItems} ấn phẩm)
      </div>

      {/* Page Number Cluster */}
      <div className="flex items-center gap-1.5" data-testid="catalog-pagination-cluster">
        <button
          type="button"
          aria-label="Previous Page"
          data-testid="catalog-pagination-btn-prev"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        <button
          type="button"
          data-testid="catalog-pagination-btn-page-1"
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 rounded-full font-label-md text-label-md font-bold shadow-sm cursor-pointer ${
            currentPage === 1
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
          }`}
        >
          1
        </button>

        {totalPages >= 2 && (
          <button
            type="button"
            data-testid="catalog-pagination-btn-page-2"
            onClick={() => onPageChange(2)}
            className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
              currentPage === 2
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            2
          </button>
        )}

        {totalPages >= 3 && (
          <button
            type="button"
            data-testid="catalog-pagination-btn-page-3"
            onClick={() => onPageChange(3)}
            className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
              currentPage === 3
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            3
          </button>
        )}

        {totalPages > 4 && (
          <span className="w-8 text-center text-outline font-label-md text-label-md select-none">...</span>
        )}

        {totalPages > 3 && (
          <button
            type="button"
            data-testid={`catalog-pagination-btn-page-${totalPages}`}
            onClick={() => onPageChange(totalPages)}
            className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
              currentPage === totalPages
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          aria-label="Next Page"
          data-testid="catalog-pagination-btn-next"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* Per Page Density Pill */}
      <div className="hidden md:flex items-center gap-2" data-testid="catalog-pagination-density">
        <span className="font-label-sm text-label-sm text-outline">
          Mỗi trang:
          <span className="sr-only">Per page:</span>
        </span>
        <div className="flex items-center bg-surface-container-low rounded-full p-1 text-[12px] font-label-sm">
          {[24, 48, 96].map((size) => (
            <button
              key={size}
              type="button"
              data-testid={`catalog-pagination-density-${size}`}
              onClick={() => onPageSizeChange(size)}
              className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                pageSize === size
                  ? 'bg-surface-container-lowest font-bold text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

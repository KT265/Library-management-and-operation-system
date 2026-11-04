import React from 'react';
import { FilterSidebar, FilterSidebarProps } from './FilterSidebar';

interface MobileFilterDrawerProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  ...sidebarProps
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-filter-drawer"
      data-testid="catalog-mobile-filter-drawer"
      className="fixed inset-0 z-50 lg:hidden flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xs h-full bg-surface-container-low shadow-2xl flex flex-col overflow-y-auto p-space-md z-10 animate-slide-in-right">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <span className="font-title-md font-bold text-primary">Bộ lọc tìm kiếm</span>
          <button
            type="button"
            data-testid="catalog-mobile-filter-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <FilterSidebar
          {...sidebarProps}
          isMobileDrawer={true}
          onApplyFilters={() => {
            if (sidebarProps.onApplyFilters) sidebarProps.onApplyFilters();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

interface CatalogBreadcrumbsProps {
  displayedCount: number;
  totalCount: number;
}

export const CatalogBreadcrumbs: React.FC<CatalogBreadcrumbsProps> = ({
  displayedCount,
  totalCount,
}) => {
  return (
    <nav
      id="catalog-breadcrumbs"
      data-testid="catalog-breadcrumbs-nav"
      aria-label="Breadcrumb"
      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs py-space-sm text-on-surface-variant font-label-md text-label-md"
    >
      <div className="flex items-center space-x-2">
        <Link
          to="/"
          data-testid="catalog-breadcrumbs-link-home"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Trang chủ</span>
        </Link>
        <span className="text-outline">/</span>
        <span
          data-testid="catalog-breadcrumbs-current"
          className="text-primary font-bold"
        >
          Danh mục sách
        </span>
      </div>

      <div
        data-testid="catalog-breadcrumbs-counter"
        className="text-on-surface-variant font-label-sm text-label-sm"
      >
        <span>Hiển thị </span>
        <strong className="text-primary">{displayedCount}</strong>
        <span> trên tổng số </span>
        <strong className="text-primary">{totalCount}</strong>
        <span> ấn phẩm</span>
      </div>
    </nav>
  );
};

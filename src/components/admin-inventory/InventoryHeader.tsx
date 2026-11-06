import React from 'react';

interface InventoryHeaderProps {
  totalCount: number;
  onOpenAddModal: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  totalCount,
  onOpenAddModal,
}) => {
  return (
    <div
      id="inventory-header"
      data-testid="admin-inventory-header"
      className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
    >
      <div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <h1
            id="inventory-title"
            data-testid="admin-inventory-header-title"
            className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight"
          >
            Quản lý Kho Sách &amp; Ấn bản
          </h1>
          <span
            id="inventory-total-badge"
            data-testid="admin-inventory-header-badge-count"
            className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-secondary-container text-on-secondary-container num-tabular"
          >
            {totalCount} đầu sách
          </span>
        </div>
        <p
          id="inventory-subtitle"
          data-testid="admin-inventory-header-subtitle"
          className="font-body-md text-body-md text-secondary mt-1"
        >
          Quản lý số lượng sách thực tế trong kho, tình trạng tồn trữ và danh mục hiển thị
        </p>
      </div>

      <div className="flex items-center gap-space-sm flex-wrap">
        <button
          type="button"
          id="addBookBtn"
          data-testid="admin-inventory-header-btn-add"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold shadow-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm sách mới</span>
        </button>
      </div>
    </div>
  );
};

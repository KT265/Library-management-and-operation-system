import React from 'react';

interface VouchersHeaderProps {
  activeCount: number;
  onOpenCreateModal: () => void;
}

export const VouchersHeader: React.FC<VouchersHeaderProps> = ({
  activeCount,
  onOpenCreateModal,
}) => {
  return (
    <div
      id="vouchers-header"
      data-testid="admin-vouchers-header"
      className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
    >
      <div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <h1
            id="vouchers-title"
            data-testid="admin-vouchers-header-title"
            className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight"
          >
            Quản lý Khuyến mãi &amp; Voucher
          </h1>
          <span
            id="vouchers-active-badge"
            data-testid="admin-vouchers-header-badge-active"
            className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-secondary-container text-on-secondary-container num-tabular"
          >
            {activeCount} mã đang kích hoạt
          </span>
        </div>
        <p
          id="vouchers-subtitle"
          data-testid="admin-vouchers-header-subtitle"
          className="font-body-md text-body-md text-secondary mt-1"
        >
          Tạo mã ưu đãi, theo dõi tỷ lệ sử dụng và thiết lập các chiến dịch kích cầu cho toàn bộ ấn phẩm BookVerse.
        </p>
      </div>

      <div className="flex items-center gap-space-sm flex-wrap">
        <button
          type="button"
          id="btn-open-create-voucher"
          data-testid="admin-vouchers-header-btn-create"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold shadow-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span id="createVoucherBtn">Tạo mã mới</span>
        </button>
      </div>
    </div>
  );
};

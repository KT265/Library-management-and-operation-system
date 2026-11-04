import React from 'react';

export const VoucherKpisBento: React.FC = () => {
  return (
    <div
      id="voucher-kpis-grid"
      data-testid="admin-vouchers-kpis-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
    >
      {/* Card 1: Active Vouchers */}
      <div
        id="kpi-active-vouchers"
        data-testid="admin-vouchers-kpi-active"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Mã ưu đãi đang hiệu lực
          </span>
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-active-vouchers-value"
              data-testid="admin-vouchers-kpi-active-val"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              4
            </span>
            <span className="text-secondary font-title-sm text-title-sm">mã</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
              Sẵn sàng áp dụng
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Redemptions */}
      <div
        id="kpi-total-redemptions"
        data-testid="admin-vouchers-kpi-redemptions"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Tổng lượt sử dụng
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">redeem</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-total-redemptions-value"
              data-testid="admin-vouchers-kpi-redemptions-val"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              2.767
            </span>
            <span className="text-secondary font-title-sm text-title-sm">lượt</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
            <span className="text-primary font-semibold bg-surface-container-high px-2 py-0.5 rounded-full text-xs">
              Tỷ lệ quy đổi 78.4%
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Total Discount Given */}
      <div
        id="kpi-total-discount-given"
        data-testid="admin-vouchers-kpi-discount-given"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Giá trị tiết kiệm (VND)
          </span>
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">savings</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-discount-given-value"
              data-testid="admin-vouchers-kpi-discount-val"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              218.500.000 ₫
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
            <span className="text-primary font-semibold bg-secondary-container px-2 py-0.5 rounded-full text-xs">
              Ngân sách trợ giá độc giả
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Expiring Soon */}
      <div
        id="kpi-expiring-soon"
        data-testid="admin-vouchers-kpi-expiring"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Sắp hết thời hạn ưu đãi
          </span>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">timer</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-expiring-value"
              data-testid="admin-vouchers-kpi-expiring-val"
              className="font-display-md text-display-md font-bold text-tertiary tracking-tight num-tabular"
            >
              2
            </span>
            <span className="text-tertiary font-title-sm text-title-sm">mã sắp hết hạn</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
            <span className="text-on-tertiary bg-tertiary px-2 py-0.5 rounded-full text-xs font-bold">
              Cần gia hạn chiến dịch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

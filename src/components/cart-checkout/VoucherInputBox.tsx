import React from 'react';
import { AppliedVoucher } from './types';
import { formatVND } from '../../utils/currency';

export interface VoucherInputBoxProps {
  voucherInput: string;
  setVoucherInput: (code: string) => void;
  appliedVoucher: AppliedVoucher | null;
  onApplyVoucher: (code?: string) => void;
  onRemoveVoucher: () => void;
  voucherError: string | null;
  availableVouchers: AppliedVoucher[];
}

export const VoucherInputBox: React.FC<VoucherInputBoxProps> = ({
  voucherInput,
  setVoucherInput,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
  voucherError,
  availableVouchers,
}) => {
  return (
    <div
      id="voucher-section"
      data-testid="cart-checkout-voucher"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-lg"
    >
      <div className="flex items-center gap-space-xs text-primary mb-space-sm">
        <span className="material-symbols-outlined text-[20px]">sell</span>
        <h3 className="font-title-md text-title-md font-bold text-on-surface">
          Mã giảm giá &amp; Phiếu ưu đãi
        </h3>
      </div>

      {/* Applied Voucher Chip */}
      {appliedVoucher ? (
        <div
          id="applied-voucher-badge"
          data-testid="cart-checkout-voucher-applied-badge"
          className="p-space-sm rounded-lg bg-tertiary-container/30 border border-tertiary/20 flex items-center justify-between gap-space-sm mb-space-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              check_circle
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-label-lg font-bold text-on-tertiary-container">
                Đã áp dụng: {appliedVoucher.code}
              </span>
              <span className="font-body-xs text-body-xs text-on-surface-variant line-clamp-1">
                {appliedVoucher.description}
              </span>
            </div>
          </div>

          <button
            id="removeVoucherBtn"
            data-testid="cart-checkout-voucher-btn-remove"
            type="button"
            onClick={onRemoveVoucher}
            className="text-error hover:text-error/80 font-label-sm text-label-sm font-semibold px-2 py-1 rounded hover:bg-error-container/30 transition-colors cursor-pointer"
          >
            Hủy mã
          </button>
        </div>
      ) : (
        /* Voucher Input Field */
        <div className="flex items-center gap-2 mb-space-sm">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
              confirmation_number
            </span>
            <input
              id="voucherInput"
              data-testid="cart-checkout-voucher-input"
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
              placeholder="Nhập mã ưu đãi (vd: BOOKVERSE20)..."
              className="w-full h-11 pl-10 pr-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm uppercase font-semibold"
            />
          </div>

          <button
            id="applyVoucherBtn"
            data-testid="cart-checkout-voucher-btn-apply"
            type="button"
            onClick={() => onApplyVoucher()}
            className="h-11 px-5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer whitespace-nowrap"
          >
            Áp dụng
          </button>
        </div>
      )}

      {/* Error Message */}
      {voucherError && (
        <p
          data-testid="cart-checkout-voucher-error"
          className="text-error font-body-sm text-body-sm mb-space-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{voucherError}</span>
        </p>
      )}

      {/* Available Voucher Chips Suggestions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant">Gợi ý mã:</span>
        {availableVouchers.map((v) => (
          <button
            key={v.code}
            data-testid={'cart-checkout-voucher-chip-' + v.code}
            type="button"
            onClick={() => {
              setVoucherInput(v.code);
              onApplyVoucher(v.code);
            }}
            className="px-2.5 py-1 rounded-full text-[12px] font-bold bg-surface-container hover:bg-secondary-container text-primary transition-colors cursor-pointer border border-outline-variant/30"
          >
            {v.code} ({v.discountType === 'percentage' ? v.discountValue + '%' : formatVND(v.discountValue)})
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoucherInputBox;

import React from 'react';
import { PaymentMethod } from './types';

export interface PaymentMethodTabsProps {
  paymentMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  paymentMethod,
  onSelectMethod,
}) => {
  return (
    <div
      id="payment-method-tabs"
      data-testid="cart-checkout-payment-tabs"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-md"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Phương thức thanh toán
          </h3>
        </div>

        <span
          id="active-method-badge"
          data-testid="cart-checkout-payment-tabs-active-badge"
          className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold bg-primary/10 text-primary"
        >
          {paymentMethod === 'vietqr' ? 'VietQR / Chuyển khoản' : 'Thanh toán COD'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* COD Tab Button */}
        <button
          id="tab-cod"
          data-testid="cart-checkout-payment-tabs-btn-cod"
          type="button"
          onClick={() => onSelectMethod('cod')}
          className={`p-space-md rounded-lg border-2 text-left cursor-pointer transition-all flex items-start gap-space-sm ${
            paymentMethod === 'cod'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-outline-variant/40 hover:border-outline-variant bg-surface-container-low/20'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-label-lg text-label-lg font-bold text-on-surface">
              Thanh toán khi nhận hàng (COD)
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Kiểm tra bưu phẩm và thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.
            </span>
          </div>
        </button>

        {/* VietQR Tab Button */}
        <button
          id="tab-vietqr"
          data-testid="cart-checkout-payment-tabs-btn-vietqr"
          type="button"
          onClick={() => onSelectMethod('vietqr')}
          className={`p-space-md rounded-lg border-2 text-left cursor-pointer transition-all flex items-start gap-space-sm ${
            paymentMethod === 'vietqr'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-outline-variant/40 hover:border-outline-variant bg-surface-container-low/20'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                VietQR / Chuyển khoản nhanh
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-on-primary">
                TỰ ĐỘNG
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Quét mã qua mọi ngân hàng hoặc MoMo. Xác nhận giao dịch trong 3-5 giây.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodTabs;

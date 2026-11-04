import React from 'react';
import { formatVND } from '../../utils/currency';

export interface OrderSummaryCardProps {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  salesTax: number;
  finalTotal: number;
  isSubmitting: boolean;
  selectedCount: number;
  onCheckout: () => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  subtotal,
  shippingFee,
  discountAmount,
  salesTax,
  finalTotal,
  isSubmitting,
  selectedCount,
  onCheckout,
}) => {
  return (
    <div
      id="order-summary-card"
      data-testid="cart-checkout-summary"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-lg shadow-sm"
    >
      <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-space-md pb-space-sm border-b border-outline-variant/20">
        Tóm tắt đơn hàng
      </h3>

      {/* Financial Rows */}
      <div className="flex flex-col space-y-space-sm font-body-md text-body-md text-on-surface-variant mb-space-md">
        {/* Merchandise Subtotal */}
        <div className="flex items-center justify-between">
          <span>Tổng tiền hàng</span>
          <span
            id="merchandiseSubtotal"
            data-testid="cart-checkout-summary-subtotal"
            className="font-semibold text-on-surface num-tabular"
          >
            {formatVND(subtotal)}
          </span>
        </div>
        {/* Hidden alias for legacy ID #cartTotal */}
        <span id="cartTotal" className="sr-only">
          {formatVND(subtotal)}
        </span>

        {/* Shipping Fee */}
        <div className="flex items-center justify-between">
          <span>Phí vận chuyển</span>
          <span
            id="shippingFee"
            data-testid="cart-checkout-summary-shipping"
            className="font-semibold text-on-surface num-tabular"
          >
            {shippingFee === 0 ? 'Miễn phí (0 ₫)' : formatVND(shippingFee)}
          </span>
        </div>

        {/* Voucher Discount */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-tertiary">
            <span>Giảm giá voucher</span>
            <span
              id="discountAmount"
              data-testid="cart-checkout-summary-discount"
              className="font-bold num-tabular"
            >
              -{formatVND(discountAmount)}
            </span>
          </div>
        )}

        {/* VAT Tax */}
        <div className="flex items-center justify-between">
          <span>Thuế GTGT / VAT (8%)</span>
          <span
            data-testid="cart-checkout-summary-tax"
            className="font-semibold text-on-surface num-tabular"
          >
            {formatVND(salesTax)}
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div className="pt-space-sm border-t border-outline-variant/30 flex items-baseline justify-between mb-space-lg">
        <div>
          <span className="font-title-md text-title-md font-bold text-on-surface block">
            Tổng thanh toán
          </span>
          <span className="font-body-xs text-body-xs text-outline">
            (Đã bao gồm thuế và phí giao hàng)
          </span>
        </div>
        <div className="text-right">
          <span
            id="finalTotal"
            data-testid="cart-checkout-summary-final-total"
            className="font-headline-md text-headline-md font-extrabold text-primary block num-tabular"
          >
            {formatVND(finalTotal)}
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        id="checkoutBtn"
        data-testid="cart-checkout-summary-btn-checkout"
        type="button"
        disabled={isSubmitting || selectedCount === 0}
        onClick={onCheckout}
        className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            <span>Đang xử lý đơn hàng...</span>
          </>
        ) : (
          <>
            <span>Xác nhận đặt hàng</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </>
        )}
      </button>

      {/* Guarantee & Assurances */}
      <div className="mt-space-md pt-space-md border-t border-outline-variant/20 flex flex-col space-y-2 text-[12px] text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
          <span>100% Ấn bản chính hãng từ nhà xuất bản</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">security</span>
          <span>Bảo mật giao dịch VietQR &amp; Thanh toán khi nhận hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">replay</span>
          <span>Đổi trả trong 7 ngày nếu lỗi in ấn bao bì</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;

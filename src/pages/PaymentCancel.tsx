import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderCodeParam = searchParams.get('orderCode');
  const statusParam = searchParams.get('status') || 'CANCELLED';
  const idParam = searchParams.get('id');

  return (
    <div
      id="payment-cancel-page"
      data-testid="payment-cancel-page"
      className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-lg w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,54,93,0.06)] border border-surface-container-high text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[48px] text-amber-600">
            cancel
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
          Giao dịch đã bị hủy
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Bạn đã hủy giao dịch thanh toán hoặc phiên thanh toán PayOS đã kết thúc. Các tựa sách trong giỏ hàng vẫn được lưu giữ an toàn để bạn thử lại.
        </p>

        {/* Cancellation Details */}
        {(orderCodeParam || idParam) && (
          <div className="bg-surface-container-low rounded-2xl p-5 mb-8 text-left space-y-3 border border-surface-container-high/60">
            {orderCodeParam && (
              <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
                <span className="font-body-sm text-on-surface-variant">Mã đơn hàng</span>
                <span
                  id="payment-cancel-order-code"
                  data-testid="payment-cancel-order-code"
                  className="font-title-sm font-semibold text-primary"
                >
                  #{orderCodeParam}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
              <span className="font-body-sm text-on-surface-variant">Trạng thái giao dịch</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                {statusParam === 'CANCELLED' ? 'Đã hủy thanh toán' : statusParam}
              </span>
            </div>
            {idParam && (
              <div className="flex justify-between items-center py-1">
                <span className="font-body-sm text-on-surface-variant">Mã giao dịch PayOS</span>
                <span className="font-label-sm text-outline truncate max-w-[200px]">{idParam}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/cart"
            id="btn-cancel-retry-cart"
            data-testid="payment-cancel-cart-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-semibold shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span>Quay lại giỏ hàng</span>
          </Link>
          <Link
            to="/catalog"
            id="btn-cancel-return-catalog"
            data-testid="payment-cancel-catalog-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-label-lg font-semibold hover:bg-surface-container-highest transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span>Khám phá sách khác</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

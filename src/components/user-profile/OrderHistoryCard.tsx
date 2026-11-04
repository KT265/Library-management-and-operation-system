import React from 'react';
import { OrderDisplay } from './types';
import { formatVND } from '../../utils/currency';

export interface OrderHistoryCardProps {
  order: OrderDisplay;
  onOpenTracking: (order: OrderDisplay) => void;
  onOpenReview: (order: OrderDisplay) => void;
  onOpenVietQr: (order: OrderDisplay) => void;
  onReorder: (order: OrderDisplay) => void;
  onCancelOrder: (order: OrderDisplay) => void;
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
  order,
  onOpenTracking,
  onOpenReview,
  onOpenVietQr,
  onReorder,
  onCancelOrder,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-tertiary-container/40 text-on-tertiary-container border border-tertiary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span>Đã giao thành công / Delivered</span>
          </span>
        );
      case 'processing':
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Đang xử lý &amp; Đang giao / Paid &amp; Dispatched</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-secondary-container text-on-secondary-container border border-secondary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>Chờ thanh toán / Pending Settlement</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-error-container/30 text-error border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span>Đã hủy / Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-surface-container text-on-surface-variant">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div
      id={'order-card-' + order.id}
      data-testid={'user-profile-order-card-' + order.id}
      className="p-space-md bg-surface-container-low/40 rounded-lg border border-outline-variant/30 flex flex-col space-y-space-md hover:border-outline-variant/60 transition-colors"
    >
      {/* Order Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-3">
          <span
            data-testid={'user-profile-order-card-number-' + order.id}
            className="font-title-sm text-title-sm font-bold text-primary tracking-wide num-tabular"
          >
            {order.orderNumber}
          </span>
          <span className="text-outline-variant select-none">•</span>
          <span
            data-testid={'user-profile-order-card-date-' + order.id}
            className="font-body-sm text-body-sm text-on-surface-variant num-tabular"
          >
            Ngày đặt: {order.date}
          </span>
          <span className="text-outline-variant select-none">•</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
            {order.paymentMethod === 'VietQR' ? 'VietQR Pay' : 'COD Payment'}
          </span>
        </div>

        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Items List Preview */}
      <div className="flex flex-col space-y-3">
        {order.items.map((item, idx) => (
          <div
            key={item.bookId + '-' + idx}
            data-testid={'user-profile-order-card-item-' + item.bookId}
            className="flex items-center justify-between gap-space-md"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-12 h-16 rounded bg-surface-container object-cover shadow-xs flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                  {item.title}
                </span>
                <span className="font-body-xs text-body-xs text-on-surface-variant line-clamp-1">
                  {item.author} • {item.format}
                </span>
                <span className="font-body-xs text-body-xs text-outline mt-0.5">
                  Số lượng: x{item.quantity}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-label-md text-label-md font-semibold text-on-surface num-tabular">
                {formatVND(item.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer: Total & Actions */}
      <div className="pt-space-sm border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-baseline gap-2">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Tổng tiền:</span>
          <span
            data-testid={'user-profile-order-card-total-' + order.id}
            className="font-title-md text-title-md font-bold text-primary num-tabular"
          >
            {formatVND(order.total)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tracking button */}
          <button
            id="trackOrderBtn"
            data-testid={'user-profile-order-card-btn-track-' + order.id}
            type="button"
            onClick={() => onOpenTracking(order)}
            className="h-9 px-4 rounded-full font-label-sm text-label-sm font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
          >
            Tra cứu hành trình
          </button>

          {/* Write review button */}
          {order.status === 'delivered' && (
            <button
              id="writeReviewBtn"
              data-testid={'user-profile-order-card-btn-review-' + order.id}
              type="button"
              onClick={() => onOpenReview(order)}
              className="h-9 px-4 rounded-full font-label-sm text-label-sm font-semibold bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition-colors cursor-pointer"
            >
              Viết đánh giá
            </button>
          )}

          {/* Pending VietQR button */}
          {order.status === 'pending' && (
            <button
              id="payVietQrBtn"
              data-testid={'user-profile-order-card-btn-vietqr-' + order.id}
              type="button"
              onClick={() => onOpenVietQr(order)}
              className="h-9 px-4 rounded-full font-label-sm text-label-sm font-bold bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer shadow-sm"
            >
              Thanh toán VietQR
            </button>
          )}

          {/* Reorder button */}
          <button
            data-testid={'user-profile-order-card-btn-reorder-' + order.id}
            type="button"
            onClick={() => onReorder(order)}
            className="h-9 px-4 rounded-full font-label-sm text-label-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            Đặt lại
          </button>

          {/* Cancel Order button (if pending) */}
          {order.status === 'pending' && (
            <button
              data-testid={'user-profile-order-card-btn-cancel-' + order.id}
              type="button"
              onClick={() => onCancelOrder(order)}
              className="h-9 px-3 rounded-full font-label-sm text-label-sm text-error hover:bg-error-container/20 transition-colors cursor-pointer"
            >
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryCard;

import React from 'react';
import { formatVND } from '../../utils/currency';

interface PurchaseActionClusterProps {
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  stockCeiling: number;
  isAdding: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onOpenBorrowModal: () => void;
}

export const PurchaseActionCluster: React.FC<PurchaseActionClusterProps> = ({
  unitPrice,
  originalPrice,
  quantity,
  stockCeiling,
  isAdding,
  onDecrement,
  onIncrement,
  onAddToCart,
  onBuyNow,
  onOpenBorrowModal,
}) => {
  const subtotal = unitPrice * quantity;
  const savings = Math.max(0, originalPrice - unitPrice);

  return (
    <div
      id="purchase-action-cluster"
      data-testid="book-details-purchase-cluster"
      className="p-space-lg rounded-3xl bg-surface-container-low border border-outline-variant/40 shadow-sm flex flex-col gap-space-md"
    >
      {/* Price Breakdown */}
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div className="flex items-baseline gap-space-sm">
          <span
            id="calculatedPrice"
            data-testid="book-details-price-calculated"
            className="font-display-sm text-display-sm font-bold text-primary num-tabular"
          >
            {formatVND(unitPrice)}
          </span>

          {originalPrice > unitPrice && (
            <span
              id="originalPrice"
              data-testid="book-details-price-original"
              className="font-body-md text-body-md text-outline line-through num-tabular"
            >
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <span
            data-testid="book-details-pill-savings"
            className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold"
          >
            Tiết kiệm {formatVND(savings)}
          </span>
        )}
      </div>

      {/* Quantity Stepper & Live Subtotal */}
      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
        <div className="flex items-center gap-space-xs">
          <span className="font-label-md text-label-md font-semibold text-on-surface mr-2">
            Số lượng:
          </span>

          <button
            type="button"
            id="qtyMinus"
            data-testid="book-details-qty-btn-minus"
            aria-label="Giảm số lượng"
            disabled={quantity <= 1}
            onClick={onDecrement}
            className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary hover:bg-secondary-container flex items-center justify-center font-bold text-lg disabled:opacity-30 disabled:pointer-events-none shadow-xs transition-colors cursor-pointer"
          >
            -
          </button>

          <span
            id="qtyDisplay"
            data-testid="book-details-qty-display"
            className="w-10 text-center font-title-md text-title-md font-bold text-primary num-tabular"
          >
            {quantity}
          </span>

          <button
            type="button"
            id="qtyPlus"
            data-testid="book-details-qty-btn-plus"
            aria-label="Tăng số lượng"
            disabled={quantity >= stockCeiling}
            onClick={onIncrement}
            className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary hover:bg-secondary-container flex items-center justify-center font-bold text-lg disabled:opacity-30 disabled:pointer-events-none shadow-xs transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <span className="font-body-xs text-body-sm text-outline block">
            Tạm tính:
          </span>
          <span
            id="liveTotal"
            data-testid="book-details-live-total"
            className="font-title-lg text-title-lg font-bold text-primary num-tabular"
          >
            {formatVND(subtotal)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-space-xs pt-2">
        {/* Add to Cart CTA */}
        <button
          type="button"
          id="addToCartBtn"
          data-testid="book-details-purchase-btn-add"
          onClick={onAddToCart}
          className={`flex-1 py-3 px-space-md rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer ${
            isAdding
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-primary text-on-primary hover:bg-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isAdding ? 'check' : 'shopping_bag'}
          </span>
          <span>{isAdding ? 'Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}</span>
        </button>

        {/* Buy Now CTA */}
        <button
          type="button"
          data-path="cart-checkout"
          data-testid="book-details-purchase-btn-buynow"
          onClick={onBuyNow}
          className="flex-1 py-3 px-space-md rounded-full bg-secondary-container text-on-primary-fixed hover:bg-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span>Mua ngay</span>
        </button>
      </div>

      {/* Secondary Circulation Borrow Action */}
      <button
        type="button"
        data-testid="book-details-purchase-btn-borrow"
        onClick={onOpenBorrowModal}
        className="w-full py-2.5 rounded-full border border-outline-variant hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">local_library</span>
        <span>Mượn sách đọc tại chỗ / Mượn về</span>
      </button>
    </div>
  );
};

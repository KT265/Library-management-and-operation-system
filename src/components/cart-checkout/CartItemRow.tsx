import React from 'react';
import { CartItem } from '../../types';
import { formatVND } from '../../utils/currency';

export interface CartItemRowProps {
  item: CartItem;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}) => {
  const lineTotal = item.price * item.quantity;

  return (
    <div
      id={'cart-item-' + item.id}
      data-testid={'cart-checkout-item-row-' + item.id}
      className={`p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md transition-colors ${
        item.selected ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30 opacity-75'
      }`}
    >
      {/* Checkbox & Book Info */}
      <div className="flex items-center gap-space-md flex-1 min-w-0">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggleSelect(item.id)}
          data-testid={'cart-checkout-item-row-checkbox-' + item.id}
          className="w-4 h-4 rounded text-primary bg-surface-container-lowest accent-primary focus:ring-0 cursor-pointer flex-shrink-0"
        />

        <div className="w-16 h-22 rounded bg-surface-container-high overflow-hidden shadow-sm flex-shrink-0">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1">
            {item.title}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
            {item.author}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant">
              Ấn bản tiêu chuẩn
            </span>
            <span className="font-label-sm text-label-sm font-semibold text-primary">
              {formatVND(item.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper & Line Total & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-space-lg w-full sm:w-auto">
        {/* Quantity Stepper */}
        <div
          id={'stepper-' + item.id}
          data-testid={'cart-checkout-item-row-stepper-' + item.id}
          className="flex items-center bg-surface-container-low rounded-full border border-outline-variant/40 p-0.5"
        >
          <button
            type="button"
            aria-label="Giảm số lượng"
            disabled={item.quantity <= 1}
            onClick={() => onUpdateQuantity(item.id, -1)}
            data-testid={'cart-checkout-item-row-btn-minus-' + item.id}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
          <span
            data-testid={'cart-checkout-item-row-qty-' + item.id}
            className="w-8 text-center font-label-md text-label-md font-bold text-on-surface num-tabular"
          >
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={() => onUpdateQuantity(item.id, 1)}
            data-testid={'cart-checkout-item-row-btn-plus-' + item.id}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[100px]">
          <span
            data-testid={'cart-checkout-item-row-total-' + item.id}
            className="font-label-lg text-label-lg font-bold text-on-surface block num-tabular"
          >
            {formatVND(lineTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          id={'remove-item-' + item.id}
          data-testid={'cart-checkout-item-row-btn-remove-' + item.id}
          type="button"
          aria-label="Xóa ấn phẩm"
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;

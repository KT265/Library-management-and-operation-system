import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types';
import { CartItemRow } from './CartItemRow';

export interface CartItemListProps {
  items: CartItem[];
  allSelected: boolean;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (selected: boolean) => void;
  onToggleItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  allSelected,
  selectedCount,
  totalCount,
  onSelectAll,
  onToggleItem,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (items.length === 0) {
    return (
      <div
        id="cart-items-empty"
        data-testid="cart-checkout-item-list-empty"
        className="bg-surface-container-lowest rounded-lg p-space-xl text-center border border-outline-variant/30 shadow-sm"
      >
        <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mx-auto text-primary mb-space-md">
          <span className="material-symbols-outlined text-[32px]">production_quantity_limits</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
          Giỏ hàng của bạn đang trống
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-space-lg">
          Hãy khám phá những ấn phẩm tinh hoa tuyển chọn và bổ sung vào giỏ sách của bạn.
        </p>
        <Link
          to="/catalog"
          data-testid="cart-checkout-item-list-btn-catalog"
          className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md hover:bg-primary-container hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Khám phá danh mục sách</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      id="cart-items-container"
      data-testid="cart-checkout-item-list"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm overflow-hidden mb-space-lg"
    >
      {/* List Header */}
      <div className="p-space-md bg-surface-container-low/50 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              id="selectAllCheckbox"
              data-testid="cart-checkout-item-list-checkbox-select-all"
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="w-4 h-4 rounded text-primary bg-surface-container-lowest accent-primary focus:ring-0 cursor-pointer"
            />
            <span className="font-label-lg text-label-lg font-bold text-on-surface">
              Chọn tất cả
            </span>
          </label>
          <span
            id="cartItemCount"
            data-testid="cart-checkout-item-list-count"
            className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold"
          >
            Đã chọn {selectedCount}/{totalCount} ấn phẩm
          </span>
        </div>

        <button
          id="clearCartBtn"
          data-testid="cart-checkout-item-list-btn-clear"
          type="button"
          onClick={onClearCart}
          className="flex items-center gap-1 font-label-md text-label-md text-error hover:text-error/80 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          <span>Xóa toàn bộ giỏ</span>
        </button>
      </div>

      {/* Item Rows */}
      <div className="divide-y divide-outline-variant/20">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onToggleSelect={onToggleItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemList;

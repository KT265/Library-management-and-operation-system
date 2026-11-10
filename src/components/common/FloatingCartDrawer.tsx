import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { formatVND } from '../../utils/currency';

export const FloatingCartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    getTotalCount,
    getSelectedCount,
    getSelectedSubtotal,
  } = useStore();

  const totalCount = getTotalCount();
  const selectedCount = getSelectedCount();
  const selectedSubtotal = getSelectedSubtotal();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div id="floatingCartRoot" data-testid="sf-cart-drawer-root">
      {/* 1. Vertically centered FAB button at the right edge */}
      <button
        id="cartFabBtn"
        data-testid="sf-cart-drawer-btn-fab"
        aria-expanded={isCartOpen}
        aria-label="Mở giỏ hàng"
        onClick={openCart}
        className="fixed top-1/2 -translate-y-1/2 right-6 z-[1050] w-14 h-14 rounded-full bg-primary-container text-on-primary shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group focus:outline-none"
        type="button"
      >
        <span className="material-symbols-outlined text-[26px]">shopping_cart</span>
        {totalCount > 0 && (
          <span
            id="cartFabBadge"
            data-testid="sf-cart-drawer-badge"
            className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold flex items-center justify-center rounded-full shadow-md leading-none border-2 border-surface num-tabular"
          >
            {totalCount}
          </span>
        )}
      </button>

      {/* 2. Backdrop Overlay */}
      <div
        id="cartDrawerBackdrop"
        data-testid="sf-cart-drawer-backdrop"
        onClick={closeCart}
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-[1060] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 3. Slide-out Right Drawer Panel */}
      <aside
        id="cartDrawer"
        data-testid="sf-cart-drawer-aside"
        className={`fixed top-0 right-0 h-full max-h-screen w-[400px] max-w-[90vw] bg-surface-container-lowest text-on-surface z-[1070] shadow-2xl rounded-l-3xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-surface-container-high shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              shopping_bag
            </span>
            <h3 className="font-title-lg text-title-lg text-primary font-bold">
              Giỏ hàng của bạn ({totalCount})
            </h3>
          </div>
          <button
            id="closeCartDrawerBtn"
            data-testid="sf-cart-drawer-btn-close"
            aria-label="Đóng giỏ hàng"
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Dynamic Items List Container (Capped at 10 items height: calc(10 * 74px)) */}
        <div
          id="cartDrawerItemsList"
          data-testid="sf-cart-drawer-items-list"
          className="flex-1 overflow-y-auto p-space-md space-y-space-sm min-h-0 cart-drawer-scroll-limit"
        >
          {cartItems.length === 0 ? (
            <div
              id="cartDrawerEmptyState"
              data-testid="sf-cart-drawer-empty-state"
              className="py-12 text-center flex flex-col items-center"
            >
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                shopping_bag
              </span>
              <p className="font-title-sm text-on-surface font-semibold">
                Giỏ hàng hiện đang trống
              </p>
              <p className="font-body-sm text-secondary mt-1">
                Hãy khám phá những tác phẩm tinh tuyển của chúng tôi
              </p>
              <button
                id="cartDrawerBtnBrowse"
                data-testid="sf-cart-drawer-btn-browse"
                onClick={() => {
                  closeCart();
                  navigate('/catalog');
                }}
                className="mt-4 px-space-md py-1.5 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors cursor-pointer"
                type="button"
              >
                Khám phá danh mục sách
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                data-testid={`sf-cart-drawer-item-row-${item.id}`}
                className="cart-item flex items-center gap-3 p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-surface-container-high/60"
                data-price={item.price}
                data-qty={item.quantity}
              >
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    data-testid={`sf-cart-drawer-checkbox-${item.id}`}
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                    className="cart-checkbox w-5 h-5 rounded text-primary accent-primary cursor-pointer"
                  />
                </label>

                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-14 h-18 object-cover rounded-DEFAULT shadow-sm shrink-0 aspect-[3/4]"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-title-sm text-title-sm text-primary font-bold line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary truncate">
                    {item.author}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <span className="font-title-sm text-title-sm text-primary font-semibold item-total-price num-tabular">
                      {formatVND(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="inline-flex items-center rounded-full bg-surface-container-lowest border border-surface-container-high shadow-sm p-0.5">
                        <button
                          type="button"
                          data-testid={`sf-cart-drawer-btn-qty-minus-${item.id}`}
                          aria-label="Giảm số lượng"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="qty-minus w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-90 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span
                          data-testid={`sf-cart-drawer-qty-val-${item.id}`}
                          className="qty-val font-label-md text-label-md font-bold text-on-surface px-2 min-w-[20px] text-center select-none num-tabular"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          data-testid={`sf-cart-drawer-btn-qty-plus-${item.id}`}
                          aria-label="Tăng số lượng"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="qty-plus w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-90 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        data-testid={`sf-cart-drawer-btn-remove-${item.id}`}
                        aria-label="Xóa ấn phẩm"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/40 active:scale-90 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Calculation Footer */}
        <div className="mt-auto p-space-lg bg-surface-container border-t border-surface-container-high rounded-tl-3xl space-y-3 shrink-0">
          <div className="flex items-center justify-between text-body-sm font-label-md">
            <span
              className="text-on-surface-variant font-medium num-tabular"
              id="selectedCountLabel"
              data-testid="sf-cart-drawer-text-selected-count"
            >
              Đã chọn {selectedCount} cuốn
            </span>
            <span className="text-outline text-body-sm">
              Thuế VAT &amp; phí giao hàng sẽ được tính khi thanh toán
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Tạm tính
            </span>
            <span
              className="font-headline-sm text-headline-sm text-primary font-bold num-tabular"
              id="cartSubtotal"
              data-testid="sf-cart-drawer-text-subtotal"
            >
              {formatVND(selectedSubtotal)}
            </span>
          </div>

          <button
            id="cartDrawerBtnCheckout"
            data-testid="sf-cart-drawer-btn-checkout"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            type="button"
          >
            <span>Tiến hành đặt hàng</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            id="continueShoppingBtn"
            data-testid="sf-cart-drawer-btn-continue"
            onClick={closeCart}
            className="w-full py-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors text-center cursor-pointer"
            type="button"
          >
            Tiếp tục chọn sách
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FloatingCartDrawer;

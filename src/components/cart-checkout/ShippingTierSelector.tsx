import React from 'react';
import { ShippingTier } from './types';
import { formatVND } from '../../utils/currency';

export interface ShippingTierSelectorProps {
  selectedTier: ShippingTier;
  onSelectTier: (tier: ShippingTier) => void;
  subtotal: number;
  standardFee: number;
  expressFee: number;
}

export const ShippingTierSelector: React.FC<ShippingTierSelectorProps> = ({
  selectedTier,
  onSelectTier,
  subtotal,
  standardFee,
  expressFee,
}) => {
  const isFreeStandard = subtotal >= 300000;

  return (
    <div
      id="shipping-tier-selector"
      data-testid="cart-checkout-shipping-tier"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-lg"
    >
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Phương thức vận chuyển
          </h3>
        </div>

        {isFreeStandard && (
          <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-tertiary-container/40 text-on-tertiary-container">
            Đủ điều kiện Miễn phí giao hàng
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* Standard Shipping Tier */}
        <div
          id="shippingTierStandard"
          data-testid="cart-checkout-shipping-tier-standard"
          onClick={() => onSelectTier('standard')}
          className={`p-space-md rounded-lg border-2 cursor-pointer transition-all flex items-start gap-space-sm ${
            selectedTier === 'standard'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-outline-variant/40 hover:border-outline-variant bg-surface-container-low/20'
          }`}
        >
          <input
            type="radio"
            name="shippingTier"
            checked={selectedTier === 'standard'}
            onChange={() => onSelectTier('standard')}
            className="mt-1 text-primary accent-primary"
          />
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                Giao tiêu chuẩn (3-5 ngày)
              </span>
              <span className="font-label-md text-label-md font-bold text-primary">
                {isFreeStandard ? 'Miễn phí' : formatVND(standardFee)}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {isFreeStandard
                ? 'Đơn hàng từ 300.000 ₫ được miễn phí giao tiêu chuẩn toàn quốc.'
                : 'Áp dụng cho mọi tỉnh thành, bọc chống sốc tiêu chuẩn.'}
            </p>
          </div>
        </div>

        {/* Express 24h Shipping Tier */}
        <div
          id="shippingTierExpress"
          data-testid="cart-checkout-shipping-tier-express"
          onClick={() => onSelectTier('express')}
          className={`p-space-md rounded-lg border-2 cursor-pointer transition-all flex items-start gap-space-sm ${
            selectedTier === 'express'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-outline-variant/40 hover:border-outline-variant bg-surface-container-low/20'
          }`}
        >
          <input
            type="radio"
            name="shippingTier"
            checked={selectedTier === 'express'}
            onChange={() => onSelectTier('express')}
            className="mt-1 text-primary accent-primary"
          />
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                Giao hỏa tốc (24h)
              </span>
              <span className="font-label-md text-label-md font-bold text-tertiary">
                {formatVND(expressFee)}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Giao ưu tiên trong 24 giờ tại các thành phố lớn. Đóng thùng bảo quản cao cấp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingTierSelector;

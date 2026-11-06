import React from 'react';
import { RecipientInfo } from './types';

export interface DeliveryAddressCardProps {
  recipient: RecipientInfo;
  onChangeAddress: () => void;
}

export const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({
  recipient,
  onChangeAddress,
}) => {
  const fullAddress = recipient.street + ', ' + recipient.district + ', ' + recipient.city;

  return (
    <div
      id="delivery-address-display"
      data-testid="cart-checkout-delivery-card"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-lg"
    >
      <div className="flex items-start justify-between gap-space-sm mb-space-sm">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">location_on</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Địa chỉ nhận hàng
          </h3>
        </div>

        <button
          id="changeAddressBtn"
          data-testid="cart-checkout-delivery-card-btn-change"
          type="button"
          onClick={onChangeAddress}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Thay đổi</span>
        </button>
      </div>

      <div className="flex flex-col space-y-1.5 pl-7">
        <div className="flex flex-wrap items-center gap-2">
          <span
            id="display-recipient-name"
            data-testid="cart-checkout-delivery-card-name"
            className="font-label-lg text-label-lg font-bold text-on-surface"
          >
            {recipient.name}
          </span>
          <span className="text-outline-variant select-none">•</span>
          <span
            id="display-recipient-phone"
            data-testid="cart-checkout-delivery-card-phone"
            className="font-body-md text-body-md text-on-surface-variant font-medium num-tabular"
          >
            {recipient.phone}
          </span>
          <span
            id="display-recipient-tag"
            data-testid="cart-checkout-delivery-card-tag"
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container text-on-secondary-container"
          >
            {recipient.addressType === 'Primary Residence' ? 'Nhà riêng' : 'Văn phòng'}
          </span>
        </div>

        <p
          id="display-recipient-address"
          data-testid="cart-checkout-delivery-card-address"
          className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
        >
          {fullAddress}
        </p>
      </div>
    </div>
  );
};

export default DeliveryAddressCard;

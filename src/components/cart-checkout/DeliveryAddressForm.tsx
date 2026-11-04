import React from 'react';
import { RecipientInfo } from './types';

export interface DeliveryAddressFormProps {
  formData: RecipientInfo;
  onChange: (field: keyof RecipientInfo, val: any) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <div
      id="delivery-address-form"
      data-testid="cart-checkout-delivery-form"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">edit_location</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Cập nhật địa chỉ nhận hàng
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form onSubmit={onSave} className="flex flex-col space-y-space-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {/* Recipient Name */}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="input-recipient-name"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Họ và tên người nhận <span className="text-error">*</span>
            </label>
            <input
              id="input-recipient-name"
              data-testid="cart-checkout-delivery-form-input-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Recipient Phone */}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="input-recipient-phone"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Số điện thoại liên hệ <span className="text-error">*</span>
            </label>
            <input
              id="input-recipient-phone"
              data-testid="cart-checkout-delivery-form-input-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="0908 123 456"
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {/* City / Province */}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="input-recipient-city"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Tỉnh / Thành phố <span className="text-error">*</span>
            </label>
            <input
              id="input-recipient-city"
              data-testid="cart-checkout-delivery-form-input-city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="TP. Hồ Chí Minh / Hà Nội"
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* District */}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="input-recipient-district"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Quận / Huyện <span className="text-error">*</span>
            </label>
            <input
              id="input-recipient-district"
              data-testid="cart-checkout-delivery-form-input-district"
              type="text"
              required
              value={formData.district}
              onChange={(e) => onChange('district', e.target.value)}
              placeholder="Quận 1 / Quận Ba Đình"
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Specific Street Address */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="input-recipient-street"
            className="font-label-md text-label-md text-on-surface font-semibold"
          >
            Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-error">*</span>
          </label>
          <input
            id="input-recipient-street"
            data-testid="cart-checkout-delivery-form-input-street"
            type="text"
            required
            value={formData.street}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="Tòa nhà A, Số 123 Đường Lê Lợi, Phường Bến Nghé"
            className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Address Type & Default */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-1">
          <div className="flex items-center gap-4">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">
              Loại địa chỉ:
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="addressType"
                checked={formData.addressType === 'Primary Residence'}
                onChange={() => onChange('addressType', 'Primary Residence')}
                className="text-primary accent-primary"
              />
              <span className="font-body-sm text-body-sm text-on-surface">Nhà riêng</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="addressType"
                checked={formData.addressType === 'Office'}
                onChange={() => onChange('addressType', 'Office')}
                className="text-primary accent-primary"
              />
              <span className="font-body-sm text-body-sm text-on-surface">Cơ quan / Văn phòng</span>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => onChange('isDefault', e.target.checked)}
              className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Đặt làm địa chỉ giao hàng mặc định
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/30">
          <button
            id="cancelAddressBtn"
            data-testid="cart-checkout-delivery-form-btn-cancel"
            type="button"
            onClick={onCancel}
            className="h-10 px-5 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            id="saveAddressBtn"
            data-testid="cart-checkout-delivery-form-btn-save"
            type="submit"
            className="h-10 px-6 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer"
          >
            Lưu địa chỉ
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryAddressForm;

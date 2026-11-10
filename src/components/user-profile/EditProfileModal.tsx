import React, { useState, useEffect } from 'react';
import { PatronProfileData } from './types';

export interface EditProfileModalProps {
  isOpen: boolean;
  initialData: PatronProfileData;
  onClose: () => void;
  onSave: (data: PatronProfileData) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<PatronProfileData>(() => ({
    ...initialData,
    city: initialData.city || 'TP. Hồ Chí Minh',
    district: initialData.district || 'Quận 1',
    detailedAddress:
      initialData.detailedAddress ||
      (initialData.address ? initialData.address.split(',')[0].trim() : 'Tòa nhà Tower 3, 65 Đường Lê Lợi'),
  }));

  useEffect(() => {
    setFormData({
      ...initialData,
      city: initialData.city || 'TP. Hồ Chí Minh',
      district: initialData.district || 'Quận 1',
      detailedAddress:
        initialData.detailedAddress ||
        (initialData.address ? initialData.address.split(',')[0].trim() : 'Tòa nhà Tower 3, 65 Đường Lê Lợi'),
    });
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = (formData.city || '').trim();
    const district = (formData.district || '').trim();
    const detailed = (formData.detailedAddress || '').trim();
    const fullAddress = [detailed, district, city].filter(Boolean).join(', ');

    onSave({
      ...formData,
      city,
      district,
      detailedAddress: detailed,
      address: fullAddress || formData.address,
    });
  };

  return (
    <div
      id="edit-profile-modal"
      data-testid="user-profile-edit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-space-md bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Chỉnh sửa thông tin độc giả
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col space-y-space-md">
          {/* Name */}
          <div className="flex flex-col space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Họ và tên độc giả
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* New Address Fields: Thành phố, Quận/Huyện */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col space-y-1">
              <label htmlFor="input-profile-city" className="font-label-md text-label-md text-on-surface font-semibold">
                Thành phố <span className="text-error">*</span>
              </label>
              <input
                id="input-profile-city"
                data-testid="user-profile-edit-input-city"
                type="text"
                required
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội..."
                className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="input-profile-district" className="font-label-md text-label-md text-on-surface font-semibold">
                Quận/Huyện <span className="text-error">*</span>
              </label>
              <input
                id="input-profile-district"
                data-testid="user-profile-edit-input-district"
                type="text"
                required
                value={formData.district || ''}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Ví dụ: Quận 1, Quận Bình Thạnh..."
                className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* New Address Field: Địa chỉ chi tiết */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="input-profile-detailed-address" className="font-label-md text-label-md text-on-surface font-semibold">
              Địa chỉ chi tiết <span className="text-error">*</span>
            </label>
            <input
              id="input-profile-detailed-address"
              data-testid="user-profile-edit-input-detailed-address"
              type="text"
              required
              value={formData.detailedAddress || ''}
              onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
              placeholder="Ví dụ: Số 65 Đường Lê Lợi, Phường Bến Nghé, Tòa nhà Tower 3"
              className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/30">
            <button
              id="cancelEditProfileBtn"
              data-testid="user-profile-edit-modal-btn-cancel"
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="saveProfileBtn"
              data-testid="user-profile-edit-modal-btn-save"
              type="submit"
              className="h-10 px-6 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

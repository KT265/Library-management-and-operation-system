import React from 'react';

export const TrustBadgesBar: React.FC = () => {
  return (
    <div
      id="book-trust-badges"
      data-testid="book-details-trust-badges-bar"
      className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-md rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 text-on-surface"
    >
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
        <div className="text-left">
          <span className="font-label-md text-label-md font-bold block text-primary">
            100% Ấn bản chính hãng
            <span className="sr-only">Genuine O'Reilly Print</span>
          </span>
          <span className="font-body-xs text-body-sm text-secondary">Từ nhà xuất bản uy tín</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
        <div className="text-left">
          <span className="font-label-md text-label-md font-bold block text-primary">
            Giao hàng hỏa tốc
            <span className="sr-only">Next-day Dispatched</span>
          </span>
          <span className="font-body-xs text-body-sm text-secondary">Đóng gói chuẩn bảo quản</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[22px]">published_with_changes</span>
        <div className="text-left">
          <span className="font-label-md text-label-md font-bold block text-primary">
            Đổi trả trong 30 ngày
            <span className="sr-only">30-Day Returns</span>
          </span>
          <span className="font-body-xs text-body-sm text-secondary">Bảo hành góc sách &amp; lỗi in</span>
        </div>
      </div>
    </div>
  );
};

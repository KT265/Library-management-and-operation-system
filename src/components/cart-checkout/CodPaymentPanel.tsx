import React from 'react';

export const CodPaymentPanel: React.FC = () => {
  return (
    <div
      id="cod-payment-section"
      data-testid="cart-checkout-cod-panel"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-lg"
    >
      <div className="flex items-center gap-space-xs text-primary mb-space-sm">
        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
          Quy trình thanh toán khi nhận hàng (COD)
        </h4>
      </div>

      <div className="flex flex-col space-y-space-sm pl-7 text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-[11px] text-on-surface mt-0.5 flex-shrink-0">
            1
          </span>
          <p>
            Đơn hàng sẽ được nhân viên đóng gói theo tiêu chuẩn bảo quản sách và chuyển giao cho đơn vị vận chuyển.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-[11px] text-on-surface mt-0.5 flex-shrink-0">
            2
          </span>
          <p>
            Bạn có quyền đồng kiểm tra niêm phong bọc sách và số lượng ấn phẩm trước khi tiến hành thanh toán tiền mặt.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-[11px] text-on-surface mt-0.5 flex-shrink-0">
            3
          </span>
          <p>
            Biên lai giao hàng và hóa đơn điện tử sẽ được cập nhật đồng bộ trong mục Tài khoản cá nhân ngay sau khi hoàn tất.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodPaymentPanel;

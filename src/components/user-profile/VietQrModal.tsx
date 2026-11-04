import React, { useState } from 'react';
import { OrderDisplay } from './types';
import { formatVND } from '../../utils/currency';

export interface VietQrModalProps {
  isOpen: boolean;
  order: OrderDisplay | null;
  onClose: () => void;
  onConfirmPaid: (order: OrderDisplay) => void;
}

export const VietQrModal: React.FC<VietQrModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmPaid,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const bankName = 'MB Bank (Ngân hàng Quân Đội) / Vietcombank';
  const accountNumber = '998822334455';
  const accountHolder = 'BOOKVERSE CORP';
  const transferMemo = 'BOOKVERSE ' + order.orderNumber.replace(/[^0-9]/g, '');

  const copyMemo = () => {
    navigator.clipboard?.writeText(transferMemo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="vietqr-payment-modal"
      data-testid="user-profile-vietqr-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-space-md bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Mã thanh toán VietQR đơn {order.orderNumber}
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

        {/* Body */}
        <div className="p-space-lg flex flex-col items-center text-center space-y-space-md">
          {/* QR Code Container */}
          <div className="w-52 h-52 bg-surface-container-low rounded-xl p-3 border border-outline-variant/40 flex items-center justify-center">
            <svg
              className="w-full h-full text-primary"
              fill="currentColor"
              viewBox="0 0 200 200"
              aria-label="VietQR Code"
            >
              <rect x="15" y="15" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="25" y="25" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="33" y="33" width="19" height="19" rx="2" fill="#1C1B1F" />
              <rect x="130" y="15" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="140" y="25" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="148" y="33" width="19" height="19" rx="2" fill="#1C1B1F" />
              <rect x="15" y="130" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="25" y="140" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="33" y="148" width="19" height="19" rx="2" fill="#1C1B1F" />
              <rect x="80" y="20" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="20" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="60" width="10" height="10" fill="#1C1B1F" />
              <rect x="20" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="60" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="140" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="130" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="90" y="170" width="10" height="10" fill="#1C1B1F" />
              <rect x="150" y="170" width="10" height="10" fill="#1C1B1F" />
            </svg>
          </div>

          <div className="w-full flex flex-col space-y-2 text-left bg-surface-container-low/50 p-3 rounded-lg text-body-sm text-body-sm">
            <div className="flex justify-between">
              <span className="text-outline">Ngân hàng:</span>
              <span className="font-semibold text-on-surface">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Số tài khoản:</span>
              <span className="font-bold text-primary num-tabular">{accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Chủ tài khoản:</span>
              <span className="font-semibold text-on-surface">{accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Số tiền:</span>
              <span className="font-extrabold text-primary num-tabular">{formatVND(order.total)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-outline-variant/20">
              <span className="text-outline">Nội dung (Memo):</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-primary">{transferMemo}</span>
                <button
                  type="button"
                  onClick={copyMemo}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary text-on-primary hover:bg-primary-container cursor-pointer"
                >
                  {copied ? 'Đã chép' : 'Chép'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => onConfirmPaid(order)}
              className="h-10 px-5 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VietQrModal;

import React, { useState } from 'react';
import { formatVND } from '../../utils/currency';

export interface VietQrPaymentPanelProps {
  finalAmount: number;
  transferMemo: string;
  onCopySuccess?: (msg: string) => void;
}

export const VietQrPaymentPanel: React.FC<VietQrPaymentPanelProps> = ({
  finalAmount,
  transferMemo,
  onCopySuccess,
}) => {
  const [copiedField, setCopiedField] = useState<'account' | 'memo' | null>(null);

  const bankName = 'MB Bank (Ngân hàng Quân Đội) / Vietcombank';
  const accountNumber = '998822334455';
  const accountHolder = 'BOOKVERSE CORP';

  const copyToClipboard = (text: string, field: 'account' | 'memo', label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    if (onCopySuccess) {
      onCopySuccess('Đã sao chép ' + label + ': ' + text);
    }
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div
      id="qr-payment-section"
      data-testid="cart-checkout-vietqr-panel"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      <div className="flex items-center gap-space-xs text-primary mb-space-sm">
        <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
        <h4 className="font-title-md text-title-md font-bold text-on-surface">
          Thanh toán VietQR tức thì qua PayOS
        </h4>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md pl-7">
        Mở ứng dụng ngân hàng hoặc ví điện tử (MoMo, ZaloPay, Viettel Money) để quét mã QR chuyển khoản tự động.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center pl-0 sm:pl-7">
        {/* QR Code Container */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-space-md bg-surface-container-low rounded-xl border border-outline-variant/40">
          <div className="w-48 h-48 bg-surface-container-lowest rounded-lg p-3 shadow-inner flex items-center justify-center">
            <svg
              className="w-full h-full text-primary"
              fill="currentColor"
              viewBox="0 0 200 200"
              aria-label="VietQR Code"
            >
              {/* Top-Left Position Detection Marker */}
              <rect x="15" y="15" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="25" y="25" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="33" y="33" width="19" height="19" rx="2" fill="#1C1B1F" />

              {/* Top-Right Position Detection Marker */}
              <rect x="130" y="15" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="140" y="25" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="148" y="33" width="19" height="19" rx="2" fill="#1C1B1F" />

              {/* Bottom-Left Position Detection Marker */}
              <rect x="15" y="130" width="55" height="55" rx="6" fill="#1C1B1F" />
              <rect x="25" y="140" width="35" height="35" rx="3" fill="#FFFFFF" />
              <rect x="33" y="148" width="19" height="19" rx="2" fill="#1C1B1F" />

              {/* Timing & Data Pattern Matrix */}
              <rect x="80" y="20" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="20" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="40" width="10" height="10" fill="#1C1B1F" />
              <rect x="105" y="40" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="60" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="60" width="10" height="10" fill="#1C1B1F" />

              <rect x="20" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="40" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="60" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="120" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="140" y="80" width="10" height="10" fill="#1C1B1F" />
              <rect x="160" y="80" width="10" height="10" fill="#1C1B1F" />

              <rect x="30" y="100" width="10" height="10" fill="#1C1B1F" />
              <rect x="50" y="100" width="10" height="10" fill="#1C1B1F" />
              <rect x="90" y="100" width="10" height="10" fill="#1C1B1F" />
              <rect x="110" y="100" width="10" height="10" fill="#1C1B1F" />
              <rect x="130" y="100" width="10" height="10" fill="#1C1B1F" />
              <rect x="170" y="100" width="10" height="10" fill="#1C1B1F" />

              <rect x="80" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="100" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="130" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="150" y="130" width="10" height="10" fill="#1C1B1F" />
              <rect x="80" y="150" width="10" height="10" fill="#1C1B1F" />
              <rect x="110" y="150" width="10" height="10" fill="#1C1B1F" />
              <rect x="140" y="150" width="10" height="10" fill="#1C1B1F" />
              <rect x="165" y="150" width="10" height="10" fill="#1C1B1F" />

              <rect x="90" y="170" width="10" height="10" fill="#1C1B1F" />
              <rect x="120" y="170" width="10" height="10" fill="#1C1B1F" />
              <rect x="150" y="170" width="10" height="10" fill="#1C1B1F" />
            </svg>
          </div>
          <span className="font-label-sm text-label-sm font-semibold text-primary mt-2">
            Quét mã để thanh toán tức thì
          </span>
        </div>

        {/* Bank & Memo Credentials */}
        <div className="md:col-span-7 flex flex-col space-y-space-sm">
          {/* Bank Name */}
          <div className="p-3 rounded-lg bg-surface-container-low/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-xs text-body-xs text-outline">Ngân hàng thụ hưởng</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {bankName}
              </span>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
          </div>

          {/* Account Number */}
          <div className="p-3 rounded-lg bg-surface-container-low/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-xs text-body-xs text-outline">Số tài khoản</span>
              <span
                id="vietqr-account-number"
                data-testid="cart-checkout-vietqr-account-number"
                className="font-title-sm text-title-sm font-bold text-primary tracking-wide num-tabular"
              >
                {accountNumber}
              </span>
            </div>
            <button
              id="copyAccountBtn"
              data-testid="cart-checkout-vietqr-btn-copy-account"
              type="button"
              onClick={() => copyToClipboard(accountNumber, 'account', 'Số tài khoản')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedField === 'account' ? 'done' : 'content_copy'}
              </span>
              <span>{copiedField === 'account' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          {/* Account Holder */}
          <div className="p-3 rounded-lg bg-surface-container-low/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-xs text-body-xs text-outline">Chủ tài khoản thụ hưởng</span>
              <span
                id="vietqr-account-holder"
                data-testid="cart-checkout-vietqr-account-holder"
                className="font-label-md text-label-md font-bold text-on-surface"
              >
                {accountHolder}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">badge</span>
          </div>

          {/* Transfer Amount */}
          <div className="p-3 rounded-lg bg-surface-container-low/60 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-xs text-body-xs text-outline">Số tiền cần chuyển</span>
              <span
                id="vietqr-transfer-amount"
                data-testid="cart-checkout-vietqr-amount"
                className="font-title-md text-title-md font-extrabold text-primary num-tabular"
              >
                {formatVND(finalAmount)}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">price_check</span>
          </div>

          {/* Transfer Memo */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-xs text-body-xs text-primary font-semibold">
                Nội dung chuyển khoản (Memo) / Transfer Content (Memo)
              </span>
              <span
                id="vietqr-transfer-memo"
                data-testid="cart-checkout-vietqr-memo"
                className="font-title-sm text-title-sm font-extrabold text-primary tracking-wide"
              >
                {transferMemo}
              </span>
            </div>
            <button
              id="copyMemoBtn"
              data-testid="cart-checkout-vietqr-btn-copy-memo"
              type="button"
              onClick={() => copyToClipboard(transferMemo, 'memo', 'Nội dung chuyển khoản')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedField === 'memo' ? 'done' : 'content_copy'}
              </span>
              <span>{copiedField === 'memo' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VietQrPaymentPanel;

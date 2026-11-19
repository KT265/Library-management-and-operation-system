import React, { useState } from 'react';
import { formatVND } from '../../utils/currency';
import { PaymentLinkResponse } from '../../services/payos';

export interface VietQrPaymentPanelProps {
  finalAmount: number;
  transferMemo: string;
  onCopySuccess?: (msg: string) => void;
  /** Whether the order has been confirmed by the user from the summary section */
  isOrderConfirmed: boolean;
  /** Live PayOS payment data returned from API */
  qrData?: PaymentLinkResponse | null;
  /** Backwards compatibility alias for qrData */
  payosData?: PaymentLinkResponse | null;
  /** Current payment status from parent polling */
  paymentStatus?: string | null;
  /** Whether the PayOS link is currently being created */
  isCreatingPayment?: boolean;
}

/**
 * Builds a VietQR image URL using the VietQR public API as a reliable fallback.
 */
function buildVietQrUrl(params: {
  bin?: string;
  accountNumber?: string;
  amount?: number;
  description?: string;
  accountName?: string;
}): string | null {
  const { bin, accountNumber, amount, description, accountName } = params;
  if (!bin || !accountNumber) return null;
  const base = 'https://img.vietqr.io/image';
  const enc = encodeURIComponent;
  const parts = [
    `amount=${amount ?? 0}`,
    `addInfo=${enc(description ?? '')}`,
    `accountName=${enc(accountName ?? '')}`,
  ].join('&');
  return `${base}/${bin}-${accountNumber}-compact2.png?${parts}`;
}

export const VietQrPaymentPanel: React.FC<VietQrPaymentPanelProps> = ({
  finalAmount,
  transferMemo,
  onCopySuccess,
  isOrderConfirmed,
  qrData,
  payosData,
  paymentStatus = 'PENDING',
  isCreatingPayment = false,
}) => {
  const [copiedField, setCopiedField] = useState<'account' | 'memo' | null>(null);

  // Unify data from qrData or payosData prop
  const activeData = qrData || payosData;

  // Resolve values dynamically from PayOS response or default fallbacks
  const bankName = activeData?.bin
    ? `${activeData.bin} · ${activeData.accountName ?? 'BOOKVERSE CORP'}`
    : 'MB Bank (Ngân hàng Quân Đội) / Vietcombank';
  const accountNumber = activeData?.accountNumber ?? 'VQRQANMHD6980';
  const accountHolder = activeData?.accountName ?? 'BOOKVERSE CORP';
  const displayAmount = activeData?.amount ?? finalAmount;
  const displayMemo = activeData?.description ?? transferMemo;

  // Resolve QR code image source
  let qrCodeSrc: string | null = null;
  if (activeData?.qrCode) {
    if (activeData.qrCode.startsWith('data:image') || activeData.qrCode.startsWith('http')) {
      qrCodeSrc = activeData.qrCode;
    } else {
      qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        activeData.qrCode
      )}`;
    }
  }

  const fallbackVietQrUrl = activeData
    ? buildVietQrUrl({
        bin: activeData.bin,
        accountNumber: activeData.accountNumber,
        amount: activeData.amount ?? finalAmount,
        description: activeData.description ?? transferMemo,
        accountName: activeData.accountName,
      })
    : null;

  const activeQrSrc = qrCodeSrc || fallbackVietQrUrl;

  const copyToClipboard = (text: string, field: 'account' | 'memo', label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    if (onCopySuccess) {
      onCopySuccess(`Đã sao chép ${label}: ${text}`);
    }
    setTimeout(() => setCopiedField(null), 2500);
  };

  const isPaid =
    paymentStatus?.toUpperCase() === 'PAID' || paymentStatus?.toUpperCase() === 'SUCCESS';

  return (
    <div
      id="qr-payment-section"
      data-testid="cart-checkout-vietqr-panel"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      {/* Title & Subtitle */}
      <div className="flex items-center gap-space-xs text-primary mb-space-sm">
        <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
        <h4 className="font-title-md text-title-md font-bold text-on-surface">
          Thanh toán VietQR tức thì qua PayOS
        </h4>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md pl-0 sm:pl-7">
        Mở ứng dụng ngân hàng hoặc ví điện tử (MoMo, ZaloPay, Viettel Money) để quét mã QR chuyển khoản tự động.
      </p>

      {/* User Instruction Section / Guidance Notes */}
      <div
        id="vietqr-instructions-card"
        data-testid="cart-checkout-vietqr-instructions"
        className="mb-space-md pl-0 sm:pl-7"
      >
        <div className="p-3.5 sm:p-4 rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex flex-col gap-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-bold">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>Hướng dẫn quy trình thanh toán</span>
          </div>

          <div className="flex flex-col space-y-2 text-on-surface-variant font-body-sm text-body-sm leading-relaxed pl-1 sm:pl-2">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] mt-0.5 shrink-0">
                1
              </span>
              <p className="text-on-surface">
                1. Khi bấm <strong className="font-semibold text-primary">Xác nhận đặt hàng</strong>, hệ thống sẽ chuyển qua cổng thanh toán VietQR.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] mt-0.5 shrink-0">
                2
              </span>
              <p className="text-on-surface">
                2. Sau khi thanh toán thành công, hệ thống sẽ tự động xác nhận đơn và trả bạn về lại trang web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONDITIONAL RENDERING PURELY BASED ON isOrderConfirmed PROP:
          - When NOT confirmed: Show helpful notification prompt. (No separate button here!)
          - When confirmed: Render loading spinner if creating payment, or full QR credentials grid once activeData is ready. */}
      {!isOrderConfirmed ? (
        <div className="pl-0 sm:pl-7 py-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
              lock
            </span>
            <p>
              Vui lòng nhấn nút <strong className="font-semibold text-primary">“Xác nhận đặt hàng”</strong> ở khung Tóm tắt đơn hàng bên phải để tạo mã QR thanh toán.
            </p>
          </div>
        </div>
      ) : isCreatingPayment && !activeData ? (
        /* Loading state while PayOS link is being generated by parent */
        <div className="pl-0 sm:pl-7 py-8 flex flex-col items-center justify-center gap-3 bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="font-label-md text-label-md font-semibold text-primary">
            Đang khởi tạo mã QR thanh toán PayOS...
          </span>
          <span className="font-body-xs text-body-xs text-outline">
            Vui lòng đợi trong giây lát
          </span>
        </div>
      ) : (
        /* QR Code and Payment Credentials Grid directly populated from PayOS */
        <div
          id="vietqr-credentials-grid"
          data-testid="cart-checkout-vietqr-grid"
          className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center pl-0 sm:pl-7 pt-space-xs"
        >
          {/* QR Code Container */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-space-md bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div className="w-48 h-48 bg-surface-container-lowest rounded-lg p-3 shadow-inner flex items-center justify-center overflow-hidden">
              {activeQrSrc ? (
                <img
                  src={activeQrSrc}
                  alt="VietQR Code — Quét để thanh toán"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    if (fallbackVietQrUrl && (e.target as HTMLImageElement).src !== fallbackVietQrUrl) {
                      (e.target as HTMLImageElement).src = fallbackVietQrUrl;
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-outline">
                  <span className="material-symbols-outlined text-[36px]">qr_code_2</span>
                  <span className="text-[12px] text-center font-medium">Đang tải mã QR...</span>
                </div>
              )}
            </div>

            <span className="font-label-sm text-label-sm font-semibold text-primary mt-2">
              Quét mã để thanh toán tức thì
            </span>

            {/* Live Polling Status Indicator */}
            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-xs text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPaid ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>
                {isPaid
                  ? 'Thanh toán thành công! Đang chuyển hướng...'
                  : 'Đang chờ thanh toán (Tự động cập nhật)...'}
              </span>
            </div>
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
                  {formatVND(displayAmount)}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">price_check</span>
            </div>

            {/* Transfer Memo */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1 mr-3">
                <span className="font-body-xs text-body-xs text-primary font-semibold">
                  Nội dung chuyển khoản (Memo) / Transfer Content (Memo)
                </span>
                <span
                  id="vietqr-transfer-memo"
                  data-testid="cart-checkout-vietqr-memo"
                  className="font-title-sm text-title-sm font-extrabold text-primary tracking-wide truncate"
                >
                  {displayMemo}
                </span>
              </div>
              <button
                id="copyMemoBtn"
                data-testid="cart-checkout-vietqr-btn-copy-memo"
                type="button"
                onClick={() => copyToClipboard(displayMemo, 'memo', 'Nội dung chuyển khoản')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedField === 'memo' ? 'done' : 'content_copy'}
                </span>
                <span>{copiedField === 'memo' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* Direct PayOS checkout link if available */}
            {activeData?.checkoutUrl && (
              <div className="pt-1">
                <a
                  href={activeData.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  Mở cổng thanh toán PayOS trực tiếp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VietQrPaymentPanel;

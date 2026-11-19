import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { AdminVoucher } from './types';

interface VoucherTableRowProps {
  voucher: AdminVoucher;
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onEdit: (voucher: AdminVoucher) => void;
  onDeactivate?: (voucherId: string) => void;
  onRelaunch?: (voucherId: string) => void;
  onArchive?: (voucherId: string) => void;
}

export const VoucherTableRow: React.FC<VoucherTableRowProps> = ({
  voucher,
  copiedCode,
  onCopyCode,
  onEdit,
  onDeactivate,
  onRelaunch,
  onArchive,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const usagePercent = Math.min(
    100,
    Math.round((voucher.usedCount / voucher.totalUsageLimit) * 100)
  );
  const isExpiring = voucher.status === 'expiring';
  const isDeactivatedOrExpired = voucher.stateVoucher === false || voucher.status === 'expired';

  // Map progress bar width to Tailwind classes without inline styles
  const getProgressWidthClass = (percent: number) => {
    if (percent >= 100) return 'w-full';
    if (percent >= 90) return 'w-[90%]';
    if (percent >= 85) return 'w-[89%]';
    if (percent >= 80) return 'w-[83%]';
    if (percent >= 70) return 'w-[70%]';
    if (percent >= 65) return 'w-[68%]';
    if (percent >= 60) return 'w-[60%]';
    if (percent >= 50) return 'w-[50%]';
    if (percent >= 40) return 'w-[40%]';
    if (percent >= 30) return 'w-[30%]';
    if (percent >= 20) return 'w-[20%]';
    if (percent >= 10) return 'w-[10%]';
    return 'w-0';
  };

  // Handler: Deactivate Voucher (stateVoucher: false)
  const handleDeactivate = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await updateDoc(doc(db, 'Vouchers', voucher.id), {
        stateVoucher: false,
        updateAt: serverTimestamp(),
      });
      if (onDeactivate) {
        onDeactivate(voucher.id);
      }
    } catch (err) {
      console.error('[VoucherTableRow] Lỗi khi tạm dừng voucher:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Relaunch Voucher (stateVoucher: true)
  const handleRelaunch = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await updateDoc(doc(db, 'Vouchers', voucher.id), {
        stateVoucher: true,
        updateAt: serverTimestamp(),
      });
      if (onRelaunch) {
        onRelaunch(voucher.id);
      }
    } catch (err) {
      console.error('[VoucherTableRow] Lỗi khi kích hoạt lại voucher:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Archive Forever (deleteDoc)
  const handleArchive = async () => {
    if (isProcessing) return;
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn voucher “${voucher.code}” khỏi Firestore không?`);
    if (!confirmDelete) return;

    try {
      setIsProcessing(true);
      await deleteDoc(doc(db, 'Vouchers', voucher.id));
      if (onArchive) {
        onArchive(voucher.id);
      }
    } catch (err) {
      console.error('[VoucherTableRow] Lỗi khi xóa vĩnh viễn voucher:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <tr
      id={`voucher-row-${voucher.id}`}
      data-testid={`admin-vouchers-row-${voucher.id}`}
      className={`border-b border-surface-container transition-colors group ${
        isDeactivatedOrExpired
          ? 'opacity-65 hover:bg-surface-container-low/60'
          : isExpiring
          ? 'bg-amber-500/5 hover:bg-surface-container-low/80'
          : 'hover:bg-surface-container-low/60'
      }`}
    >
      {/* 1. Voucher Code & Copy Action */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-label-md px-3 py-1 rounded-md font-bold tracking-wider select-all ${
              isDeactivatedOrExpired
                ? 'bg-surface-container-highest text-secondary line-through'
                : isExpiring
                ? 'bg-amber-100 text-amber-900'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            {voucher.code}
          </span>
          <button
            type="button"
            id={`btn-copy-${voucher.code}`}
            data-testid={`admin-vouchers-btn-copy-${voucher.code}`}
            title="Copy Code"
            onClick={() => onCopyCode(voucher.code)}
            className="text-outline hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
          >
            {copiedCode === voucher.code ? (
              <span className="material-symbols-outlined text-[16px] text-emerald-600">done</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            )}
          </button>
        </div>
      </td>

      {/* 2. Campaign & Description */}
      <td className="py-3.5 px-4">
        <div className="max-w-xs">
          <div
            className={`font-title-sm text-title-sm font-bold ${
              isDeactivatedOrExpired ? 'text-secondary' : 'text-primary'
            }`}
          >
            {voucher.campaign}
          </div>
          <div
            className={`font-body-sm text-body-sm truncate mt-0.5 ${
              isDeactivatedOrExpired ? 'text-outline' : 'text-on-surface-variant'
            }`}
          >
            {voucher.description}
          </div>
        </div>
      </td>

      {/* 3. Discount Value */}
      <td className="py-3.5 px-4">
        <div
          className={`font-label-lg text-label-lg font-bold num-tabular ${
            isDeactivatedOrExpired ? 'text-secondary' : isExpiring ? 'text-tertiary' : 'text-primary'
          }`}
        >
          {voucher.discountLabel}
        </div>
        <div
          className={`font-body-sm text-body-sm mt-0.5 ${
            isDeactivatedOrExpired ? 'text-outline' : 'text-secondary'
          }`}
        >
          {voucher.conditionNote}
        </div>
      </td>

      {/* 4. Usage / Limit Progress Bar */}
      <td className="py-3.5 px-4 min-w-[190px]">
        <div className="space-y-1.5">
          <div className="flex justify-between font-label-sm text-label-sm text-secondary num-tabular">
            <span>
              {voucher.usedCount} / {voucher.totalUsageLimit.toLocaleString('vi-VN')} lượt dùng
            </span>
            <span
              className={`font-bold ${
                isDeactivatedOrExpired ? 'text-secondary' : isExpiring ? 'text-tertiary' : 'text-primary'
              }`}
            >
              {usagePercent}%
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-surface-container overflow-hidden"
            data-progress={`width: ${usagePercent}%`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${getProgressWidthClass(
                usagePercent
              )} ${
                isDeactivatedOrExpired ? 'bg-secondary' : isExpiring ? 'bg-tertiary' : 'bg-primary'
              }`}
            />
          </div>
        </div>
      </td>

      {/* 5. Expiry Date */}
      <td className="py-3.5 px-4">
        <div
          className={`font-label-md text-label-md font-medium ${
            isDeactivatedOrExpired
              ? 'text-secondary'
              : isExpiring
              ? 'text-tertiary font-bold'
              : 'text-primary'
          }`}
        >
          {voucher.expiryDate}
        </div>
        <div
          className={`font-body-sm text-body-sm mt-0.5 ${
            isDeactivatedOrExpired
              ? 'text-outline'
              : isExpiring
              ? 'text-tertiary font-semibold'
              : 'text-secondary'
          }`}
        >
          {voucher.expiryNote}
        </div>
      </td>

      {/* 6. Status Badge */}
      <td className="py-3.5 px-4 text-center">
        {!isDeactivatedOrExpired && voucher.status === 'active' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-emerald-50 text-emerald-800 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Đang áp dụng (Active)
          </span>
        )}
        {!isDeactivatedOrExpired && voucher.status === 'expiring' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-amber-50 text-amber-800 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Sắp hết hạn (Expiring)
          </span>
        )}
        {isDeactivatedOrExpired && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-surface-container-high text-secondary shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" /> Đã tắt / Hết hạn
          </span>
        )}
      </td>

      {/* 7. Action Buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Edit Campaign Button */}
          <button
            type="button"
            id={`btn-edit-voucher-${voucher.id}`}
            data-testid={`admin-vouchers-btn-edit-${voucher.id}`}
            title="Chỉnh sửa Voucher"
            onClick={() => onEdit(voucher)}
            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>

          {/* Deactivate Button (Pause icon) or Relaunch Button (Play icon) */}
          {!isDeactivatedOrExpired ? (
            <button
              type="button"
              id={`btn-deactivate-voucher-${voucher.id}`}
              data-testid={`admin-vouchers-btn-deactivate-${voucher.id}`}
              title="Tạm dừng áp dụng (Deactivate)"
              disabled={isProcessing}
              onClick={handleDeactivate}
              className="p-1.5 rounded-full text-secondary hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">pause_circle</span>
            </button>
          ) : (
            <button
              type="button"
              id={`btn-relaunch-voucher-${voucher.id}`}
              data-testid={`admin-vouchers-btn-relaunch-${voucher.id}`}
              title="Kích hoạt lại (Relaunch)"
              disabled={isProcessing}
              onClick={handleRelaunch}
              className="p-1.5 rounded-full text-secondary hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
            </button>
          )}

          {/* Archive Forever Button (Trash icon: deleteDoc) */}
          <button
            type="button"
            id={`btn-archive-voucher-${voucher.id}`}
            data-testid={`admin-vouchers-btn-archive-${voucher.id}`}
            title="Xóa vĩnh viễn (Archive Forever)"
            disabled={isProcessing}
            onClick={handleArchive}
            className="p-1.5 rounded-full text-outline hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

import React, { useState, useEffect } from 'react';
import { formatVND } from '../../utils/currency';
import { AdminVoucher, VoucherDiscountType } from './types';

interface CreateVoucherModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  editingVoucher: AdminVoucher | null;
  onClose: () => void;
  onSaveVoucher: (voucher: AdminVoucher) => void;
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  isOpen,
  mode,
  editingVoucher,
  onClose,
  onSaveVoucher,
}) => {
  const [code, setCode] = useState('');
  const [campaign, setCampaign] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<VoucherDiscountType>('percent');
  const [discountValue, setDiscountValue] = useState('20');
  const [minSpend, setMinSpend] = useState('200000');
  const [totalUsageLimit, setTotalUsageLimit] = useState('500');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingVoucher && mode === 'edit') {
      setCode(editingVoucher.code);
      setCampaign(editingVoucher.campaign);
      setDescription(editingVoucher.description);
      setDiscountType(editingVoucher.discountType);
      setDiscountValue(String(editingVoucher.discountValue));
      setMinSpend(String(editingVoucher.minSpend || 0));
      setTotalUsageLimit(String(editingVoucher.totalUsageLimit));
      setError(null);
    } else if (mode === 'create') {
      setCode('');
      setCampaign('');
      setDescription('');
      setDiscountType('percent');
      setDiscountValue('20');
      setMinSpend('200000');
      setTotalUsageLimit('500');
      setError(null);
    }
  }, [editingVoucher, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      setError('Vui lòng nhập mã voucher hợp lệ (chữ in hoa và số).');
      return;
    }

    if (!campaign.trim()) {
      setError('Vui lòng nhập tên chiến dịch khuyến mại.');
      return;
    }

    const valueNum = parseFloat(discountValue) || 0;
    const minSpendNum = parseInt(minSpend.replace(/[^0-9]/g, ''), 10) || 0;
    const limitNum = parseInt(totalUsageLimit, 10) || 100;

    if (discountType === 'percent' && (valueNum <= 0 || valueNum > 100)) {
      setError('Tỷ lệ phần trăm giảm giá phải nằm trong khoảng từ 1% đến 100%.');
      return;
    }

    let discountLabel = '';
    let conditionNote = '';

    if (discountType === 'percent') {
      discountLabel = `Giảm ${valueNum}%`;
      conditionNote = minSpendNum > 0 ? `Đơn tối thiểu ${formatVND(minSpendNum)}` : 'Không giới hạn đơn tối thiểu';
    } else if (discountType === 'fixed') {
      discountLabel = `Giảm ${formatVND(valueNum)}`;
      conditionNote = minSpendNum > 0 ? `Đơn từ ${formatVND(minSpendNum)}` : 'Áp dụng cho mọi đơn';
    } else {
      discountLabel = 'Miễn phí vận chuyển';
      conditionNote = minSpendNum > 0 ? `Đơn tối thiểu ${formatVND(minSpendNum)}` : 'Miễn phí giao hàng tiêu chuẩn';
    }

    const voucher: AdminVoucher = {
      id: editingVoucher?.id || `v-${Date.now()}`,
      code: cleanCode,
      campaign: campaign.trim(),
      description: description.trim() || 'Chương trình ưu đãi độc quyền BookVerse',
      discountType,
      discountValue: valueNum,
      discountLabel,
      conditionNote,
      usedCount: editingVoucher?.usedCount || 0,
      totalUsageLimit: limitNum,
      expiryDate,
      expiryNote: 'Hiệu lực theo niên hạn chiến dịch',
      status: 'active',
      minSpend: minSpendNum,
      startDate,
    };

    onSaveVoucher(voucher);
    onClose();
  };

  return (
    <div
      id="create-voucher-modal-backdrop"
      data-testid="admin-vouchers-modal-create-backdrop"
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="create-voucher-modal"
        data-testid="admin-vouchers-modal-create"
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-xl w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">loyalty</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-primary">
                {mode === 'create'
                  ? 'Thiết lập Chiến dịch Khuyến mại Mới'
                  : 'Chỉnh sửa Quy tắc Voucher'}
              </h3>
              <p className="font-body-sm text-secondary">
                Cấu hình tỷ lệ chiết khấu, điều kiện đơn tối thiểu và hạn mức sử dụng
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-voucher-modal"
            data-testid="admin-vouchers-modal-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div
            id="voucher-error-banner"
            data-testid="admin-vouchers-modal-error"
            className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md font-body-sm text-body-sm">
          {/* Row 1: Code & Campaign Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="voucherCodeInput" className="block text-secondary font-medium mb-1">
                Mã ưu đãi (Promo Code) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="voucherCodeInput"
                data-testid="admin-vouchers-modal-input-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ví dụ: BOOKVERSE15"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>
            <div>
              <label htmlFor="input-campaign-name" className="block text-secondary font-medium mb-1">
                Tên chiến dịch <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="input-campaign-name"
                data-testid="admin-vouchers-modal-input-campaign"
                required
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="Ví dụ: Hội sách Tri ân Mùa Thu..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 2: Discount Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="select-discount-type" className="block text-secondary font-medium mb-1">
                Hình thức giảm giá
              </label>
              <select
                id="select-discount-type"
                data-testid="admin-vouchers-modal-select-type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as VoucherDiscountType)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="percent">Giảm theo tỷ lệ phần trăm (%)</option>
                <option value="fixed">Giảm số tiền cố định (₫)</option>
                <option value="shipping">Miễn phí vận chuyển (Freeship)</option>
              </select>
            </div>
            <div>
              <label htmlFor="input-discount-val" className="block text-secondary font-medium mb-1">
                Mức giảm giá {discountType === 'percent' ? '(%)' : '(VND)'} <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="input-discount-val"
                data-testid="admin-vouchers-modal-input-value"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
          </div>

          {/* Row 3: Minimum Spend & Usage Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="input-min-spend" className="block text-secondary font-medium mb-1">
                Đơn hàng tối thiểu (VND)
              </label>
              <input
                type="number"
                id="input-min-spend"
                data-testid="admin-vouchers-modal-input-min-spend"
                min="0"
                step="10000"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
            <div>
              <label htmlFor="input-max-usage" className="block text-secondary font-medium mb-1">
                Tổng lượt sử dụng tối đa
              </label>
              <input
                type="number"
                id="input-max-usage"
                data-testid="admin-vouchers-modal-input-max-usage"
                min="1"
                value={totalUsageLimit}
                onChange={(e) => setTotalUsageLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
          </div>

          {/* Row 4: Start & Expiry Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="input-start-date" className="block text-secondary font-medium mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                id="input-start-date"
                data-testid="admin-vouchers-modal-input-start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="input-expiry-date" className="block text-secondary font-medium mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                id="input-expiry-date"
                data-testid="admin-vouchers-modal-input-expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
            <button
              type="button"
              id="btn-cancel-voucher-modal"
              data-testid="admin-vouchers-modal-btn-cancel"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              id="btn-submit-save-voucher"
              data-testid="admin-vouchers-modal-btn-submit"
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer"
            >
              Lưu &amp; Kích hoạt mã ưu đãi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

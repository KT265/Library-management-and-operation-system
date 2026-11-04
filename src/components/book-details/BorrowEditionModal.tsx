import React, { useState } from 'react';
import { Book } from '../../types';
import { useStore } from '../../store/useStore';

interface BorrowEditionModalProps {
  isOpen: boolean;
  book: Book;
  onClose: () => void;
}

export const BorrowEditionModal: React.FC<BorrowEditionModalProps> = ({
  isOpen,
  book,
  onClose,
}) => {
  const [loanDays, setLoanDays] = useState<number>(14);
  const [agreed, setAgreed] = useState<boolean>(true);
  const { showToast } = useStore();

  if (!isOpen) return null;

  const handleConfirmBorrow = () => {
    if (!agreed) {
      showToast('Vui lòng đồng ý với nội quy lưu thông thư quán.');
      return;
    }
    showToast(`Đã ghi nhận yêu cầu mượn cuốn "${book.title}" trong ${loanDays} ngày!`);
    onClose();
  };

  return (
    <div
      id="borrow-edition-modal"
      data-testid="book-details-borrow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl border border-outline-variant/30 animate-scale-up">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">local_library</span>
            <h3 className="font-title-md font-bold text-primary">Mượn ấn bản đọc</h3>
          </div>
          <button
            type="button"
            data-testid="book-details-borrow-modal-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-space-md">
          {/* Book Info Snippet */}
          <div className="flex items-center gap-3 p-space-sm rounded-2xl bg-surface-container-low">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg shadow-xs"
            />
            <div>
              <h4 className="font-title-sm font-bold text-primary line-clamp-1">{book.title}</h4>
              <p className="font-body-xs text-secondary">{book.author} • {book.publisher}</p>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="font-label-md font-bold text-on-surface block mb-1">
              Thời gian mượn đọc:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[14, 21, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  data-testid={`book-details-borrow-days-${days}`}
                  onClick={() => setLoanDays(days)}
                  className={`py-2 px-3 rounded-full text-center font-label-md font-semibold transition-all cursor-pointer ${
                    loanDays === days
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {days} ngày
                </button>
              ))}
            </div>
          </div>

          {/* Library Rule Agreement */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
            />
            <span className="font-body-xs text-secondary leading-snug">
              Tôi cam kết bảo quản nguyên vẹn ấn bản, không gấp trang và hoàn trả đúng hạn quy định.
            </span>
          </label>

          {/* Action CTAs */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-high transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              data-testid="book-details-borrow-modal-btn-confirm"
              onClick={handleConfirmBorrow}
              className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow hover:bg-primary-container transition-all"
            >
              Xác nhận mượn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

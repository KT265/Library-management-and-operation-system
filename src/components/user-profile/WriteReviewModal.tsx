import React, { useState } from 'react';
import { OrderDisplay } from './types';

export interface WriteReviewModalProps {
  isOpen: boolean;
  order: OrderDisplay | null;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  order,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Vui lòng chọn đánh giá từ 1 đến 5 sao.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Nội dung đánh giá cần tối thiểu 10 ký tự.');
      return;
    }
    setError(null);
    onSubmit(rating, comment.trim());
    setComment('');
  };

  const firstItem = order.items[0];

  return (
    <div
      id="write-review-modal"
      data-testid="user-profile-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-space-md bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">rate_review</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Viết đánh giá ấn phẩm
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col space-y-space-md">
          {/* Target Book Info */}
          {firstItem && (
            <div className="flex items-center gap-3 p-3 bg-surface-container-low/60 rounded-lg">
              <img
                src={firstItem.coverImage}
                alt={firstItem.title}
                className="w-12 h-16 rounded object-cover shadow-xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                  {firstItem.title}
                </span>
                <span className="font-body-xs text-body-xs text-on-surface-variant">
                  {firstItem.author} • Đơn hàng {order.orderNumber}
                </span>
              </div>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="flex flex-col items-center justify-center py-2">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold mb-2">
              Chất lượng ấn phẩm &amp; trải nghiệm đọc:
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  data-testid={'user-profile-review-star-' + star}
                  onClick={() => setRating(star)}
                  className="p-1 text-tertiary hover:scale-110 transition-transform cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${
                      star <= rating ? 'fill text-amber-500' : 'text-outline-variant'
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="font-label-sm text-label-sm font-bold text-primary mt-1">
              {rating === 5
                ? 'Tuyệt tác xuất sắc (5/5 sao)'
                : rating === 4
                ? 'Rất đáng đọc (4/5 sao)'
                : rating === 3
                ? 'Nội dung đạt chuẩn (3/5 sao)'
                : rating === 2
                ? 'Chưa thực sự ưng ý (2/5 sao)'
                : 'Cần cải thiện (1/5 sao)'}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              Cảm nhận và nhận xét của bạn
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nghĩ sâu sắc về lối viết, bản dịch hoặc chất lượng đóng sách (tối thiểu 10 ký tự)..."
              className="w-full p-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
            />
          </div>

          {/* Error notice */}
          {error && (
            <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="submitReviewBtn"
              data-testid="user-profile-review-modal-btn-submit"
              type="submit"
              className="h-10 px-6 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;

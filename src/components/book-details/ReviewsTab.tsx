import React from 'react';
import { Book } from '../../types';

interface ReviewsTabProps {
  book: Book;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ book }) => {
  return (
    <div
      id="tab-content-reviews"
      data-testid="book-details-tab-content-reviews"
      className="space-y-space-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
        {/* Rating Score Summary */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-space-lg rounded-3xl bg-surface-container-low text-center">
          <span className="font-display-md text-display-md font-bold text-primary leading-none">
            {book.rating.toFixed(1)}
          </span>
          <div className="flex items-center text-tertiary-container my-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="material-symbols-outlined text-[20px] fill">
                star
              </span>
            ))}
          </div>
          <span className="font-body-sm text-body-sm text-secondary">
            Dựa trên {book.reviewCount} lượt đánh giá từ độc giả
          </span>
        </div>

        {/* Rating Distribution Histogram */}
        <div className="md:col-span-8 flex flex-col gap-2">
          {/* 5 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">
              5 sao
              <span className="sr-only"> (5 stars)</span>
            </span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-tertiary rounded-full transition-all duration-500 w-[88%]" />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              88%
            </span>
          </div>

          {/* 4 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">
              4 sao
              <span className="sr-only"> (4 stars)</span>
            </span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-tertiary/70 rounded-full transition-all duration-500 w-[9%]" />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              9%
            </span>
          </div>

          {/* 3 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">3 sao</span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-tertiary/50 rounded-full transition-all duration-500 w-[2%]" />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              2%
            </span>
          </div>

          {/* 2 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">2 sao</span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-tertiary/30 rounded-full transition-all duration-500 w-[1%]" />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              1%
            </span>
          </div>
        </div>
      </div>

      {/* Reviewer Cards */}
      <div className="space-y-space-sm pt-space-sm">
        <h4 className="font-title-md text-title-md font-bold text-primary mb-space-sm">
          Đánh giá tiêu biểu từ người mua
        </h4>

        {/* Review 1: Alexandre R. */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-label-lg font-bold text-primary">Alexandre R.</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px]">
                Đã mua ấn bản tiêu chuẩn
              </span>
            </div>
            <div className="flex items-center text-tertiary-container">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-[16px] fill">
                  star
                </span>
              ))}
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface">
            Một tác phẩm chuẩn mực về kỹ thuật phần mềm. Cách tác giả hệ thống hóa các khái niệm lưu trữ dữ liệu, mô hình nhất quán và xử lý phân tán cực kỳ rõ ràng, mạch lạc.
          </p>
        </div>

        {/* Review 2: Danielle Lin */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-label-lg font-bold text-primary">Danielle Lin</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px]">
                Đã mua ấn bản tiêu chuẩn
              </span>
            </div>
            <div className="flex items-center text-tertiary-container">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-[16px] fill">
                  star
                </span>
              ))}
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface">
            Chất lượng in ấn tuyệt hảo, gáy sách mở phẳng rất thoải mái khi đọc và ghi chú. Đây là cuốn sách bắt buộc phải có trên bàn làm việc của mọi kỹ sư.
          </p>
        </div>
      </div>
    </div>
  );
};

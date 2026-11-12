import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { Book } from '../../types';

interface ReviewsTabProps {
  book: Book;
}

interface ReviewItem {
  id: string;
  idBookReview: string;
  idUserReview?: string;
  userNameReview: string;
  rating: number;
  detail: string;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ book }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      if (!book?.id) {
        setReviews([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, FIRESTORE_COLLECTIONS.REVIEWS),
          where('idBookReview', '==', book.id)
        );
        const snapshot = await getDocs(q);
        const items: ReviewItem[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            idBookReview: d.idBookReview || book.id,
            idUserReview: d.idUserReview,
            userNameReview: d.userNameReview || d.author || 'Độc giả',
            rating: typeof d.rating === 'number' ? d.rating : 5,
            detail: d.detail || d.comment || '',
          };
        });
        if (isMounted) {
          setReviews(items);
          setLoading(false);
        }
      } catch (err) {
        console.error('[ReviewsTab] Error fetching reviews:', err);
        if (isMounted) {
          setError('Không thể tải đánh giá từ hệ thống.');
          setLoading(false);
        }
      }
    }

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [book?.id]);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : (book.rating ?? 5.0).toFixed(1);

  const star5Count = reviews.filter((r) => Math.round(r.rating) === 5).length;
  const star4Count = reviews.filter((r) => Math.round(r.rating) === 4).length;
  const star3Count = reviews.filter((r) => Math.round(r.rating) === 3).length;
  const star2Count = reviews.filter((r) => Math.round(r.rating) === 2).length;
  const star1Count = reviews.filter((r) => Math.round(r.rating) === 1).length;

  const star5Pct = totalReviews > 0 ? Math.round((star5Count / totalReviews) * 100) : 0;
  const star4Pct = totalReviews > 0 ? Math.round((star4Count / totalReviews) * 100) : 0;
  const star3Pct = totalReviews > 0 ? Math.round((star3Count / totalReviews) * 100) : 0;
  const star2Pct = totalReviews > 0 ? Math.round(((star2Count + star1Count) / totalReviews) * 100) : 0;

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
            {avgRating}
          </span>
          <div className="flex items-center text-tertiary-container my-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="material-symbols-outlined text-[20px] fill">
                star
              </span>
            ))}
          </div>
          <span className="font-body-sm text-body-sm text-secondary">
            Dựa trên {totalReviews > 0 ? totalReviews : book.reviewCount} lượt đánh giá từ độc giả
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
              <div
                className="h-full bg-tertiary rounded-full transition-all duration-500"
                style={{ width: `${star5Pct}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              {star5Pct}%
            </span>
          </div>

          {/* 4 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">
              4 sao
              <span className="sr-only"> (4 stars)</span>
            </span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-tertiary/70 rounded-full transition-all duration-500"
                style={{ width: `${star4Pct}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              {star4Pct}%
            </span>
          </div>

          {/* 3 stars */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">3 sao</span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-tertiary/50 rounded-full transition-all duration-500"
                style={{ width: `${star3Pct}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              {star3Pct}%
            </span>
          </div>

          {/* 2 sao & 1 sao */}
          <div className="flex items-center gap-3">
            <span className="font-label-md text-label-md w-16 text-on-surface">2 sao</span>
            <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-tertiary/30 rounded-full transition-all duration-500"
                style={{ width: `${star2Pct}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm w-10 text-right font-bold text-primary">
              {star2Pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-space-lg text-center text-secondary font-body-md">
          Đang tải đánh giá từ hệ thống...
        </div>
      )}

      {error && (
        <div className="p-space-md text-center text-error bg-error-container/20 rounded-2xl font-body-sm">
          {error}
        </div>
      )}

      {/* Reviewer Cards */}
      {!loading && !error && (
        <div className="space-y-space-sm pt-space-sm">
          <h4 className="font-title-md text-title-md font-bold text-primary mb-space-sm">
            Đánh giá từ độc giả
          </h4>

          {reviews.length === 0 ? (
            <div className="p-space-lg text-center rounded-2xl bg-surface-container-low text-secondary font-body-md">
              Chưa có đánh giá nào cho cuốn sách này. Hãy là người đầu tiên chia sẻ cảm nhận của bạn!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg font-bold text-primary">{rev.userNameReview}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px]">
                      Đã mua ấn bản tiêu chuẩn
                    </span>
                  </div>
                  <div className="flex items-center text-tertiary-container">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-[16px] ${
                          i <= Math.round(rev.rating) ? 'fill' : ''
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface">
                  {rev.detail}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

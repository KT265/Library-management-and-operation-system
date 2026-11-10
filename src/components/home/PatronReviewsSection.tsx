import React, { useState, useEffect } from 'react';
import { fetchReviewsFromFirestore } from '../../services/firebase';

export interface PatronReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  avatarText: string;
}

const DEFAULT_REVIEWS: PatronReview[] = [
  {
    id: 'rev-default-1',
    author: 'Alexandre Xu',
    role: 'Kỹ sư Trưởng Hệ thống Phân tán',
    rating: 5,
    date: '14/10/2026',
    comment:
      'Không thể nghi ngờ đây là trải nghiệm đặt sách tuyệt vời nhất. Ấn bản giấy chất lượng cao, đóng gói cẩn thận và dịch vụ giao nhận hỏa tốc cực kỳ chuẩn xác.',
    avatarText: 'AX',
  },
  {
    id: 'rev-default-2',
    author: 'Sarah Chen',
    role: 'Trưởng nhóm Kiến trúc Phần mềm CloudNative',
    rating: 5,
    date: '28/09/2026',
    comment:
      'Tuyển tập sách công nghệ và văn học tinh tuyển ở đây hoàn toàn khác biệt so với thị trường đại trà. Mọi chi tiết từ bìa cứng đến chất giấy đều đạt chuẩn lưu trữ.',
    avatarText: 'SC',
  },
  {
    id: 'rev-default-3',
    author: 'Minh Nguyễn',
    role: 'Nhà nghiên cứu Khoa học Dữ liệu',
    rating: 5,
    date: '02/11/2026',
    comment:
      'Thanh toán quét mã VietQR qua PayOS diễn ra trong vài giây, hóa đơn điện tử gửi về ngay lập tức. Cực kỳ ấn tượng với phong cách làm việc chuyên nghiệp của BookVerse.',
    avatarText: 'MN',
  },
];

const VALUE_PROPS = [
  {
    icon: 'verified_user',
    title: '100% Ấn bản chính hãng',
    desc: 'Phát hành trực tiếp từ các nhà xuất bản uy tín và đối tác in ấn tiêu chuẩn quốc tế.',
  },
  {
    icon: 'qr_code_scanner',
    title: 'Thanh toán VietQR tức thì',
    desc: 'Quét mã thanh toán bảo mật với cơ chế đối soát tự động, xuất hóa đơn điện tử ngay.',
  },
  {
    icon: 'inventory_2',
    title: 'Đóng gói tiêu chuẩn bảo quản',
    desc: 'Bao bì chống sốc, màng bọc chống ẩm giữ cho các góc sách luôn nguyên vẹn hoàn hảo.',
  },
];

export const PatronReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<PatronReview[]>(DEFAULT_REVIEWS);

  useEffect(() => {
    fetchReviewsFromFirestore()
      .then((data) => {
        if (data && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => {
        console.warn('[PatronReviewsSection] Using fallback reviews:', err);
      });
  }, []);

  return (
    <section
      id="home-patron-reviews"
      data-testid="home-patron-reviews-section"
      className="w-full px-gutter-lg py-space-xl bg-surface-container-low/50 rounded-3xl my-space-md"
    >
      {/* 1. Institutional Assurance Bar */}
      <div className="mb-space-xxl">
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span
            data-testid="home-assurance-tag"
            className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-bold"
          >
            Đảm bảo từ nhà sách
          </span>
          <h2
            data-testid="home-assurance-heading"
            className="font-headline-md text-headline-md text-primary tracking-tight mt-1"
          >
            Cam kết chất lượng dịch vụ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {VALUE_PROPS.map((prop, idx) => (
            <div
              key={idx}
              data-testid={`home-assurance-card-${idx}`}
              className="flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">{prop.icon}</span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md font-bold text-primary mb-1">
                  {prop.title}
                </h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  {prop.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Reader Testimonials */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span
            data-testid="home-reviews-tag"
            className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold"
          >
            Phản hồi từ cộng đồng
          </span>
          <h2
            data-testid="home-reviews-heading"
            className="font-headline-md text-headline-md text-primary tracking-tight mt-1"
          >
            Độc giả nói gì về BookVerse
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {reviews.map((review) => (
            <div
              key={review.id}
              data-testid={`home-reviews-card-${review.id}`}
              className="flex flex-col justify-between p-space-lg bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20"
            >
              <div>
                {/* 5-star Rating */}
                <div className="flex items-center gap-1 text-tertiary-container mb-space-sm">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px] fill">
                      star
                    </span>
                  ))}
                </div>

                <p className="font-body-md text-body-md text-on-surface italic mb-space-md">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-space-sm border-t border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-label-md font-bold flex items-center justify-center shrink-0">
                  {review.avatarText}
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg font-bold text-primary">
                    {review.author}
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

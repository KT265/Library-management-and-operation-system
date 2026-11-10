import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../../utils/currency';
import { fetchBooksFromFirestore } from '../../services/firebase';

export interface RecommendedBookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  description: string;
}

interface RelatedBooksCarouselProps {
  currentBookId?: string;
}

export const RelatedBooksCarousel: React.FC<RelatedBooksCarouselProps> = ({ currentBookId }) => {
  const navigate = useNavigate();
  const recContainerRef = useRef<HTMLDivElement>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBookItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBooksFromFirestore()
      .then((books) => {
        if (!isMounted) return;
        const filtered = books
          .filter((b) => b.id !== currentBookId)
          .slice(0, 6)
          .map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: b.price,
            coverImage: b.coverImage,
            description: b.description ? b.description.slice(0, 90) + '...' : '',
          }));
        setRecommendedBooks(filtered);
      })
      .catch((err) => {
        console.error('[RelatedBooksCarousel] Error loading related books:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentBookId]);

  const handleScrollLeft = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="book-related-carousel"
      data-testid="book-details-related-section"
      className="mt-space-xl"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div>
          <h2
            data-testid="book-details-related-heading"
            className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight"
          >
            Những tác phẩm thường được độc giả chọn mua cùng
            <span className="sr-only"> (Readers Also Purchased)</span>
          </h2>
          <p
            data-testid="book-details-related-subtitle"
            className="font-body-md text-body-md text-secondary"
          >
            Tuyển chọn các ấn bản chuyên khảo thường được nghiên cứu đồng thời
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="recScrollLeft"
            data-testid="book-details-related-btn-prev"
            aria-label="Cuộn sang trái"
            onClick={handleScrollLeft}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-secondary-container flex items-center justify-center text-primary transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            type="button"
            id="recScrollRight"
            data-testid="book-details-related-btn-next"
            aria-label="Cuộn sang phải"
            onClick={handleScrollRight}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-secondary-container flex items-center justify-center text-primary transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        id="recContainer"
        data-testid="book-details-related-carousel-track"
        ref={recContainerRef}
        className="flex gap-space-md overflow-x-auto pb-space-sm no-scrollbar scroll-smooth"
      >
        {isLoading ? (
          <div className="py-12 flex items-center justify-center w-full text-secondary">
            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
            Đang tải tác phẩm liên quan...
          </div>
        ) : recommendedBooks.length === 0 ? (
          <div className="py-8 text-center w-full text-secondary text-body-sm">
            Hiện chưa có tác phẩm đề xuất liên quan.
          </div>
        ) : (
          recommendedBooks.map((rec) => (
            <div
              key={rec.id}
              data-testid={`book-details-related-card-${rec.id}`}
              onClick={() => navigate(`/book/${rec.id}`)}
              className="w-64 shrink-0 rounded-3xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md border border-outline-variant/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container mb-space-sm">
                  <img
                    src={rec.coverImage}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h4 className="font-title-sm text-title-sm font-bold text-primary group-hover:text-primary-container transition-colors line-clamp-1">
                  {rec.title}
                </h4>
                <p className="font-body-xs text-secondary mt-0.5 mb-1">{rec.author}</p>
                <p className="font-body-xs text-on-surface-variant line-clamp-2">
                  {rec.description}
                </p>
              </div>

              <div className="mt-space-sm pt-space-xs border-t border-outline-variant/20 flex items-center justify-between">
                <span className="font-title-md text-title-md font-bold text-primary num-tabular">
                  {formatVND(rec.price)}
                </span>
                <span className="material-symbols-outlined text-primary text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

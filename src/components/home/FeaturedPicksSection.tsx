import React, { useState } from 'react';
import { FeaturedBookCard, FeaturedBookItem } from './FeaturedBookCard';

interface FeaturedPicksSectionProps {
  books: FeaturedBookItem[];
  onAddToCart: (book: FeaturedBookItem) => void;
  onBuyNow: (book: FeaturedBookItem) => void;
}

export const FeaturedPicksSection: React.FC<FeaturedPicksSectionProps> = ({
  books,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tech' | 'fiction'>('all');

  const filteredBooks = books.filter((b) => {
    if (activeFilter === 'tech') return b.category === 'tech';
    if (activeFilter === 'fiction') return b.category === 'fiction';
    return true;
  });

  return (
    <section
      id="home-featured-picks"
      data-testid="home-featured-picks-section"
      className="w-full px-gutter-lg py-space-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-sm">
        <div>
          <h2
            data-testid="home-featured-heading"
            className="font-headline-md text-headline-md text-primary tracking-tight"
          >
            Ấn phẩm tiêu biểu tuyển chọn
          </h2>
          <p
            data-testid="home-featured-subheading"
            className="font-body-md text-body-md text-secondary mt-1"
          >
            Những ấn bản vật lý đặc biệt dành cho các nhà nghiên cứu, nhà sưu tầm và độc giả yêu sách.
          </p>
        </div>

        {/* Segmented Filter Pills */}
        <div
          data-testid="home-featured-filter-tabs"
          className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-full self-start sm:self-auto"
        >
          <button
            type="button"
            data-filter="all"
            data-testid="home-featured-tab-all"
            onClick={() => setActiveFilter('all')}
            className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tất cả
            <span className="sr-only"> (All Picks)</span>
          </button>
          <button
            type="button"
            data-filter="tech"
            data-testid="home-featured-tab-tech"
            onClick={() => setActiveFilter('tech')}
            className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
              activeFilter === 'tech'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Kỹ thuật
            <span className="sr-only"> (Engineering)</span>
          </button>
          <button
            type="button"
            data-filter="fiction"
            data-testid="home-featured-tab-fiction"
            onClick={() => setActiveFilter('fiction')}
            className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
              activeFilter === 'fiction'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Văn học
            <span className="sr-only"> (Literature)</span>
          </button>
        </div>
      </div>

      {/* Books Responsive Grid */}
      <div
        id="featuredGrid"
        data-testid="home-featured-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg"
      >
        {filteredBooks.map((book) => (
          <FeaturedBookCard
            key={book.id}
            book={book}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
    </section>
  );
};

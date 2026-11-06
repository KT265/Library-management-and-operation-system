import React from 'react';
import { Book } from '../../types';

interface BookHeroInfoProps {
  book: Book;
}

export const BookHeroInfo: React.FC<BookHeroInfoProps> = ({ book }) => {
  return (
    <div
      id="book-hero-info"
      data-testid="book-details-hero-info"
      className="flex flex-col gap-space-xs"
    >
      {/* Title & Subtitle */}
      <h1
        data-testid="book-details-hero-title"
        className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight"
      >
        {book.title}
      </h1>

      {book.subtitle && (
        <p
          data-testid="book-details-hero-subtitle"
          className="font-body-lg text-body-lg text-secondary leading-relaxed"
        >
          {book.subtitle}
        </p>
      )}

      {/* Author & Publisher Metadata */}
      <div
        data-testid="book-details-hero-metadata"
        className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-sm text-body-sm text-on-surface-variant pt-1"
      >
        <span>
          Tác giả:{' '}
          <strong className="text-on-surface font-semibold">{book.author}</strong>
        </span>
        <span className="text-outline">•</span>
        <span>
          Nhà xuất bản:{' '}
          <strong className="text-on-surface font-semibold">{book.publisher}</strong>
        </span>
        <span className="text-outline">•</span>
        <span>
          Năm xuất bản:{' '}
          <strong className="text-on-surface font-semibold">
            {book.specs?.publicationYear || 2021}
          </strong>
        </span>
      </div>

      {/* Star Rating & Warehouse Stock Availability */}
      <div
        data-testid="book-details-hero-rating-stock"
        className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs"
      >
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-tertiary">
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <span
                key={starIdx}
                className="material-symbols-outlined text-[18px] fill"
              >
                star
              </span>
            ))}
          </div>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            {book.rating.toFixed(1)}
          </span>
          <span className="font-body-sm text-body-sm text-outline">
            ({book.reviewCount} đánh giá từ độc giả)
          </span>
        </div>

        {/* Live Pulsing Stock Badge */}
        <div
          data-testid="book-details-hero-stock-badge"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-sm text-label-sm font-semibold"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>
            {book.stockCount || 38} bản có sẵn trong kho
            <span className="sr-only"> ({book.stockCount || 38} copies available in warehouse)</span>
          </span>
        </div>
      </div>
    </div>
  );
};

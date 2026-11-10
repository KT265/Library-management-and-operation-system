import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { formatVND } from '../../utils/currency';

export interface FeaturedBookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  dataAlt: string;
  category: 'tech' | 'fiction' | 'growth';
  inStock: boolean;
  bookRef: Book;
}

interface FeaturedBookCardProps {
  book: FeaturedBookItem;
  onAddToCart: (book: FeaturedBookItem) => void;
  onBuyNow: (book: FeaturedBookItem) => void;
}

export const FeaturedBookCard: React.FC<FeaturedBookCardProps> = ({
  book,
  onAddToCart,
  onBuyNow,
}) => {
  const navigate = useNavigate();

  return (
    <article
      id={`featured-card-${book.id}`}
      data-testid={`home-featured-grid-card-book-${book.id}`}
      className="group flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/book/${book.id}`)}
      >
        {/* 3:4 Aspect Ratio Cover Preview */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container mb-space-md shadow-inner">
          <img
            src={book.coverImage}
            data-alt={book.dataAlt}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Stock Status & Star Rating Row */}
        <div className="flex items-center justify-between mb-space-xs">
          <span
            data-testid={`home-featured-badge-stock-${book.id}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Còn hàng</span>
          </span>
          <div
            data-testid={`home-featured-rating-${book.id}`}
            className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary-container fill">
              star
            </span>
            <span className="font-bold">{book.rating}</span>
            <span className="text-outline">({book.reviewCount})</span>
          </div>
        </div>

        {/* Book Title & Author/Publisher */}
        <h3 className="font-title-md text-title-md text-primary font-bold line-clamp-1 group-hover:text-primary-container transition-colors">
          {book.title}
        </h3>
        <p className="font-body-sm text-body-sm text-secondary mb-space-md">
          {book.author} • {book.publisher}
        </p>
      </div>

      {/* Price & Action Button Cluster */}
      <div className="pt-space-sm mt-auto">
        <div className="flex items-baseline gap-2 mb-space-sm">
          <span
            data-testid={`home-featured-price-${book.id}`}
            className="font-title-lg text-title-lg text-primary font-bold num-tabular"
          >
            {formatVND(book.price)}
          </span>
          {book.originalPrice > book.price && (
            <span
              data-testid={`home-featured-original-price-${book.id}`}
              className="font-body-sm text-body-sm text-outline line-through num-tabular"
            >
              {formatVND(book.originalPrice)}
            </span>
          )}
        </div>

        {/* Action 1: Buy Now */}
        <button
          type="button"
          data-path="cart-checkout"
          data-testid={`home-featured-btn-buynow-${book.id}`}
          onClick={() => onBuyNow(book)}
          className="w-full mb-2 py-2 px-4 rounded-full bg-secondary-container text-on-primary-fixed hover:bg-secondary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Mua ngay</span>
        </button>

        {/* Action 2: Add to Bag */}
        <button
          type="button"
          data-testid={`home-featured-btn-addcart-${book.id}`}
          onClick={() => onAddToCart(book)}
          className="add-cart-btn w-full h-11 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </article>
  );
};

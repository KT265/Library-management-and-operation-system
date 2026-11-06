import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { formatVND } from '../../utils/currency';

interface CatalogBookCardProps {
  book: Book;
  genreTag: string;
  isAdded: boolean;
  onAddToCart: (e: React.MouseEvent, book: Book) => void;
  onBuyNow: (e: React.MouseEvent, book: Book) => void;
}

export const CatalogBookCard: React.FC<CatalogBookCardProps> = ({
  book,
  genreTag,
  isAdded,
  onAddToCart,
  onBuyNow,
}) => {
  const navigate = useNavigate();

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  return (
    <article
      id={`catalog-card-${book.id}`}
      data-testid={`catalog-book-grid-card-book-${book.id}`}
      className="group bg-surface-container-lowest rounded-3xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Book Cover Container */}
        <div
          onClick={() => navigate(`/book/${book.id}`)}
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-tr from-primary-container via-surface-variant to-secondary-container p-2 flex flex-col justify-between group-hover:scale-[1.01] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between z-10" />
          <img
            className="w-full h-full object-cover rounded-xl absolute inset-0"
            src={book.coverImage}
            alt={book.title}
          />
          <div className="relative z-10 mt-auto bg-gradient-to-t from-primary/95 via-primary/50 to-transparent p-3 pt-8 rounded-b-xl text-on-primary">
            <span
              data-testid={`catalog-book-badge-genre-${book.id}`}
              className="font-label-sm text-label-sm bg-surface-container-low/20 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              {genreTag}
            </span>
          </div>
        </div>

        {/* Book Details */}
        <div className="pt-3 px-1">
          <h3
            data-testid={`catalog-book-title-${book.id}`}
            onClick={() => navigate(`/book/${book.id}`)}
            className="font-title-md text-title-md font-bold text-primary group-hover:text-tertiary transition-colors line-clamp-1 cursor-pointer"
          >
            {book.title}
          </h3>
          <p
            data-testid={`catalog-book-author-${book.id}`}
            className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5"
          >
            {book.author}
          </p>

          {/* Ratings Row */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-tertiary">
              {[1, 2, 3, 4, 5].map((starIdx) => {
                const fillLevel = book.rating - starIdx + 1;
                if (fillLevel >= 0.8) {
                  return (
                    <span
                      key={starIdx}
                      className="material-symbols-outlined text-[16px] fill"
                    >
                      star
                    </span>
                  );
                } else if (fillLevel >= 0.3) {
                  return (
                    <span
                      key={starIdx}
                      className="material-symbols-outlined text-[16px] fill"
                    >
                      star_half
                    </span>
                  );
                }
                return (
                  <span
                    key={starIdx}
                    className="material-symbols-outlined text-[16px] text-outline-variant"
                  >
                    star
                  </span>
                );
              })}
            </div>
            <span
              data-testid={`catalog-book-rating-${book.id}`}
              className="font-label-sm text-label-sm font-bold text-on-surface"
            >
              {book.rating.toFixed(1)}
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              ({book.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price & Discount Row */}
          <div className="flex items-center gap-2 mt-2">
            <span
              data-testid={`catalog-book-price-${book.id}`}
              className="font-title-lg text-title-lg font-bold text-primary num-tabular"
            >
              {formatVND(book.price)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span
                data-testid={`catalog-book-original-price-${book.id}`}
                className="font-body-sm text-body-sm text-outline line-through num-tabular"
              >
                {formatVND(book.originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span
                data-testid={`catalog-book-discount-${book.id}`}
                className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/30 px-1.5 py-0.5 rounded-full"
              >
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stock & Action Buttons Footer */}
      <div className="pt-3 px-1">
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-primary-container font-semibold">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                (book.stockCount || 10) <= 3 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
            />
            {(book.stockCount || 10) <= 3
              ? `Chỉ còn ${book.stockCount} cuốn`
              : `Còn hàng (${book.stockCount || 24} cuốn)`}
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            Ấn bản tiêu chuẩn
          </span>
        </div>

        {/* Buy Now Button */}
        <button
          type="button"
          data-path="cart-checkout"
          data-testid={`catalog-book-card-btn-buynow-${book.id}`}
          onClick={(e) => onBuyNow(e, book)}
          className="w-full mb-2 py-2 px-4 rounded-full bg-secondary-container text-on-primary-fixed hover:bg-secondary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all border-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Mua ngay</span>
        </button>

        {/* Add to Bag Button */}
        <button
          type="button"
          data-testid={`catalog-book-card-btn-addcart-${book.id}`}
          onClick={(e) => onAddToCart(e, book)}
          className={`cart-btn w-full py-2.5 rounded-full font-label-md text-label-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm cursor-pointer ${
            isAdded
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-primary text-on-primary hover:bg-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isAdded ? 'check' : 'shopping_bag'}
          </span>
          <span>{isAdded ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}</span>
        </button>
      </div>
    </article>
  );
};

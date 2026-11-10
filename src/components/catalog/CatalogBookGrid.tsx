import React from 'react';
import { Book } from '../../types';
import { CatalogBookCard } from './CatalogBookCard';

interface CatalogBookGridProps {
  books: Book[];
  addedBookIds: Record<string, boolean>;
  genreTagMapping: Record<string, string>;
  onAddToCart: (e: React.MouseEvent, book: Book) => void;
  onBuyNow: (e: React.MouseEvent, book: Book) => void;
}

export const CatalogBookGrid: React.FC<CatalogBookGridProps> = ({
  books,
  addedBookIds,
  genreTagMapping,
  onAddToCart,
  onBuyNow,
}) => {
  return (
    <div
      id="catalog-book-grid"
      data-testid="catalog-book-grid"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md"
    >
      {books.map((book) => {
        const isAdded = !!addedBookIds[book.id];
        const genreTag = genreTagMapping[book.id] || book.genre;

        return (
          <CatalogBookCard
            key={book.id}
            book={book}
            genreTag={genreTag}
            isAdded={isAdded}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        );
      })}
    </div>
  );
};

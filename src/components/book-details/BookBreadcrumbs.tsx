import React from 'react';
import { Link } from 'react-router-dom';

interface BookBreadcrumbsProps {
  genre: string;
  bookTitle: string;
}

export const BookBreadcrumbs: React.FC<BookBreadcrumbsProps> = ({ genre, bookTitle }) => {
  return (
    <nav
      id="book-breadcrumbs"
      data-testid="book-details-breadcrumbs-nav"
      aria-label="Breadcrumb"
      className="py-space-md flex items-center space-x-2 text-on-surface-variant font-label-md text-label-md overflow-x-auto whitespace-nowrap"
    >
      <Link
        to="/"
        data-testid="book-details-breadcrumbs-link-home"
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[18px]">home</span>
        <span>Trang chủ</span>
      </Link>
      <span className="text-outline">/</span>
      <Link
        to="/catalog"
        data-testid="book-details-breadcrumbs-link-catalog"
        className="hover:text-primary transition-colors"
      >
        Danh mục sách
      </Link>
      <span className="text-outline">/</span>
      <span
        data-testid="book-details-breadcrumbs-genre"
        className="text-on-surface hover:text-primary transition-colors cursor-pointer"
      >
        {genre}
      </span>
      <span className="text-outline">/</span>
      <span
        data-testid="book-details-breadcrumbs-current-title"
        className="text-primary font-bold truncate max-w-xs md:max-w-md"
      >
        {bookTitle}
      </span>
    </nav>
  );
};

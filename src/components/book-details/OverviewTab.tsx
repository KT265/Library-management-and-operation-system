import React from 'react';
import { Book } from '../../types';

interface OverviewTabProps {
  book: Book;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ book }) => {
  return (
    <div
      id="tab-content-overview"
      data-testid="book-details-tab-content-overview"
      className="space-y-space-md"
    >
      <div>
        <h3 className="font-title-lg text-title-lg font-bold text-primary mb-space-xs">
          Giới thiệu tác phẩm &amp; Bối cảnh
        </h3>
        <p className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">
          {book.description}
        </p>
      </div>
    </div>
  );
};

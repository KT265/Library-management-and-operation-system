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

      {book.keyFeatures && book.keyFeatures.length > 0 && (
        <div className="pt-space-sm">
          <h4 className="font-title-md text-title-md font-bold text-primary mb-space-xs">
            Các chủ đề trọng tâm &amp; Điểm cốt lõi
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            {book.keyFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-space-sm rounded-2xl bg-surface-container-low/70"
              >
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span className="font-body-md text-body-md text-on-surface">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

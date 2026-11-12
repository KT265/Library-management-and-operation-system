import React from 'react';
import { Book } from '../../types';

interface SpecificationsTabProps {
  book: Book;
}

export const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ book }) => {
  const specRows = [
    {
      labelVi: 'Số trang',
      legacyKey: 'Print Length',
      val: book.specifications?.numPages
        ? `${book.specifications.numPages} trang`
        : 'Đang cập nhật',
    },
    {
      labelVi: 'Ngôn ngữ',
      legacyKey: 'Language',
      val: book.specifications?.language || 'Đang cập nhật',
    },
    {
      labelVi: 'Kích thước',
      legacyKey: 'Dimensions',
      val: book.specifications?.size || 'Đang cập nhật',
    },
    {
      labelVi: 'Trọng lượng vận chuyển',
      legacyKey: 'Shipping Weight',
      val: book.specifications?.weight || 'Đang cập nhật',
    },
    {
      labelVi: 'Ngày phát hành',
      legacyKey: 'Publication Date',
      val: book.specifications?.releaseDate || 'Đang cập nhật',
    },
    {
      labelVi: 'Nhà xuất bản',
      legacyKey: 'Publisher',
      val: book.specifications?.publisher || 'Đang cập nhật',
    },
  ];

  return (
    <div
      id="tab-content-specs"
      data-testid="book-details-tab-content-specs"
      className="space-y-space-md"
    >
      <h3 className="font-title-lg text-title-lg font-bold text-primary mb-space-sm">
        Thông số xuất bản chi tiết
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm">
        {specRows.map((item, idx) => (
          <div
            key={idx}
            className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between"
          >
            <span className="font-label-sm text-label-sm text-outline">
              {item.labelVi}
              <span className="sr-only"> ({item.legacyKey})</span>
            </span>
            <span className="font-title-sm text-title-sm font-bold text-primary mt-1">
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

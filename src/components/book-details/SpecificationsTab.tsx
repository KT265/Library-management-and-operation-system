import React from 'react';
import { Book } from '../../types';

interface SpecificationsTabProps {
  book: Book;
}

export const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ book }) => {
  const specs = book.specs;

  const specRows = [
    {
      labelVi: 'Mã ISBN-13',
      legacyKey: 'ISBN-13',
      val: specs?.isbn || '978-1449373320',
    },
    {
      labelVi: 'Mã ISBN-10',
      legacyKey: 'ISBN-10',
      val: '1449373321',
    },
    {
      labelVi: 'Số trang',
      legacyKey: 'Print Length',
      val: `${specs?.pages || 616} trang`,
    },
    {
      labelVi: 'Ngôn ngữ',
      legacyKey: 'Language',
      val: specs?.language === 'English' ? 'Tiếng Anh (Bản quyền gốc)' : 'Tiếng Việt',
    },
    {
      labelVi: 'Kích thước',
      legacyKey: 'Dimensions',
      val: specs?.dimensions || '17.8 x 3.6 x 23.4 cm',
    },
    {
      labelVi: 'Trọng lượng vận chuyển',
      legacyKey: 'Shipping Weight',
      val: specs?.weight || '950 g',
    },
    {
      labelVi: 'Ngày phát hành',
      legacyKey: 'Publication Date',
      val: specs?.publicationYear ? `Năm ${specs.publicationYear}` : '2017',
    },
    {
      labelVi: 'Nhà xuất bản',
      legacyKey: 'Publisher',
      val: specs?.publisher || book.publisher,
    },
    {
      labelVi: 'Phân loại kho',
      legacyKey: 'Inventory Classification',
      val: `${book.genre} • Mã lưu trữ BK-${book.id.toUpperCase()}`,
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

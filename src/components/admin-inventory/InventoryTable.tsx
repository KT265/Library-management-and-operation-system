import React from 'react';
import { formatVND } from '../../utils/currency';
import { InventoryBook } from './types';

interface InventoryTableProps {
  books: InventoryBook[];
  onEditBook: (book: InventoryBook) => void;
  onDeleteBook: (book: InventoryBook) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  books,
  onEditBook,
  onDeleteBook,
}) => {
  const getStockBadge = (available: number) => {
    if (available === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold bg-error-container text-on-error-container">
          Hết hàng
        </span>
      );
    }
    if (available <= 5) {
      return (
        <span className="px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold bg-tertiary-container text-on-tertiary-container">
          Sắp hết ({available} cuốn)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold bg-secondary-container text-on-secondary-container">
        Còn hàng ({available})
      </span>
    );
  };

  return (
    <div
      id="inventory-table-container"
      data-testid="admin-inventory-table-wrapper"
      className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table
          id="inventoryTable"
          data-testid="admin-inventory-table"
          className="w-full text-left border-collapse"
        >
          <thead>
            <tr className="border-b border-surface-container-high bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
              <th scope="col" id="th-book-code" className="py-3.5 px-4 font-semibold">
                Mã sách &amp; Bìa
              </th>
              <th scope="col" id="th-book-info" className="py-3.5 px-4 font-semibold min-w-[220px]">
                Tác phẩm &amp; Tác giả
              </th>
              <th scope="col" id="th-book-category" className="py-3.5 px-4 font-semibold">
                Thể loại
              </th>
              <th scope="col" id="th-book-price" className="py-3.5 px-4 font-semibold text-right">
                Giá bìa (VND)
              </th>
              <th scope="col" id="th-book-stock" className="py-3.5 px-4 font-semibold text-center">
                Tồn kho
              </th>
              <th scope="col" id="th-book-format" className="py-3.5 px-4 font-semibold text-center">
                Định dạng
              </th>
              <th scope="col" id="th-book-status" className="py-3.5 px-4 font-semibold text-center">
                Trạng thái
              </th>
              <th scope="col" id="th-book-actions" className="py-3.5 px-4 font-semibold text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody id="inventory-table-body" className="divide-y divide-surface-container text-on-surface font-body-sm text-body-sm">
            {books.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  id="inventory-empty-cell"
                  data-testid="admin-inventory-table-empty"
                  className="py-12 text-center text-secondary font-body-md"
                >
                  <span className="material-symbols-outlined text-[36px] text-outline block mb-2">
                    menu_book
                  </span>
                  Không tìm thấy đầu sách nào khớp với điều kiện tìm kiếm và bộ lọc.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  id={`inventory-row-${book.id}`}
                  data-testid={`admin-inventory-row-${book.id}`}
                  className="hover:bg-surface-container-low/60 transition-colors"
                >
                  {/* 1. Mã sách & Bìa */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.coverAlt}
                        className="w-10 h-14 rounded object-cover shadow-xs shrink-0"
                      />
                      <div>
                        <span className="font-mono text-xs text-secondary block font-bold">
                          {book.id}
                        </span>
                        <span className="font-mono text-xs text-outline block">
                          {book.isbn}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Tác phẩm & Tác giả */}
                  <td className="py-3 px-4">
                    <p className="font-title-sm text-title-sm font-semibold text-primary">
                      {book.title}
                    </p>
                    <p className="text-secondary text-xs mt-0.5">{book.author}</p>
                    {book.publisher && (
                      <span className="text-outline text-xs block">NXB: {book.publisher}</span>
                    )}
                  </td>

                  {/* 3. Thể loại */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">
                      {book.category}
                    </span>
                  </td>

                  {/* 4. Giá bìa VND */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-title-sm text-title-sm font-bold text-primary num-tabular">
                      {formatVND(book.price)}
                    </span>
                  </td>

                  {/* 5. Tồn kho */}
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-primary num-tabular">
                      {book.availableUnits}
                    </span>
                    <span className="text-outline text-xs num-tabular"> / {book.totalUnits}</span>
                  </td>

                  {/* 6. Định dạng lưu hành */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-surface-container-high text-secondary">
                      {book.formatVi || 'Bìa mềm'}
                    </span>
                  </td>

                  {/* 7. Trạng thái */}
                  <td className="py-3 px-4 text-center">
                    {getStockBadge(book.availableUnits)}
                  </td>

                  {/* 8. Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        id={`btn-edit-${book.id}`}
                        data-testid={`admin-inventory-btn-edit-${book.id}`}
                        title="Chỉnh sửa thông tin ấn phẩm"
                        onClick={() => onEditBook(book)}
                        className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        id={`btn-delete-${book.id}`}
                        data-testid={`admin-inventory-btn-delete-${book.id}`}
                        title="Xóa ấn phẩm khỏi kho"
                        onClick={() => onDeleteBook(book)}
                        className="w-8 h-8 rounded-full hover:bg-error-container/40 flex items-center justify-center text-outline hover:text-error cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

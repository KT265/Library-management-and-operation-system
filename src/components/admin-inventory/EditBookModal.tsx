import React, { useState, useEffect } from 'react';
import { InventoryBook } from './types';

interface EditBookModalProps {
  isOpen: boolean;
  book: InventoryBook | null;
  onClose: () => void;
  onSaveBook: (updated: InventoryBook) => void;
  categories: string[];
}

export const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  book,
  onClose,
  onSaveBook,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [availableUnits, setAvailableUnits] = useState('');
  const [publisher, setPublisher] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setIsbn(book.isbn);
      setPrice(String(book.price));
      setTotalUnits(String(book.totalUnits));
      setAvailableUnits(String(book.availableUnits));
      setPublisher(book.publisher || '');
      setError(null);
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề sách và tên tác giả.');
      return;
    }

    const priceNum = Math.max(0, parseInt(price.replace(/[^0-9]/g, ''), 10) || 0);
    const totalNum = parseInt(totalUnits, 10) || 1;
    const availNum = parseInt(availableUnits, 10) || 0;

    if (availNum > totalNum) {
      setError('Số lượng sẵn sàng bán không thể vượt quá tổng số lượng tồn kho.');
      return;
    }

    onSaveBook({
      ...book,
      title: title.trim(),
      author: author.trim(),
      category,
      isbn: isbn.trim(),
      price: priceNum,
      totalUnits: totalNum,
      availableUnits: availNum,
      publisher: publisher.trim(),
    });

    onClose();
  };

  return (
    <div
      id="edit-book-modal-backdrop"
      data-testid="admin-inventory-modal-edit-backdrop"
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="edit-book-modal"
        data-testid="admin-inventory-modal-edit"
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-xl w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-primary">
                Chỉnh sửa Thông tin Ấn phẩm
              </h3>
              <p className="font-body-sm text-secondary">
                Mã sách: <span className="font-mono font-semibold">{book.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-edit-modal"
            data-testid="admin-inventory-modal-edit-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div
            id="edit-book-error-banner"
            data-testid="admin-inventory-modal-edit-error"
            className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md font-body-sm text-body-sm">
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="edit-book-title" className="block text-secondary font-medium mb-1">
                Tên sách <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="edit-book-title"
                data-testid="admin-inventory-modal-edit-input-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="edit-book-author" className="block text-secondary font-medium mb-1">
                Tác giả <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="edit-book-author"
                data-testid="admin-inventory-modal-edit-input-author"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 2: Category & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="edit-book-category" className="block text-secondary font-medium mb-1">
                Thể loại
              </label>
              <select
                id="edit-book-category"
                data-testid="admin-inventory-modal-edit-select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-book-isbn" className="block text-secondary font-medium mb-1">
                Mã ISBN-13
              </label>
              <input
                type="text"
                id="edit-book-isbn"
                data-testid="admin-inventory-modal-edit-input-isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 3: Price & Stock Counts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div>
              <label htmlFor="edit-book-price" className="block text-secondary font-medium mb-1">
                Giá bìa (VND) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="edit-book-price"
                data-testid="admin-inventory-modal-edit-input-price"
                required
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
            <div>
              <label htmlFor="edit-book-total" className="block text-secondary font-medium mb-1">
                Tổng kho <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="edit-book-total"
                data-testid="admin-inventory-modal-edit-input-total"
                required
                min="1"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
            <div>
              <label htmlFor="edit-book-avail" className="block text-secondary font-medium mb-1">
                Sẵn sàng bán <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="edit-book-avail"
                data-testid="admin-inventory-modal-edit-input-avail"
                required
                min="0"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
          </div>

          {/* Action Cluster */}
          <div className="pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
            <button
              type="button"
              id="btn-cancel-edit-modal"
              data-testid="admin-inventory-modal-edit-btn-cancel"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              id="btn-save-edit-book"
              data-testid="admin-inventory-modal-edit-btn-submit"
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

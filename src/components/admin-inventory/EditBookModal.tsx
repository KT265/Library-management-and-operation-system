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
  const [authorImage, setAuthorImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isbn, setIsbn] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [publisher, setPublisher] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setAuthorImage(book.authorImage || '');

      // Initialize categories
      if (book.categories && book.categories.length > 0) {
        setSelectedCategories(book.categories);
      } else if (book.category) {
        setSelectedCategories([book.category]);
      } else {
        setSelectedCategories([categories[0] || 'Khoa học máy tính']);
      }

      setIsbn(book.isbn);
      setOriginalPrice(String(book.originalPrice || book.price));
      setPrice(String(book.price));
      setTotalUnits(String(book.totalUnits));
      setPublisher(book.publisher || '');
      setNewCategoryInput('');
      setError(null);
    }
  }, [book, categories]);

  if (!isOpen || !book) return null;

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) {
          setError('Vui lòng chọn ít nhất một thể loại cho sách.');
          return prev;
        }
        setError(null);
        return prev.filter((c) => c !== cat);
      } else {
        setError(null);
        return [...prev, cat];
      }
    });
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (!selectedCategories.includes(trimmed)) {
      setSelectedCategories((prev) => [...prev, trimmed]);
    }
    setNewCategoryInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề sách và tên tác giả.');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Vui lòng chọn ít nhất một thể loại cho ấn phẩm.');
      return;
    }

    const origPriceNum = Math.max(0, parseInt(originalPrice.replace(/[^0-9]/g, ''), 10) || 0);
    const priceNum = Math.max(0, parseInt(price.replace(/[^0-9]/g, ''), 10) || 0);
    const totalNum = parseInt(totalUnits, 10) || 1;

    onSaveBook({
      ...book,
      title: title.trim(),
      author: author.trim(),
      authorImage: authorImage.trim(),
      category: selectedCategories[0] || 'Khác',
      categories: selectedCategories,
      isbn: isbn.trim(),
      originalPrice: origPriceNum,
      price: priceNum,
      totalUnits: totalNum,
      availableUnits: totalNum,
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
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-xl w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-primary">
                Chỉnh sửa Thông tin Ấn phẩm
              </h3>
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
            className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md font-body-sm text-body-sm overflow-y-auto pr-1">
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

          {/* URL hình ảnh tác giả */}
          <div>
            <label htmlFor="edit-book-author-image" className="block text-secondary font-medium mb-1">
              URL hình ảnh tác giả
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                id="edit-book-author-image"
                data-testid="admin-inventory-modal-edit-input-author-image"
                value={authorImage}
                onChange={(e) => setAuthorImage(e.target.value)}
                placeholder="https://... URL chân dung hoặc ảnh đại diện tác giả"
                className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {authorImage && (
                <img
                  src={authorImage}
                  alt="Ảnh tác giả xem trước"
                  className="w-9 h-9 rounded-full object-cover border border-outline-variant shrink-0 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Section: Thể loại (Cho phép chọn nhiều hoặc xóa bớt) */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary font-bold font-title-sm">
                <span className="material-symbols-outlined text-[18px]">category</span>
                <span>Thể loại ấn phẩm (Chọn nhiều hoặc bỏ chọn)</span>
              </div>
              <span className="text-xs text-secondary font-semibold">
                Đã chọn: {selectedCategories.length}
              </span>
            </div>

            <div
              id="edit-category-chips-group"
              data-testid="admin-inventory-modal-edit-categories-group"
              className="flex flex-wrap gap-2 pt-1"
            >
              {/* Combine default categories and any custom already selected */}
              {Array.from(new Set([...categories, ...selectedCategories])).map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    id={`edit-cat-chip-${cat}`}
                    data-testid={`admin-inventory-modal-edit-cat-${cat}`}
                    onClick={() => handleToggleCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-xs'
                        : 'bg-surface-container-lowest text-secondary border-outline-variant/40 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_circle' : 'add'}
                    </span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                id="edit-input-custom-category"
                data-testid="admin-inventory-modal-edit-input-custom-cat"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="Thêm thể loại tùy chỉnh khác..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCategory();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                id="btn-add-edit-custom-category"
                data-testid="admin-inventory-modal-edit-btn-add-cat"
                onClick={handleAddNewCategory}
                className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold text-xs cursor-pointer transition-colors"
              >
                + Thêm
              </button>
            </div>
          </div>

          {/* Row 2: ISBN & Publisher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
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
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              />
            </div>
            <div>
              <label htmlFor="edit-book-publisher" className="block text-secondary font-medium mb-1">
                Nhà xuất bản
              </label>
              <input
                type="text"
                id="edit-book-publisher"
                data-testid="admin-inventory-modal-edit-input-publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 3: Giá gốc, Giá bán, Tổng kho */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
            <div className="flex items-center gap-2 text-primary font-bold font-title-sm pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Định giá &amp; Kho hàng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-1">
              <div>
                <label htmlFor="edit-book-original-price" className="block text-secondary font-medium mb-1">
                  Giá gốc (VND) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="edit-book-original-price"
                  data-testid="admin-inventory-modal-edit-input-original-price"
                  required
                  min="0"
                  step="1000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Giá niêm yết</span>
              </div>

              <div>
                <label htmlFor="edit-book-price" className="block text-secondary font-medium mb-1">
                  Giá bán (VND) <span className="text-error">*</span>
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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Giá bán thực tế</span>
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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Tổng số lượng trong kho</span>
              </div>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm shrink-0">
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

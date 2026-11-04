import React, { useState } from 'react';
import { InventoryBook } from './types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (newBook: Omit<InventoryBook, 'id'>) => void;
  categories: string[];
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Khoa học máy tính');
  const [isbn, setIsbn] = useState('');
  const [price, setPrice] = useState('250000');
  const [totalUnits, setTotalUnits] = useState('30');
  const [availableUnits, setAvailableUnits] = useState('30');
  const [publisher, setPublisher] = useState('NXB Trẻ');
  const [publishYear, setPublishYear] = useState('2024');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
      setError('Số lượng sẵn sàng bán không thể vượt quá tổng số lượng nhập kho.');
      return;
    }

    onAddBook({
      title: title.trim(),
      author: author.trim(),
      category,
      isbn: isbn.trim() || `978-604${Math.floor(1000000 + Math.random() * 9000000)}`,
      price: priceNum,
      totalUnits: totalNum,
      availableUnits: availNum,
      publisher: publisher.trim(),
      publishYear: parseInt(publishYear, 10) || 2024,
      description: description.trim(),
      formatVi: 'Bìa mềm',
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr',
      coverAlt: `Ảnh bìa tác phẩm ${title.trim()}`,
    });

    onClose();
  };

  return (
    <div
      id="add-book-modal-backdrop"
      data-testid="admin-inventory-modal-add-backdrop"
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="add-book-modal"
        data-testid="admin-inventory-modal-add"
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-xl w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-primary">
                Đăng ký Ấn phẩm Mới vào Kho
              </h3>
              <p className="font-body-sm text-secondary">
                Nhập thông tin xuất bản và thiết lập số lượng tồn kho ban đầu
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-add-modal"
            data-testid="admin-inventory-modal-add-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div
            id="add-book-error-banner"
            data-testid="admin-inventory-modal-add-error"
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
              <label htmlFor="input-book-title" className="block text-secondary font-medium mb-1">
                Tên sách <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="input-book-title"
                data-testid="admin-inventory-modal-add-input-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên sách..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="input-book-author" className="block text-secondary font-medium mb-1">
                Tên tác giả <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="input-book-author"
                data-testid="admin-inventory-modal-add-input-author"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nhập tác giả..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 2: Category & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="input-book-category" className="block text-secondary font-medium mb-1">
                Thể loại / Phân loại
              </label>
              <select
                id="input-book-category"
                data-testid="admin-inventory-modal-add-select-category"
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
              <label htmlFor="input-book-isbn" className="block text-secondary font-medium mb-1">
                Mã ISBN-13
              </label>
              <input
                type="text"
                id="input-book-isbn"
                data-testid="admin-inventory-modal-add-input-isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Ví dụ: 978-6042123456"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 3: Publisher & Publish Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label htmlFor="input-book-publisher" className="block text-secondary font-medium mb-1">
                Nhà xuất bản
              </label>
              <input
                type="text"
                id="input-book-publisher"
                data-testid="admin-inventory-modal-add-input-publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Ví dụ: NXB Trẻ, NXB Kim Đồng..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="input-book-year" className="block text-secondary font-medium mb-1">
                Năm xuất bản
              </label>
              <input
                type="number"
                id="input-book-year"
                data-testid="admin-inventory-modal-add-input-year"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 4: Price & Stock Counts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div>
              <label htmlFor="input-book-price" className="block text-secondary font-medium mb-1">
                Giá bìa (VND) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="input-book-price"
                data-testid="admin-inventory-modal-add-input-price"
                required
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
            <div>
              <label htmlFor="input-book-total" className="block text-secondary font-medium mb-1">
                Tổng nhập kho <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="input-book-total"
                data-testid="admin-inventory-modal-add-input-total"
                required
                min="1"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
            <div>
              <label htmlFor="input-book-avail" className="block text-secondary font-medium mb-1">
                Sẵn sàng bán <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="input-book-avail"
                data-testid="admin-inventory-modal-add-input-avail"
                required
                min="0"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label htmlFor="input-book-desc" className="block text-secondary font-medium mb-1">
              Mô tả ngắn gọn về tác phẩm
            </label>
            <textarea
              id="input-book-desc"
              data-testid="admin-inventory-modal-add-input-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung, đối tượng độc giả..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Action Cluster */}
          <div className="pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
            <button
              type="button"
              id="btn-cancel-add-modal"
              data-testid="admin-inventory-modal-add-btn-cancel"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              id="btn-submit-add-book"
              data-testid="admin-inventory-modal-add-btn-submit"
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer"
            >
              Thêm sách vào danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

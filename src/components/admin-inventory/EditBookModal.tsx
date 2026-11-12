import React, { useState, useEffect } from 'react';
import { InventoryBook } from './types';
import { doc, updateDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { useStore } from '../../store/useStore';

interface EditBookModalProps {
  isOpen: boolean;
  book: InventoryBook | null;
  onClose: () => void;
  onSaveBook: (updated: InventoryBook) => void;
  categories: string[];
}

interface CategoryOption {
  id: string;
  name: string;
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
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isbn, setIsbn] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [publisher, setPublisher] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !book) return;
    let isMounted = true;

    setTitle(book.title);
    setAuthor(book.author);
    setAuthorImage(book.authorImage || '');
    setIsbn(book.isbn);
    setOriginalPrice(String(book.originalPrice || book.price));
    setPrice(String(book.price));
    setTotalUnits(String(book.totalUnits));
    setPublisher(book.publisher || '');
    setNewCategoryInput('');
    setError(null);

    async function loadCategories() {
      try {
        const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES));
        const loaded: CategoryOption[] = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().nameCategories || d.data().name || d.id,
        }));

        const optionsPool = [...loaded];
        categories.forEach((catName, idx) => {
          if (!optionsPool.some((o) => o.name.toLowerCase() === catName.toLowerCase())) {
            optionsPool.push({ id: `cat_default_${idx}`, name: catName });
          }
        });

        // Resolve preselected categories
        const rawBookCats =
          book?.categories && book.categories.length > 0
            ? book.categories
            : book?.category
            ? [book.category]
            : [categories[0] || 'Khoa học máy tính'];

        const matchedIds: string[] = [];
        rawBookCats.forEach((bCat) => {
          const found = optionsPool.find(
            (o) => o.id === bCat || o.name.toLowerCase() === bCat.toLowerCase()
          );
          if (found) {
            matchedIds.push(found.id);
          } else {
            // Include as an option so user's category is preserved
            const customOpt = { id: bCat, name: bCat };
            optionsPool.push(customOpt);
            matchedIds.push(bCat);
          }
        });

        if (isMounted) {
          setAvailableCategories(optionsPool);
          setSelectedCategoryIds(matchedIds.length > 0 ? matchedIds : [optionsPool[0]?.id || 'cat_01']);
        }
      } catch (err) {
        console.error('[EditBookModal] Error loading categories from Firestore:', err);
        const fallbackOptions = categories.map((c, idx) => ({ id: `cat_${idx}`, name: c }));
        if (isMounted) {
          setAvailableCategories(fallbackOptions);
          setSelectedCategoryIds([fallbackOptions[0]?.id || 'cat_0']);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [isOpen, book, categories]);

  if (!isOpen || !book) return null;

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) {
          setError('Vui lòng chọn ít nhất một thể loại cho sách.');
          return prev;
        }
        setError(null);
        return prev.filter((c) => c !== catId);
      } else {
        setError(null);
        return [...prev, catId];
      }
    });
  };

  const handleAddNewCategory = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    const existing = availableCategories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.id === trimmed
    );
    if (existing) {
      if (!selectedCategoryIds.includes(existing.id)) {
        setSelectedCategoryIds((prev) => [...prev, existing.id]);
      }
      setNewCategoryInput('');
      return;
    }

    try {
      const catDocRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES), {
        nameCategories: trimmed,
      });
      const newCat: CategoryOption = {
        id: catDocRef.id,
        name: trimmed,
      };
      setAvailableCategories((prev) => [...prev, newCat]);
      setSelectedCategoryIds((prev) => [...prev, catDocRef.id]);
      setNewCategoryInput('');
    } catch (err) {
      console.error('[EditBookModal] Error creating category in Firestore:', err);
      const fallbackId = `cat_${Date.now()}`;
      const fallbackCat: CategoryOption = { id: fallbackId, name: trimmed };
      setAvailableCategories((prev) => [...prev, fallbackCat]);
      setSelectedCategoryIds((prev) => [...prev, fallbackId]);
      setNewCategoryInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề sách và tên tác giả.');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setError('Vui lòng chọn ít nhất một thể loại cho ấn phẩm.');
      return;
    }

    const origPriceNum = Math.max(0, parseInt(originalPrice.replace(/[^0-9]/g, ''), 10) || 0);
    const priceNum = Math.max(0, parseInt(price.replace(/[^0-9]/g, ''), 10) || 0);
    const totalNum = parseInt(totalUnits, 10) || 1;
    const effectiveOrigPrice = origPriceNum || Math.round(priceNum * 1.2);

    try {
      setIsSubmitting(true);

      // 1. Author synchronization with Authors collection
      let finalAuthorId = book.idAuthor?.trim() || '';

      if (finalAuthorId) {
        try {
          const authorDocRef = doc(db, FIRESTORE_COLLECTIONS.AUTHORS, finalAuthorId);
          const authorSnap = await getDoc(authorDocRef);
          if (authorSnap.exists()) {
            await updateDoc(authorDocRef, {
              nameAuthor: author.trim(),
              imgAuthor: authorImage.trim(),
            });
          } else {
            // Author document was referenced by ID but missing from collection
            const newAuthorRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.AUTHORS), {
              nameAuthor: author.trim(),
              imgAuthor: authorImage.trim(),
              introduction: book.authorBio || '',
            });
            finalAuthorId = newAuthorRef.id;
          }
        } catch (authorErr) {
          console.warn('[EditBookModal] Author sync warning:', authorErr);
        }
      } else {
        // Book had no idAuthor reference, create author document
        try {
          const newAuthorRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.AUTHORS), {
            nameAuthor: author.trim(),
            imgAuthor: authorImage.trim(),
            introduction: book.authorBio || '',
          });
          finalAuthorId = newAuthorRef.id;
        } catch (authorErr) {
          console.warn('[EditBookModal] Author creation warning:', authorErr);
          finalAuthorId = author.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'author-gen';
        }
      }

      // 2. Update Book Document in Books collection
      const updatePayload = {
        ISBN13: isbn.trim(),
        ISBN12: isbn.trim(),
        title: title.trim(),
        nameAuthor: author.trim(),
        idAuthor: finalAuthorId,
        categories: selectedCategoryIds,
        originalPrice: effectiveOrigPrice,
        saleprice: priceNum,
        salePrice: priceNum,
        stockQuantity: totalNum,
        specifications: {
          numPages: book.pages || 0,
          language: book.language || 'Tiếng Việt',
          size: typeof book.dimensions === 'string' ? book.dimensions : '16 x 24 x 2.5 cm',
          weight: '350 g',
          releaseDate: `${book.publishYear || 2024}-01-01`,
          publisher: publisher.trim() || book.publisher || 'NXB Trẻ',
        },
      };

      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.BOOKS, book.id), updatePayload);

      const selectedCategoryNames = availableCategories
        .filter((c) => selectedCategoryIds.includes(c.id))
        .map((c) => c.name);

      const updatedBook: InventoryBook = {
        ...book,
        idAuthor: finalAuthorId,
        title: title.trim(),
        author: author.trim(),
        authorImage: authorImage.trim(),
        category: selectedCategoryNames[0] || 'Văn học',
        categories: selectedCategoryIds,
        isbn: isbn.trim(),
        originalPrice: effectiveOrigPrice,
        price: priceNum,
        totalUnits: totalNum,
        availableUnits: totalNum,
        publisher: publisher.trim(),
      };

      useStore.getState().showToast(`Đã cập nhật thông tin ấn phẩm “${title.trim()}”.`);
      onSaveBook(updatedBook);
      onClose();
    } catch (err: any) {
      console.error('[EditBookModal] Error updating book in Firestore:', err);
      setError('Lỗi khi cập nhật ấn phẩm lên cơ sở dữ liệu. Vui lòng thử lại.');
      useStore.getState().showToast('Lỗi khi cập nhật ấn phẩm.');
    } finally {
      setIsSubmitting(false);
    }
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
                Đã chọn: {selectedCategoryIds.length}
              </span>
            </div>

            <div
              id="edit-category-chips-group"
              data-testid="admin-inventory-modal-edit-categories-group"
              className="flex flex-wrap gap-2 pt-1"
            >
              {availableCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`edit-cat-chip-${cat.name}`}
                    data-testid={`admin-inventory-modal-edit-cat-${cat.name}`}
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-xs'
                        : 'bg-surface-container-lowest text-secondary border-outline-variant/40 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_circle' : 'add'}
                    </span>
                    <span>{cat.name}</span>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              )}
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

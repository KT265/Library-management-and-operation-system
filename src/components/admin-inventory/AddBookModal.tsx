import React, { useState, useEffect } from 'react';
import { InventoryBook } from './types';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { useStore } from '../../store/useStore';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (newBook: InventoryBook) => void;
  categories: string[];
}

interface CategoryOption {
  id: string;
  name: string;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  categories,
}) => {
  // 1. Basic Info & Author
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorImage, setAuthorImage] = useState('');

  // 2. Multi-select Categories
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // 3. Publishing & Book Specifications
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('NXB Trẻ');
  const [publishYear, setPublishYear] = useState('2024');
  const [pages, setPages] = useState('320');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [width, setWidth] = useState('16.0');
  const [length, setLength] = useState('24.0');
  const [height, setHeight] = useState('2.5');

  // 4. Pricing & Inventory (Available units removed, auto-equals totalUnits)
  const [originalPrice, setOriginalPrice] = useState('280000');
  const [price, setPrice] = useState('250000');
  const [totalUnits, setTotalUnits] = useState('30');

  // 5. Description
  const [description, setDescription] = useState('');

  // 6. Image URLs
  const [coverImage, setCoverImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr'
  );
  const [additionalImage1, setAdditionalImage1] = useState('');
  const [additionalImage2, setAdditionalImage2] = useState('');
  const [additionalImage3, setAdditionalImage3] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadCategories() {
      try {
        const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES));
        const loaded: CategoryOption[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.nameCategories || data.name || d.id,
          };
        });

        const initialOptions: CategoryOption[] =
          loaded.length > 0
            ? loaded
            : categories.map((c, i) => ({ id: `cat_0${i + 1}`, name: c }));

        if (isMounted) {
          setAvailableCategories(initialOptions);
          setSelectedCategoryIds((prev) =>
            prev.length > 0 ? prev : (initialOptions.length > 0 ? [initialOptions[0].id] : [])
          );
        }
      } catch (err) {
        console.error('[AddBookModal] Error fetching categories:', err);
        const fallbackOptions: CategoryOption[] = categories.map((c, i) => ({
          id: `cat_0${i + 1}`,
          name: c,
        }));
        if (isMounted) {
          setAvailableCategories(fallbackOptions);
          setSelectedCategoryIds((prev) =>
            prev.length > 0 ? prev : (fallbackOptions.length > 0 ? [fallbackOptions[0].id] : [])
          );
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleAddCustomCategory = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    const existing = availableCategories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
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
      console.error('[AddBookModal] Error creating category in Firestore:', err);
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
      setError('Vui lòng chọn ít nhất 1 thể loại cho cuốn sách.');
      return;
    }

    const originalPriceNum = Math.max(0, parseInt(originalPrice.replace(/[^0-9]/g, ''), 10) || 0);
    const priceNum = Math.max(0, parseInt(price.replace(/[^0-9]/g, ''), 10) || 0);
    const totalNum = Math.max(1, parseInt(totalUnits, 10) || 1);
    const pagesNum = Math.max(1, parseInt(pages, 10) || 1);
    const widthNum = parseFloat(width) || 0;
    const lengthNum = parseFloat(length) || 0;
    const heightNum = parseFloat(height) || 0;

    const dimensionsString = `${widthNum} x ${lengthNum} x ${heightNum} cm`;
    const additionalImagesList = [additionalImage1, additionalImage2, additionalImage3]
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const cleanIsbn = isbn.trim() || `978-604${Math.floor(1000000 + Math.random() * 9000000)}`;
    const effectiveOrigPrice = originalPriceNum || Math.round(priceNum * 1.2);

    try {
      setIsSubmitting(true);

      // 1. Create Author document in "Authors" collection
      const authorDocData = {
        nameAuthor: author.trim(),
        introduction: authorBio.trim(),
        imgAuthor: authorImage.trim(),
      };
      const authorDocRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.AUTHORS), authorDocData);
      const generatedAuthorId = authorDocRef.id;

      // 2. Prepare 15-field book document
      const firestoreBookData = {
        ISBN13: cleanIsbn,
        ISBN12: cleanIsbn,
        title: title.trim(),
        description: description.trim(),
        originalPrice: effectiveOrigPrice,
        saleprice: priceNum,
        salePrice: priceNum,
        idAuthor: generatedAuthorId,
        nameAuthor: author.trim(),
        categories: selectedCategoryIds,
        imgCoverPage: coverImage.trim(),
        imgs: additionalImagesList,
        stockQuantity: totalNum,
        soldCount: 0,
        specifications: {
          numPages: pagesNum,
          language: language.trim() || 'Tiếng Việt',
          size: dimensionsString,
          weight: '350 g',
          releaseDate: `${publishYear.trim() || '2024'}-01-01`,
          publisher: publisher.trim() || 'NXB Trẻ',
        },
      };

      // 3. Create Book document in "Books" collection
      const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.BOOKS), firestoreBookData);

      const selectedCategoryNames = availableCategories
        .filter((c) => selectedCategoryIds.includes(c.id))
        .map((c) => c.name);

      const createdBook: InventoryBook = {
        id: docRef.id,
        idAuthor: generatedAuthorId,
        title: title.trim(),
        author: author.trim(),
        authorBio: authorBio.trim(),
        authorImage: authorImage.trim(),
        category: selectedCategoryNames.length > 0 ? selectedCategoryNames.join(', ') : 'Văn học',
        categories: selectedCategoryIds,
        isbn: cleanIsbn,
        price: priceNum,
        originalPrice: effectiveOrigPrice,
        totalUnits: totalNum,
        availableUnits: totalNum,
        publisher: publisher.trim(),
        publishYear: parseInt(publishYear, 10) || 2024,
        pages: pagesNum,
        language: language.trim() || 'Tiếng Việt',
        dimensions: dimensionsString,
        description: description.trim(),
        formatVi: 'Ấn bản tiêu chuẩn',
        coverImage: coverImage.trim(),
        coverAlt: `Ảnh bìa tác phẩm ${title.trim()}`,
        additionalImages: additionalImagesList,
      };

      useStore.getState().showToast(`Đã thêm thành công ấn phẩm “${title.trim()}” vào kho sách.`);
      onAddBook(createdBook);
      onClose();
    } catch (err: any) {
      console.error('[AddBookModal] Error inserting book to Firestore:', err);
      setError('Lỗi khi lưu ấn phẩm lên cơ sở dữ liệu. Vui lòng thử lại.');
      useStore.getState().showToast('Lỗi khi lưu ấn phẩm lên cơ sở dữ liệu.');
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-2xl w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-primary">
                Đăng ký Ấn phẩm Mới vào Kho
              </h3>
              <p className="font-body-sm text-secondary">
                Nhập đầy đủ thông tin sách, thông số xuất bản, tác giả và hình ảnh
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-add-modal"
            data-testid="admin-inventory-modal-add-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div
            id="add-book-error-banner"
            data-testid="admin-inventory-modal-add-error"
            className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="space-y-space-lg font-body-sm text-body-sm overflow-y-auto pr-2"
        >
          {/* Section 1: Thông tin cơ bản & Tác giả */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center gap-2 text-primary font-bold font-title-sm pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>1. Thông tin Sách &amp; Tác giả</span>
            </div>

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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
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
                  placeholder="Ví dụ: Martin Kleppmann, Haruki Murakami..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Mô tả ngắn gọn tác giả */}
            <div>
              <label htmlFor="input-book-author-bio" className="block text-secondary font-medium mb-1">
                Mô tả ngắn gọn về tác giả
              </label>
              <textarea
                id="input-book-author-bio"
                data-testid="admin-inventory-modal-add-input-author-bio"
                rows={2}
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Ví dụ: Giáo sư Khoa học máy tính tại Đại học Cambridge, nhà nghiên cứu phân tán..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* URL hình ảnh tác giả */}
            <div>
              <label htmlFor="input-book-author-image" className="block text-secondary font-medium mb-1">
                URL hình ảnh tác giả
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  id="input-book-author-image"
                  data-testid="admin-inventory-modal-add-input-author-image"
                  value={authorImage}
                  onChange={(e) => setAuthorImage(e.target.value)}
                  placeholder="https://... URL hình ảnh chân dung tác giả"
                  className="flex-1 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
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
          </div>

          {/* Section 2: Thể loại (Cho phép chọn nhiều thể loại) */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary font-bold font-title-sm">
                <span className="material-symbols-outlined text-[18px]">category</span>
                <span>2. Thể loại ấn phẩm (Cho phép chọn nhiều)</span>
              </div>
              <span className="text-xs text-secondary font-semibold">
                Đã chọn: {selectedCategoryIds.length}
              </span>
            </div>

            <p className="text-xs text-outline">
              Bấm chọn một hoặc nhiều thể loại phù hợp với nội dung ấn phẩm:
            </p>

            <div
              id="category-chips-group"
              data-testid="admin-inventory-modal-add-categories-group"
              className="flex flex-wrap gap-2 pt-1"
            >
              {availableCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`cat-chip-${cat.name}`}
                    data-testid={`admin-inventory-modal-add-cat-${cat.name}`}
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
                id="input-custom-category"
                data-testid="admin-inventory-modal-add-input-custom-cat"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomCategory();
                  }
                }}
                placeholder="Thêm thể loại tùy chỉnh..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                id="btn-add-custom-cat"
                data-testid="admin-inventory-modal-add-btn-add-custom-cat"
                onClick={handleAddCustomCategory}
                className="px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-semibold hover:bg-secondary-fixed transition-colors cursor-pointer shrink-0"
              >
                + Thêm
              </button>
            </div>
          </div>

          {/* Section 3: Thông số sách chi tiết */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center gap-2 text-primary font-bold font-title-sm pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px]">import_contacts</span>
              <span>3. Thông số Sách &amp; Xuất bản</span>
            </div>

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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
              </div>

              <div>
                <label htmlFor="input-book-pages" className="block text-secondary font-medium mb-1">
                  Số trang sách
                </label>
                <input
                  type="number"
                  id="input-book-pages"
                  data-testid="admin-inventory-modal-add-input-pages"
                  min="1"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="Ví dụ: 320"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
              </div>

              <div>
                <label htmlFor="input-book-language" className="block text-secondary font-medium mb-1">
                  Ngôn ngữ
                </label>
                <input
                  type="text"
                  id="input-book-language"
                  data-testid="admin-inventory-modal-add-input-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Ví dụ: Tiếng Việt, Tiếng Anh..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Kích cỡ sách: Width, Length, Height */}
            <div>
              <label className="block text-secondary font-medium mb-1">
                Kích cỡ sách (Rộng x Dài x Cao/Dày - đơn vị cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      id="input-book-width"
                      data-testid="admin-inventory-modal-add-input-width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Rộng"
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary num-tabular"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[11px] pointer-events-none">
                      cm
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block text-center mt-0.5">Chiều rộng (W)</span>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      id="input-book-length"
                      data-testid="admin-inventory-modal-add-input-length"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="Dài"
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary num-tabular"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[11px] pointer-events-none">
                      cm
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block text-center mt-0.5">Chiều dài (L)</span>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      id="input-book-height"
                      data-testid="admin-inventory-modal-add-input-height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Cao/Dày"
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary num-tabular"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[11px] pointer-events-none">
                      cm
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block text-center mt-0.5">Độ dày / Cao (H)</span>
                </div>
              </div>
            </div>

            {/* Mã ISBN */}
            <div>
              <label htmlFor="input-book-isbn" className="block text-secondary font-medium mb-1">
                Mã định danh ISBN-13
              </label>
              <input
                type="text"
                id="input-book-isbn"
                data-testid="admin-inventory-modal-add-input-isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Ví dụ: 978-6042123456 (để trống sẽ tạo tự động)"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Section 4: Định giá & Nhập kho */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center gap-2 text-primary font-bold font-title-sm pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>4. Định giá &amp; Nhập kho</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div>
                <label htmlFor="input-book-original-price" className="block text-secondary font-medium mb-1">
                  Giá gốc (VND) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="input-book-original-price"
                  data-testid="admin-inventory-modal-add-input-original-price"
                  required
                  min="0"
                  step="1000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Ví dụ: 280000"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Giá niêm yết ban đầu</span>
              </div>

              <div>
                <label htmlFor="input-book-price" className="block text-secondary font-medium mb-1">
                  Giá bán (VND) <span className="text-error">*</span>
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
                  placeholder="Ví dụ: 250000"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Giá bán thực tế cho độc giả</span>
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
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary num-tabular"
                />
                <span className="text-[11px] text-outline mt-0.5 block">Số lượng nhập kho sẵn sàng bán</span>
              </div>
            </div>
          </div>

          {/* Section 5: Thêm ảnh sách (Trang bìa & 3 ảnh khác) */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center gap-2 text-primary font-bold font-title-sm pb-1 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <span>5. Hình ảnh Ấn phẩm (Định dạng URL)</span>
            </div>

            {/* Ảnh bìa chính */}
            <div>
              <label htmlFor="input-book-cover" className="block text-secondary font-medium mb-1">
                URL ảnh trang bìa sách <span className="text-error">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  id="input-book-cover"
                  data-testid="admin-inventory-modal-add-input-cover"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... URL hình ảnh bìa chính"
                  className="flex-1 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Bìa xem trước"
                    className="w-9 h-12 rounded object-cover border border-outline-variant shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* 3 Form URL cho các ảnh khác */}
            <div className="space-y-space-xs pt-1 border-t border-outline-variant/20">
              <span className="text-xs font-semibold text-secondary block mb-1">
                Các ảnh khác của sách (Tùy chọn bổ sung):
              </span>

              <div>
                <label htmlFor="input-book-img-1" className="block text-[11px] text-outline mb-0.5">
                  Ảnh phụ 1 (Mục lục / Bìa sau / Trang sách)
                </label>
                <input
                  type="url"
                  id="input-book-img-1"
                  data-testid="admin-inventory-modal-add-input-img-1"
                  value={additionalImage1}
                  onChange={(e) => setAdditionalImage1(e.target.value)}
                  placeholder="https://... URL ảnh phụ 1"
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="input-book-img-2" className="block text-[11px] text-outline mb-0.5">
                  Ảnh phụ 2 (Sơ đồ / Trích đoạn nổi bật)
                </label>
                <input
                  type="url"
                  id="input-book-img-2"
                  data-testid="admin-inventory-modal-add-input-img-2"
                  value={additionalImage2}
                  onChange={(e) => setAdditionalImage2(e.target.value)}
                  placeholder="https://... URL ảnh phụ 2"
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="input-book-img-3" className="block text-[11px] text-outline mb-0.5">
                  Ảnh phụ 3 (Gáy sách / Chi tiết ấn bản)
                </label>
                <input
                  type="url"
                  id="input-book-img-3"
                  data-testid="admin-inventory-modal-add-input-img-3"
                  value={additionalImage3}
                  onChange={(e) => setAdditionalImage3(e.target.value)}
                  placeholder="https://... URL ảnh phụ 3"
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Giới thiệu & Mô tả nội dung */}
          <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
            <label htmlFor="input-book-desc" className="block text-primary font-bold font-title-sm">
              6. Giới thiệu &amp; Mô tả Tác phẩm
            </label>
            <textarea
              id="input-book-desc"
              data-testid="admin-inventory-modal-add-input-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung tác phẩm, giá trị học thuật, bối cảnh xuất bản..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm shrink-0">
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              )}
              <span>{isSubmitting ? 'Đang lưu vào kho...' : 'Thêm sách vào kho'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


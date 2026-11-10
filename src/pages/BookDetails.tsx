import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Book } from '../types';
import { fetchBookByIdFromFirestore } from '../services/firebase';
import { BookBreadcrumbs } from '../components/book-details/BookBreadcrumbs';
import { CoverGallery, GalleryThumbnail } from '../components/book-details/CoverGallery';
import { BookHeroInfo } from '../components/book-details/BookHeroInfo';
import { PurchaseActionCluster } from '../components/book-details/PurchaseActionCluster';
import { TrustBadgesBar } from '../components/book-details/TrustBadgesBar';
import { BookTabsSection, BookTabId } from '../components/book-details/BookTabsSection';
import { RelatedBooksCarousel } from '../components/book-details/RelatedBooksCarousel';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<BookTabId>('tab-overview');
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    if (!id) {
      setError('Mã ấn phẩm không hợp lệ.');
      setIsLoading(false);
      return;
    }

    fetchBookByIdFromFirestore(id)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Không tìm thấy thông tin ấn phẩm trong thư viện.');
        } else {
          setBook(data);
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error('[BookDetails] Error fetching book by id:', err);
        setError(err?.message || 'Có lỗi xảy ra khi tải thông tin ấn phẩm.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const unitPrice = book?.price || 0;
  const originalPrice = book?.originalPrice || Math.round(unitPrice * 1.25);
  const stockCeiling = book?.stockCount || 10;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < stockCeiling) {
      setQuantity((q) => q + 1);
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    setIsAdding(true);
    const itemToAdd: Book = {
      ...book,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1400);
  };

  const handleBuyNow = () => {
    if (!book) return;
    const itemToAdd: Book = {
      ...book,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);
    navigate('/checkout');
  };

  const thumbnails: GalleryThumbnail[] = useMemo(() => {
    if (!book) return [];
    const list: GalleryThumbnail[] = [
      {
        id: 'thumb-primary',
        label: 'Front Cover Original',
        labelVi: 'Bìa trước nguyên bản',
        url: book.coverImage,
        alt: `Bìa trước của sách ${book.title}`,
      },
    ];
    return list;
  }, [book]);

  const currentCover =
    thumbnails[activeThumbIndex]?.url || book?.coverImage || '';

  if (isLoading) {
    return (
      <div
        id="book-details-loading-state"
        data-testid="book-details-loading-spinner"
        className="min-h-[70vh] flex flex-col items-center justify-center w-full"
      >
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-secondary font-medium text-body-lg">Đang tải thông tin ấn phẩm...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div
        id="book-details-error-state"
        data-testid="book-details-error-state"
        className="min-h-[60vh] flex flex-col items-center justify-center w-full px-4 text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">menu_book</span>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Không tìm thấy sách</h2>
        <p className="text-secondary mb-6">{error || 'Ấn phẩm không tồn tại hoặc đã ngừng phát hành.'}</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
        >
          Quay lại danh mục sách
        </button>
      </div>
    );
  }

  return (
    <div
      id="book-details-page-root"
      data-testid="book-details-page-coordinator"
      className="flex flex-col w-full bg-surface text-primary font-body-md"
    >
      <div className="relative w-full max-w-7xl mx-auto px-gutter-sm md:px-gutter-lg pb-space-xxl">
        {/* 1. Breadcrumbs */}
        <BookBreadcrumbs
          genre={book.genre}
          bookTitle={book.title}
        />

        {/* 2. Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start pt-space-sm">
          {/* Left Column: Gallery Stage & Thumbnails */}
          <div className="lg:col-span-5">
            <CoverGallery
              currentCover={currentCover}
              bookTitle={book.title}
              pages={book.specs?.pages || 300}
              isZoomed={isZoomed}
              onToggleZoom={() => setIsZoomed(!isZoomed)}
              thumbnails={thumbnails}
              activeThumbIndex={activeThumbIndex}
              onSelectThumb={setActiveThumbIndex}
            />
          </div>

          {/* Right Column: Book Hero Info & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <BookHeroInfo book={book} />

            <PurchaseActionCluster
              unitPrice={unitPrice}
              originalPrice={originalPrice}
              quantity={quantity}
              stockCeiling={stockCeiling}
              isAdding={isAdding}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <TrustBadgesBar />
          </div>
        </div>

        {/* 3. Editorial Tabs Section */}
        <BookTabsSection
          book={book}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 4. Recommendations Carousel */}
        <RelatedBooksCarousel currentBookId={book.id} />
      </div>
    </div>
  );
};

export default BookDetails;

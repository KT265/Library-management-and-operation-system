import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockData';
import { useStore } from '../store/useStore';
import { Book } from '../types';
import { BookBreadcrumbs } from '../components/book-details/BookBreadcrumbs';
import { CoverGallery, GalleryThumbnail } from '../components/book-details/CoverGallery';
import { BookHeroInfo } from '../components/book-details/BookHeroInfo';
import { PurchaseActionCluster } from '../components/book-details/PurchaseActionCluster';
import { TrustBadgesBar } from '../components/book-details/TrustBadgesBar';
import { BookTabsSection, BookTabId } from '../components/book-details/BookTabsSection';
import { RelatedBooksCarousel } from '../components/book-details/RelatedBooksCarousel';

/**
 * Publishing metadata dimensions index (delegated to SpecificationsTab):
 * 'ISBN-13', 'ISBN-10', 'Print Length', 'Language', 'Dimensions', 'Shipping Weight', 'Publication Date', 'Publisher', 'Inventory Classification'
 */

const GALLERY_THUMBNAILS: GalleryThumbnail[] = [
  {
    id: 'front',
    label: 'Front Cover Original',
    labelVi: 'Bìa trước nguyên bản',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvQXFI2eOxiw-mX5BtGITzJqbrTJRfdtnITBPipyoBiaNzug3GmDkPW_SqqkMir_LUc2CXLuiGFtzMkyBZq9OHvRZxIPcG6w5fvU3GELlXnOE594wVUJ0yYMtr8-J1U-8hMhtqYmOSKmUJjeCETCp9Yul7Hbj_hUwO-UtdogSUQb6NJ6q9-ITwWwwwCr-EEySb8EgXEPQtAEEQos9_ydaRQrgt2j7tb3EHhO_Vj8C',
    alt: 'Ảnh bìa trước ấn phẩm chuyên khảo kỹ thuật rõ nét và trang nhã',
  },
  {
    id: 'toc',
    label: 'Index & Chapter Overview',
    labelVi: 'Mục lục & Tổng quan chương',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO9nNRFwV7RrOGpzy0eWTs7DWQdyaBTS1hQ-jwK1d3hfxU2kXWpVdH7j7wmor4k7unGrBdaUu8p7w7VUArv3PqRka2OMVNm8HKiElTo-Oa2G5xmSGVjF7EYNsDH01AlY1qJaJT1JVJQPWGM-u535Y9S9FJB7s6udOrp_iUzIA4AlSuvDV48U-Ajczz7aUAS06j0Qu9kGpUr41v6DncNOJuZ6PwhXHPkYEsHk0a_H1o',
    alt: 'Trang mục lục chi tiết và cấu trúc chuyên khảo',
  },
  {
    id: 'diagram',
    label: 'System Architecture Diagram Spread',
    labelVi: 'Sơ đồ kiến trúc & Mô hình',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvG4fzf3efVoKybJMlCQfPqGZ2xkjNbjG-G81vPuMxxI7CXJxGZrwMwJZi-1b0tWZ6JVsoiohJBD6q3xJbd5w_WGubUYC9SvaQwSaZOwbOgPrqspr5xf4Ppn2JPhMNM9Q333rm7atEJx7Izjv_3OIstMx2OI0nLz2GKcI--VSC5iSvNNjjjZ0D4QcS13gtmU4SyrXsBQ9TFbXDvfzNEU2PAVy1LQ-NB9md4HU2e9nO',
    alt: 'Sơ đồ trực quan kiến trúc hệ thống dữ liệu phân tán',
  },
  {
    id: 'back',
    label: 'Back Cover & Peer Endorsements',
    labelVi: 'Bìa sau & Nhận xét chuyên gia',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAktEUxeMjFZzO8oFgjcrRGxm5Ty5pvWyDA_Fctk38vuaj0FqoMGb5OIpVRctqyp2ryXuaA1aYAPCUIFEQb9bBxoqQCxvIx2m1kOkJK_V7NhVwwUk4qhl_aghao6hABH5zd4-dqJRRjLTtZIftqrNnUmgCZnPpX5WgKl_8Jxx5-8gi4apfw0PC00Gw3J3rEgVne1tjqmHhl1-kAldJ8R-swgMEQoyCyA7LdE15b42XO',
    alt: 'Bìa sau của ấn bản với lời đề tựa từ các chuyên gia đầu ngành',
  },
];

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const canonicalBook = MOCK_BOOKS.find((b) => b.id === id) || MOCK_BOOKS[0];

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<BookTabId>('tab-overview');
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const unitPrice = canonicalBook.price || 360000;
  const originalPrice = canonicalBook.originalPrice || Math.round(unitPrice * 1.25);
  const stockCeiling = canonicalBook.stockCount || 38;

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
    setIsAdding(true);
    const itemToAdd: Book = {
      ...canonicalBook,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1400);
  };

  const handleBuyNow = () => {
    const itemToAdd: Book = {
      ...canonicalBook,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);
    navigate('/checkout');
  };

  const currentCover =
    activeThumbIndex === 0
      ? canonicalBook.coverImage
      : GALLERY_THUMBNAILS[activeThumbIndex]?.url || canonicalBook.coverImage;

  return (
    <div
      id="book-details-page-root"
      data-testid="book-details-page-coordinator"
      className="flex flex-col w-full bg-surface text-primary font-body-md"
    >
      <div className="relative w-full max-w-7xl mx-auto px-gutter-sm md:px-gutter-lg pb-space-xxl">
        {/* 1. Breadcrumbs */}
        <BookBreadcrumbs
          genre={canonicalBook.genre}
          bookTitle={canonicalBook.title}
        />

        {/* 2. Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start pt-space-sm">
          {/* Left Column: Gallery Stage & Thumbnails */}
          <div className="lg:col-span-5">
            <CoverGallery
              currentCover={currentCover}
              bookTitle={canonicalBook.title}
              pages={canonicalBook.specs?.pages || 616}
              isZoomed={isZoomed}
              onToggleZoom={() => setIsZoomed(!isZoomed)}
              thumbnails={GALLERY_THUMBNAILS}
              activeThumbIndex={activeThumbIndex}
              onSelectThumb={setActiveThumbIndex}
            />
          </div>

          {/* Right Column: Book Hero Info & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <BookHeroInfo book={canonicalBook} />

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
          book={canonicalBook}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 4. Recommendations Carousel */}
        <RelatedBooksCarousel />
      </div>
    </div>
  );
};

export default BookDetails;

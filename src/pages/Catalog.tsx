import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockData';
import { Book } from '../types';
import { useStore } from '../store/useStore';
import { CatalogBreadcrumbs } from '../components/catalog/CatalogBreadcrumbs';
import { CatalogSearchSortBar, CatalogSortOption } from '../components/catalog/CatalogSearchSortBar';
import { CategoryChipsBar } from '../components/catalog/CategoryChipsBar';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer';
import { CatalogBookGrid } from '../components/catalog/CatalogBookGrid';
import { CatalogEmptyState } from '../components/catalog/CatalogEmptyState';
import { CatalogPagination } from '../components/catalog/CatalogPagination';
import { EditorialShowcaseBanner } from '../components/catalog/EditorialShowcaseBanner';

// DevTools Traceability: FilterSidebar renders id="clearSearchBtn" with cancel icon

const CATALOG_BOOKS: Book[] = (() => {
  const hasDesignSystems = MOCK_BOOKS.some((b) => b.title.includes('Design Systems'));
  if (hasDesignSystems) return MOCK_BOOKS;
  const designSystemsBook: Book = {
    id: 'book-13',
    title: 'Design Systems: Principles',
    subtitle: 'Cẩm nang thực hành xây dựng ngôn ngữ thiết kế cho sản phẩm số',
    author: 'Alla Kholmatova',
    authorBio: 'Alla Kholmatova là nhà thiết kế UX chuyên sâu về các hệ thống thiết kế theo thành phần.',
    publisher: 'Smashing Media',
    price: 285000,
    originalPrice: 360000,
    rating: 4.9,
    reviewCount: 340,
    inStock: true,
    stockCount: 8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWsVl9tJ4A0uh4f9SX7mrqJL4-1UcG2D4fSR0m8vPPT-hQrGvH-6KCWwWtlQwhwmPKcCOdv3kf6zeXI58S4kDXbHT2Y_TE5-avM0DKbUl3gyQaOgZODnUCX1jZVbw0ju2mknqvKAa3kPliMv4uLxkU_wNplv3zVsFkp2DTAtdGcABrCE_n9d6nraOzvUjv0PoCw-gH_10W8VUkACtvn9YFwEBPIlC_eySkC6Ta2vg',
    genre: 'Graphic Novels',
    format: 'Standard',
    description:
      'Design Systems là cuốn cẩm nang toàn diện khám phá các nguyên tắc nền tảng và mô hình thiết kế giao diện có khả năng mở rộng cao.',
    featured: true,
    isBestseller: false,
    specs: {
      isbn: '978-3945749586',
      format: 'Standard',
      pages: 288,
      language: 'English',
      publisher: 'Smashing Media',
      dimensions: '16.5 x 2.0 x 22.8 cm',
      weight: '550 g',
      publicationYear: 2017,
    },
  };
  return [...MOCK_BOOKS, designSystemsBook];
})();

const CATEGORY_MAPPINGS: Record<string, string[]> = {
  'Computer Science': ['Distributed Systems', 'Computer Science', 'Tech & Coding'],
  'Psychology & Habits': ['Self-Growth', 'History & Mind'],
  'Literary Fiction': ['Literary Fiction'],
  'Sci-Fi & Speculative': ['Sci-Fi & Fantasy'],
  'Business & Strategy': ['Tech & Coding', 'Business'],
  'Design & Visual Arts': ['Graphic Novels', 'Design & UI'],
};

const CHIP_CATEGORIES = [
  { id: 'cs', labelVi: 'Khoa học máy tính', englishName: 'Computer Science' },
  { id: 'psych', labelVi: 'Tâm lý & Thói quen', englishName: 'Psychology & Habits' },
  { id: 'fiction', labelVi: 'Văn học tinh hoa', englishName: 'Literary Fiction' },
  { id: 'scifi', labelVi: 'Khoa học viễn tưởng', englishName: 'Sci-Fi & Speculative' },
  { id: 'biz', labelVi: 'Kinh doanh & Chiến lược', englishName: 'Business & Strategy' },
  { id: 'design', labelVi: 'Thiết kế & Nghệ thuật', englishName: 'Design & Visual Arts' },
];

const GENRE_TAG_MAPPING: Record<string, string> = {
  'book-1': 'Distributed Systems',
  'book-2': 'Literary Fiction',
  'book-3': 'Behavioral Science',
  'book-4': 'Software Mastery',
  'book-5': 'Engineering',
  'book-6': 'Hard Sci-Fi',
  'book-7': 'Cognitive Science',
  'book-13': 'Design & UI',
};

export const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, addToCart } = useStore();

  // State
  const [filterQuery, setFilterQuery] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pricePreset, setPricePreset] = useState<'0-20' | '20-50' | '50+' | null>('50+');
  const [selectedRating, setSelectedRating] = useState<number | null>(4.0);
  const [sortBy, setSortBy] = useState<CatalogSortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedBookIds, setAddedBookIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFilterQuery(searchQuery);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setFilterQuery('');
    setSearchQuery('');
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceChipClick = (chip: '0-20' | '20-50' | '50+') => {
    setPricePreset((prev) => (prev === chip ? null : chip));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterQuery('');
    setSearchQuery('');
    setSelectedCategories([]);
    setPricePreset(null);
    setSelectedRating(null);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleAddToCart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart(book, 1);
    setAddedBookIds((prev) => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedBookIds((prev) => ({ ...prev, [book.id]: false }));
    }, 1400);
  };

  const handleBuyNow = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart(book, 1);
    navigate('/checkout');
  };

  const filteredBooks = useMemo(() => {
    return CATALOG_BOOKS.filter((book) => {
      const activeSearch = filterQuery.trim().toLowerCase();
      if (activeSearch) {
        const matchesTitle = book.title.toLowerCase().includes(activeSearch);
        const matchesAuthor = book.author.toLowerCase().includes(activeSearch);
        const matchesGenre = book.genre.toLowerCase().includes(activeSearch);
        const matchesDesc = book.description?.toLowerCase().includes(activeSearch);
        if (!matchesTitle && !matchesAuthor && !matchesGenre && !matchesDesc) return false;
      }

      if (selectedCategories.length > 0) {
        const matchesAnyCat = selectedCategories.some((cat) => {
          const allowedGenres = CATEGORY_MAPPINGS[cat] || [cat];
          return (
            allowedGenres.includes(book.genre) ||
            book.title.toLowerCase().includes(cat.toLowerCase())
          );
        });
        if (!matchesAnyCat) return false;
      }

      if (pricePreset === '0-20' && book.price > 200000) return false;
      if (pricePreset === '20-50' && (book.price < 200000 || book.price > 350000)) return false;

      if (selectedRating !== null && book.rating < selectedRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rated') return b.rating - a.rating;
      if (sortBy === 'newest') {
        return (b.specs?.publicationYear || 0) - (a.specs?.publicationYear || 0);
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filterQuery, selectedCategories, pricePreset, selectedRating, sortBy]);

  const totalItems = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const displayedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const priceDisplayText = useMemo(() => {
    if (pricePreset === '0-20') return 'Dưới 100.000 ₫';
    if (pricePreset === '20-50') return '100.000 ₫ – 300.000 ₫';
    if (pricePreset === '50+') return 'Trên 300.000 ₫';
    return '50.000 ₫ – 500.000 ₫';
  }, [pricePreset]);

  return (
    <div
      id="catalog-page-root"
      data-testid="catalog-page-coordinator"
      className="flex flex-col w-full bg-surface text-primary font-body-md"
    >
      {/* Editorial Ambient Flare */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 1. Breadcrumbs */}
        <div className="w-full px-gutter-lg pt-space-md">
          <div className="max-w-[1440px] mx-auto">
            <CatalogBreadcrumbs />
          </div>
        </div>

        {/* 2. Main 2-Column Catalog Layout */}
        <section className="w-full px-gutter-lg pb-space-xxl">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Filter Sidebar */}
            <div className="lg:col-span-3">
              <FilterSidebar
                filterQuery={filterQuery}
                onFilterQueryChange={(q) => {
                  setFilterQuery(q);
                  setSearchQuery(q);
                }}
                onClearSearch={handleClearSearch}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                pricePreset={pricePreset}
                onPriceChipClick={handlePriceChipClick}
                priceDisplayText={priceDisplayText}
                selectedRating={selectedRating}
                onSelectRating={setSelectedRating}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Right Results Workspace */}
            <div className="lg:col-span-9 flex flex-col gap-space-md">
              {/* Top Controls & Sort Bar */}
              <CatalogSearchSortBar
                displayedCount={displayedBooks.length}
                totalCount={totalItems}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
              />

              {/* Category Chips Bar */}
              <CategoryChipsBar
                categories={CHIP_CATEGORIES}
                selectedCategory={selectedCategories[0] || null}
                onSelectCategory={(cat) => {
                  if (cat) {
                    setSelectedCategories([cat]);
                  } else {
                    setSelectedCategories([]);
                  }
                  setCurrentPage(1);
                }}
              />

              {/* Book Results Grid / Empty State */}
              {displayedBooks.length === 0 ? (
                <CatalogEmptyState onResetFilters={handleResetFilters} />
              ) : (
                <CatalogBookGrid
                  books={displayedBooks}
                  addedBookIds={addedBookIds}
                  genreTagMapping={GENRE_TAG_MAPPING}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              )}

              {/* Pagination */}
              <CatalogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />

              {/* Bottom Editorial Showcase */}
              <EditorialShowcaseBanner />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filterQuery={filterQuery}
        onFilterQueryChange={(q) => {
          setFilterQuery(q);
          setSearchQuery(q);
        }}
        onClearSearch={handleClearSearch}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        pricePreset={pricePreset}
        onPriceChipClick={handlePriceChipClick}
        priceDisplayText={priceDisplayText}
        selectedRating={selectedRating}
        onSelectRating={setSelectedRating}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default Catalog;

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Book } from '../types';
import { useStore } from '../store/useStore';
import { fetchBooksFromFirestore } from '../services/firebase';
import { CatalogBreadcrumbs } from '../components/catalog/CatalogBreadcrumbs';
import { CatalogSearchSortBar, CatalogSortOption } from '../components/catalog/CatalogSearchSortBar';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer';
import { CatalogBookGrid } from '../components/catalog/CatalogBookGrid';
import { CatalogEmptyState } from '../components/catalog/CatalogEmptyState';
import { CatalogPagination } from '../components/catalog/CatalogPagination';
import { EditorialShowcaseBanner } from '../components/catalog/EditorialShowcaseBanner';

// Category mapping supporting both English genres and Firestore Vietnamese categories
const CATEGORY_MAPPINGS: Record<string, string[]> = {
  cat_01: ['Literary Fiction', 'Văn học tinh hoa', 'Văn học', 'Tiểu thuyết'],
  cat_02: ['Self-Growth', 'Phát triển bản thân', 'Psychology & Habits', 'Kỹ năng sống', 'Tâm lý'],
  cat_03: ['Tech & Coding', 'Distributed Systems', 'Computer Science', 'Kỹ thuật & Công nghệ', 'Công nghệ thông tin', 'Lập trình'],
  cat_04: ['Sci-Fi & Fantasy', 'Sci-Fi & Speculative', 'Khoa học viễn tưởng', 'Viễn tưởng'],
  'Computer Science': [
    'cat_03',
    'Distributed Systems',
    'Computer Science',
    'Tech & Coding',
    'Công nghệ thông tin & Lập trình',
    'Công nghệ thông tin',
  ],
  'Psychology & Habits': [
    'cat_02',
    'Self-Growth',
    'History & Mind',
    'Kỹ năng sống & Phát triển bản thân',
    'Kỹ năng sống',
  ],
  'Literary Fiction': [
    'cat_01',
    'Literary Fiction',
    'Văn học Việt Nam',
    'Tiểu thuyết lãng mạn',
    'Văn học',
  ],
  'Sci-Fi & Speculative': ['cat_04', 'Sci-Fi & Fantasy', 'Khoa học viễn tưởng'],
  'Business & Strategy': ['Tech & Coding', 'Business', 'Kinh doanh & Chiến lược'],
  'Design & Visual Arts': ['Graphic Novels', 'Design & UI', 'Thiết kế & Nghệ thuật'],
};


export const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { searchQuery, setSearchQuery, addToCart } = useStore();

  // Data fetching state
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterQuery, setFilterQuery] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return categoryParam ? [categoryParam] : [];
  });
  const [pricePreset, setPricePreset] = useState<'0-20' | '20-50' | '50+' | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<CatalogSortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedBookIds, setAddedBookIds] = useState<Record<string, boolean>>({});

  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBooksFromFirestore();
      setBooks(data);
    } catch (err: any) {
      console.error('[Catalog] Error fetching books from Firestore:', err);
      setError(err?.message || 'Không thể tải danh mục sách. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    setFilterQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories((prev) =>
        prev.includes(categoryParam) ? prev : [categoryParam]
      );
      setCurrentPage(1);
    }
  }, [categoryParam]);

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
    if (searchParams.get('category')) {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    }
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
    return books
      .filter((book) => {
        const activeSearch = filterQuery.trim().toLowerCase();
        if (activeSearch) {
          const matchesTitle = book.title?.toLowerCase().includes(activeSearch);
          const matchesAuthor = book.author?.toLowerCase().includes(activeSearch);
          const matchesGenre = book.genre?.toLowerCase().includes(activeSearch);
          const matchesDesc = book.description?.toLowerCase().includes(activeSearch);
          if (!matchesTitle && !matchesAuthor && !matchesGenre && !matchesDesc) return false;
        }

        if (selectedCategories.length > 0) {
          const matchesAnyCat = selectedCategories.some((cat) => {
            const allowedGenres = CATEGORY_MAPPINGS[cat] || [cat];
            const catLower = cat.toLowerCase();

            // Check if matches in book.categories array
            if (book.categories && Array.isArray(book.categories)) {
              const matchedInArray = book.categories.some((c) => {
                const cLower = String(c).toLowerCase();
                return (
                  cLower === catLower ||
                  allowedGenres.some((ag) => cLower.includes(ag.toLowerCase()))
                );
              });
              if (matchedInArray) return true;
            }

            return (
              allowedGenres.some((g) => book.genre?.toLowerCase().includes(g.toLowerCase())) ||
              book.title?.toLowerCase().includes(catLower)
            );
          });
          if (!matchesAnyCat) return false;
        }

        if (pricePreset === '0-20' && book.price > 100000) return false;
        if (pricePreset === '20-50' && (book.price < 100000 || book.price > 300000)) return false;
        if (pricePreset === '50+' && book.price <= 300000) return false;

        if (selectedRating !== null && book.rating < selectedRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rated') return b.rating - a.rating;
        if (sortBy === 'newest') {
          return (b.specs?.publicationYear || 0) - (a.specs?.publicationYear || 0);
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [books, filterQuery, selectedCategories, pricePreset, selectedRating, sortBy]);

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

              {/* Book Results Grid / Loading Spinner / Error State / Empty State */}
              {isLoading ? (
                <div
                  id="catalog-loading-state"
                  data-testid="catalog-loading-spinner"
                  className="flex flex-col items-center justify-center py-24 min-h-[400px] w-full"
                >
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-secondary font-medium text-body-md">Đang tải danh mục ấn phẩm...</p>
                </div>
              ) : error ? (
                <div
                  id="catalog-error-state"
                  data-testid="catalog-error-state"
                  className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl my-6 text-center w-full"
                >
                  <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
                  <h3 className="font-headline-sm text-on-surface mb-2 font-bold">Không thể tải danh mục sách</h3>
                  <p className="text-secondary mb-4 max-w-md">{error}</p>
                  <button
                    onClick={loadBooks}
                    className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                  >
                    Thử lại
                  </button>
                </div>
              ) : displayedBooks.length === 0 ? (
                <CatalogEmptyState onResetFilters={handleResetFilters} />
              ) : (
                <CatalogBookGrid
                  books={displayedBooks}
                  addedBookIds={addedBookIds}
                  genreTagMapping={{}}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              )}

              {/* Pagination */}
              {!isLoading && !error && displayedBooks.length > 0 && (
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
              )}

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

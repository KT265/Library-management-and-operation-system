import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockData';
import { Book } from '../types';
import { useStore } from '../store/useStore';

// Extended mock books to include Stitch Screen Card 8 (Design Systems: Principles) if not in base data
const CATALOG_BOOKS: Book[] = (() => {
  const hasDesignSystems = MOCK_BOOKS.some((b) => b.title.includes('Design Systems'));
  if (hasDesignSystems) return MOCK_BOOKS;
  const designSystemsBook: Book = {
    id: 'book-13',
    title: 'Design Systems: Principles',
    subtitle: 'A practical guide to creating design languages for digital products',
    author: 'Alla Kholmatova',
    authorBio: 'Alla Kholmatova is a UX designer and author specializing in component-driven design systems.',
    publisher: 'Smashing Media',
    price: 39.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 340,
    inStock: true,
    stockCount: 8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWsVl9tJ4A0uh4f9SX7mrqJL4-1UcG2D4fSR0m8vPPT-hQrGvH-6KCWwWtlQwhwmPKcCOdv3kf6zeXI58S4kDXbHT2Y_TE5-avM0DKbUl3gyQaOgZODnUCX1jZVbw0ju2mknqvKAa3kPliMv4uLxkU_wNplv3zVsFkp2DTAtdGcABrCE_n9d6nraOzvUjv0PoCw-gH_10W8VUkACtvn9YFwEBPIlC_eySkC6Ta2vg',
    genre: 'Graphic Novels',
    format: 'Hardcover',
    description:
      'Design Systems is a comprehensive handbook exploring the fundamentals, patterns, and principles of scalable design systems.',
    featured: true,
    isBestseller: false,
    specs: {
      isbn: '978-3945749586',
      format: 'Hardcover',
      pages: 288,
      language: 'English',
      publisher: 'Smashing Media',
      dimensions: '6.5 x 0.8 x 9.0 inches',
      weight: '1.2 lbs',
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

  // Filter States
  const [filterQuery, setFilterQuery] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pricePreset, setPricePreset] = useState<'0-20' | '20-50' | '50+' | null>('50+');
  const [selectedRating, setSelectedRating] = useState<number | null>(4.0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'rated'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedBookIds, setAddedBookIds] = useState<Record<string, boolean>>({});

  const filterSidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync external search query
  useEffect(() => {
    setFilterQuery(searchQuery);
  }, [searchQuery]);

  // Handle Clear Search
  const handleClearSearch = () => {
    setFilterQuery('');
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle Category Toggle
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  // Handle Quick Price Chip
  const handlePriceChipClick = (chip: '0-20' | '20-50' | '50+') => {
    setPricePreset((prev) => (prev === chip ? null : chip));
    setCurrentPage(1);
  };

  // Handle Reset / Clear All Filters
  const handleResetFilters = () => {
    setFilterQuery('');
    setSearchQuery('');
    setSelectedCategories([]);
    setPricePreset(null);
    setSelectedRating(null);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Handle Add to Bag with 1400ms feedback micro-state
  const handleAddToCart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart(book, 1);
    setAddedBookIds((prev) => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedBookIds((prev) => ({ ...prev, [book.id]: false }));
    }, 1400);
  };

  // Handle Buy Now
  const handleBuyNow = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart(book, 1);
    navigate('/checkout');
  };

  // Computed Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return CATALOG_BOOKS.filter((book) => {
      // Keyword search
      const activeSearch = filterQuery.trim().toLowerCase();
      if (activeSearch) {
        const matchesTitle = book.title.toLowerCase().includes(activeSearch);
        const matchesAuthor = book.author.toLowerCase().includes(activeSearch);
        const matchesGenre = book.genre.toLowerCase().includes(activeSearch);
        const matchesDesc = book.description?.toLowerCase().includes(activeSearch);
        if (!matchesTitle && !matchesAuthor && !matchesGenre && !matchesDesc) return false;
      }

      // Categories
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

      // Price preset
      if (pricePreset === '0-20' && book.price > 20) return false;
      if (pricePreset === '20-50' && (book.price < 20 || book.price > 50)) return false;
      // Note: Chip '50+' is default styled in Stitch mockup as curation highlight;
      // When explicitly active along with standard catalog, items display appropriately

      // Ratings
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

  // Pagination calculation
  const totalItems = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const displayedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Price Display text
  const priceDisplayText = useMemo(() => {
    if (pricePreset === '0-20') return '$0 — $20';
    if (pricePreset === '20-50') return '$20 — $50';
    if (pricePreset === '50+') return '$50+';
    return '$15 — $75';
  }, [pricePreset]);

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Editorial Ambient Flare */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Editorial Header Strip */}
        <section className="w-full px-gutter-lg pt-space-lg pb-space-md">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <h1 className="font-display-md text-display-md text-primary tracking-tight">The Library Catalog</h1>
            </div>
            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                id="mobileFilterToggle"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-space-md py-2.5 rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Refine Filters</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main 2-Column Section */}
        <section className="w-full px-gutter-lg pb-space-xxl">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Filter Rail / Sidebar */}
            <aside
              id="filterSidebar"
              ref={filterSidebarRef}
              className={`lg:col-span-3 ${
                isMobileFilterOpen ? 'flex' : 'hidden'
              } lg:flex flex-col gap-space-lg bg-surface-container-low p-space-lg rounded-3xl shadow-sm`}
            >
              {/* Header & Reset */}
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                  <h2 className="font-title-md text-title-md font-bold text-primary tracking-tight">Filter Selections</h2>
                </div>
                <button
                  type="button"
                  id="resetAllFilters"
                  onClick={handleResetFilters}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Keyword Search in Filter Rail */}
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  id="sidebarSearchInput"
                  type="text"
                  value={filterQuery}
                  placeholder="Filter current page..."
                  onChange={(e) => {
                    setFilterQuery(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full bg-surface-container-lowest rounded-full pl-10 pr-9 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {filterQuery && (
                  <button
                    type="button"
                    id="clearSearchBtn"
                    onClick={handleClearSearch}
                    className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[16px] cursor-pointer"
                  >
                    cancel
                  </button>
                )}
              </div>

              {/* Category Section: Genres & Disciplines */}
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider text-[11px]">
                    Genres &amp; Disciplines
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    'Computer Science',
                    'Psychology & Habits',
                    'Literary Fiction',
                    'Sci-Fi & Speculative',
                    'Business & Strategy',
                    'Design & Visual Arts',
                  ].map((category) => {
                    const isChecked = selectedCategories.includes(category);
                    return (
                      <label
                        key={category}
                        className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCategory(category)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                          />
                          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                            {category}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider & Presets */}
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider text-[11px]">
                    Price Threshold ($)
                  </span>
                  <span className="font-label-md text-label-md font-bold text-primary" id="priceDisplay">
                    {priceDisplayText}
                  </span>
                </div>

                {/* Quick Chips */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['0-20', '20-50', '50+'] as const).map((chip) => {
                    const label = chip === '0-20' ? '0 – 20' : chip === '20-50' ? '20 – 50' : '50+';
                    const isActive = pricePreset === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handlePriceChipClick(chip)}
                        className={`quick-price-chip py-1 rounded-full text-center font-label-sm text-label-sm transition-all cursor-pointer ${
                          isActive
                            ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                            : 'bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Double Range Slider Graphic */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-surface-container-lowest rounded-2xl px-3 py-1.5 shadow-sm">
                    <span className="block font-label-sm text-label-sm text-outline">Min</span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">$15.00</span>
                  </div>
                  <span className="text-outline text-body-sm font-bold">—</span>
                  <div className="flex-1 bg-surface-container-lowest rounded-2xl px-3 py-1.5 shadow-sm">
                    <span className="block font-label-sm text-label-sm text-outline">Max</span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">$75.00</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider text-[11px]">
                    Customer Ratings
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">4 levels</span>
                </div>
                <div className="space-y-1.5">
                  {/* Level 5.0 */}
                  <label className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="rating-filter"
                        checked={selectedRating === 5.0}
                        onChange={() => setSelectedRating(selectedRating === 5.0 ? null : 5.0)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                          5.0
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Level 4.0 & up */}
                  <label
                    className={`flex items-center justify-between p-2 rounded-2xl transition-colors cursor-pointer group ${
                      selectedRating === 4.0 ? 'bg-surface-container-high/60' : 'hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="rating-filter"
                        checked={selectedRating === 4.0}
                        onChange={() => setSelectedRating(selectedRating === 4.0 ? null : 4.0)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4].map((i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                              star
                            </span>
                          ))}
                          <span className="material-symbols-outlined text-[16px] text-outline-variant">star</span>
                        </div>
                        <span className="font-body-md text-body-md font-semibold text-primary transition-colors">
                          4.0 &amp; up
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Level 3.0 & up */}
                  <label className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="rating-filter"
                        checked={selectedRating === 3.0}
                        onChange={() => setSelectedRating(selectedRating === 3.0 ? null : 3.0)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                              star
                            </span>
                          ))}
                          {[4, 5].map((i) => (
                            <span key={i} className="material-symbols-outlined text-[16px] text-outline-variant">
                              star
                            </span>
                          ))}
                        </div>
                        <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                          3.0 &amp; up
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Level 2.0 & up */}
                  <label className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="rating-filter"
                        checked={selectedRating === 2.0}
                        onChange={() => setSelectedRating(selectedRating === 2.0 ? null : 2.0)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-500">
                          {[1, 2].map((i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                              star
                            </span>
                          ))}
                          {[3, 4, 5].map((i) => (
                            <span key={i} className="material-symbols-outlined text-[16px] text-outline-variant">
                              star
                            </span>
                          ))}
                        </div>
                        <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                          2.0 &amp; up
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-space-sm flex flex-col gap-2">
                <button
                  type="button"
                  id="applyFilterBtn"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  <span>Apply Refinements</span>
                </button>
                <button
                  type="button"
                  id="clearFilterBtn"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Right Results Workspace */}
            <div className="lg:col-span-9 flex flex-col gap-space-md">
              {/* Top Control & Status Toolbar */}
              <div className="bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="font-title-md text-title-md font-bold text-primary">Catalog Results</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                      Showing {displayedBooks.length} of {totalItems} books
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <label htmlFor="sortDropdown" className="font-label-md text-label-md text-on-surface-variant shrink-0">
                      Sort By:
                    </label>
                    <div className="relative min-w-[210px]">
                      <select
                        id="sortDropdown"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                      >
                        <option value="featured">Featured Curations</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="rated">Highest Reader Rated</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Books Responsive Grid */}
              {displayedBooks.length === 0 ? (
                <div className="w-full py-16 text-center bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
                  <span className="material-symbols-outlined text-outline text-[48px] mb-2 block">search_off</span>
                  <h3 className="font-title-lg text-title-lg font-bold text-primary mb-1">
                    No books matched your criteria
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-4">
                    Try relaxing your filters, price threshold, or search keywords.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-lg shadow-sm hover:bg-primary-container transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                  {displayedBooks.map((book) => {
                    const discountPercent =
                      book.originalPrice && book.originalPrice > book.price
                        ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
                        : 0;
                    const isAdded = !!addedBookIds[book.id];
                    const genreTag = GENRE_TAG_MAPPING[book.id] || book.genre;

                    return (
                      <article
                        key={book.id}
                        className="group bg-surface-container-lowest rounded-3xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Book Cover Container */}
                          <div
                            onClick={() => navigate(`/book/${book.id}`)}
                            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-tr from-primary-container via-surface-variant to-secondary-container p-2 flex flex-col justify-between group-hover:scale-[1.01] transition-transform cursor-pointer"
                          >
                            <div className="flex items-center justify-between z-10" />
                            <img
                              className="w-full h-full object-cover rounded-xl absolute inset-0"
                              src={book.coverImage}
                              alt={book.title}
                            />
                            <div className="relative z-10 mt-auto bg-gradient-to-t from-primary/95 via-primary/50 to-transparent p-3 pt-8 rounded-b-xl text-on-primary">
                              <span className="font-label-sm text-label-sm bg-surface-container-low/20 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {genreTag}
                              </span>
                            </div>
                          </div>

                          {/* Book Details */}
                          <div className="pt-3 px-1">
                            <h3
                              onClick={() => navigate(`/book/${book.id}`)}
                              className="font-title-md text-title-md font-bold text-primary group-hover:text-tertiary transition-colors line-clamp-1 cursor-pointer"
                            >
                              {book.title}
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                              {book.author}
                            </p>

                            {/* Ratings Row */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="flex items-center text-tertiary">
                                {[1, 2, 3, 4, 5].map((starIdx) => {
                                  const fillLevel = book.rating - starIdx + 1;
                                  if (fillLevel >= 0.8) {
                                    return (
                                      <span
                                        key={starIdx}
                                        className="material-symbols-outlined text-[16px]"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                      >
                                        star
                                      </span>
                                    );
                                  } else if (fillLevel >= 0.3) {
                                    return (
                                      <span
                                        key={starIdx}
                                        className="material-symbols-outlined text-[16px]"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                      >
                                        star_half
                                      </span>
                                    );
                                  }
                                  return (
                                    <span
                                      key={starIdx}
                                      className="material-symbols-outlined text-[16px] text-outline-variant"
                                    >
                                      star
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="font-label-sm text-label-sm font-bold text-on-surface">
                                {book.rating.toFixed(1)}
                              </span>
                              <span className="font-body-sm text-body-sm text-outline">
                                ({book.reviewCount.toLocaleString()})
                              </span>
                            </div>

                            {/* Price & Discount Row */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-title-lg text-title-lg font-bold text-primary">
                                ${book.price.toFixed(2)}
                              </span>
                              {book.originalPrice && (
                                <span className="font-body-sm text-body-sm text-outline line-through">
                                  ${book.originalPrice.toFixed(2)}
                                </span>
                              )}
                              {discountPercent > 0 && (
                                <span className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/30 px-1.5 py-0.5 rounded-full">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stock & Action Buttons Footer */}
                        <div className="pt-3 px-1">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-primary-container font-semibold">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  (book.stockCount || 10) <= 3 ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}
                              />
                              {(book.stockCount || 10) <= 3
                                ? `Only ${book.stockCount} copies left`
                                : `In Stock (${book.stockCount || 24} copies)`}
                            </span>
                            <span className="font-label-sm text-label-sm text-outline">{book.format}</span>
                          </div>

                          {/* Buy Now Button */}
                          <button
                            type="button"
                            data-path="cart-checkout"
                            onClick={(e) => handleBuyNow(e, book)}
                            className="w-full mb-2 py-2 px-4 rounded-full bg-secondary-container text-on-primary-fixed hover:bg-secondary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all border-0 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            <span>Buy Now</span>
                          </button>

                          {/* Add to Bag Button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, book)}
                            className={`cart-btn w-full py-2.5 rounded-full font-label-md text-label-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm cursor-pointer ${
                              isAdded
                                ? 'bg-tertiary text-on-tertiary'
                                : 'bg-primary text-on-primary hover:bg-primary-container'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAdded ? 'check' : 'shopping_bag'}
                            </span>
                            <span>{isAdded ? 'Added' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* M3 Architectural Pagination Component */}
              <div className="mt-space-lg bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Page <span className="font-bold text-primary">{currentPage}</span> of{' '}
                  <span className="font-bold text-primary">{totalPages}</span> (Showing books{' '}
                  {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
                  {Math.min(currentPage * pageSize, totalItems)})
                </div>

                {/* Page Number Cluster */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous Page"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-10 h-10 rounded-full font-label-md text-label-md font-bold shadow-sm cursor-pointer ${
                      currentPage === 1
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
                    }`}
                  >
                    1
                  </button>

                  {totalPages >= 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage(2)}
                      className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                        currentPage === 2
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      2
                    </button>
                  )}

                  {totalPages >= 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage(3)}
                      className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                        currentPage === 3
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      3
                    </button>
                  )}

                  {totalPages > 4 && (
                    <span className="w-8 text-center text-outline font-label-md text-label-md select-none">...</span>
                  )}

                  {totalPages > 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label="Next Page"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>

                {/* Per Page Density Pill */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-outline">Per page:</span>
                  <div className="flex items-center bg-surface-container-low rounded-full p-1 text-[12px] font-label-sm">
                    {[24, 48, 96].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setCurrentPage(1);
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                          pageSize === size
                            ? 'bg-surface-container-lowest font-bold text-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catalog;

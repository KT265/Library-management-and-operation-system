import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';

export interface InventoryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalUnits: number;
  availableUnits: number;
  price: number;
  coverImage: string;
  coverAlt: string;
}

// 6 Exact Stitch Screen ef7ac0a2 Reference Volumes
const INITIAL_INVENTORY_ITEMS: InventoryBook[] = [
  {
    id: 'inv-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Computer Science',
    isbn: '978-1449373320',
    totalUnits: 50,
    availableUnits: 38,
    price: 42.5,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr',
    coverAlt:
      'Cover of Designing Data-Intensive Applications book featuring a detailed stylized sketch of a wild animal with deep navy blue tones and modern technical editorial typography',
  },
  {
    id: 'inv-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Growth',
    isbn: '978-0735211292',
    totalUnits: 120,
    availableUnits: 48,
    price: 35.0,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUStideZHq6BmOKiYu7mgtlQihp3F4Y2Wn3RED25OX9mUHfLms37LzaG3-Fn2_xSKVsRSfqoLs-9dG4mio3HNWA7yhx6SEb3lkCvfXsAyb_pr17ZO1DDNTpqO_8BaXXVSrmZ1wO_eUpOmk6obkeDZwNCIrh-1r3wsbaGujhdRgevosIlGwN64gmq_vA1XzYg_WbRRwYz5cq0XGsAoXw1zKe_JmABYP5hqgqokiYki',
    coverAlt:
      'Cover of Atomic Habits book by James Clear with minimal clean typography, white background with orange and yellow micro-particles dispersing across layout',
  },
  {
    id: 'inv-3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    category: 'Literary Fiction',
    isbn: '978-0593318171',
    totalUnits: 30,
    availableUnits: 15,
    price: 16.8,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTQ_WwYkQvYn3nrOUA5Gd69WYH8f-tnmZKz9f8hY-0Wa4Vuhx5O9MtUDdQb6UXxCrIX5foekfPKWqgYRFVz92N0n9WDLSJ0r61pjmxpDkBZB1fbS48c4ZYcyJ9m3DrOlqVq16Z6aoday_uVEyKcYnnt7pKIh6EbEMmdY4uzg1s-Vt1yZLWjmjvRFYiG70iTueQTUPDp5F08pjWXtNmTRNLXE3MVEvDIhDjFr-w5nJ',
    coverAlt:
      'Cover of Klara and the Sun by Kazuo Ishiguro featuring a subtle stylized solar motif with pastel dawn colors and sophisticated modern literary serif typography',
  },
  {
    id: 'inv-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andy Hunt',
    category: 'Computer Science',
    isbn: '978-0135957059',
    totalUnits: 40,
    availableUnits: 3,
    price: 34.9,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtcRj3ztsntN5PnK6PR6R-sSTO1NuppR4punJz6oZTNQbWZ7gheS0b4E-J7dB4IIkG7bLA5J6wAjFE1hNQ7Jh-Vs0H-lojI_4btNfJEbaRySiyaqA_Xj2hmEnv0sA9XlxzBN9zVfkD9MndFwbrYc5eNg7_6Z9qXIHFGPRXXvgJmKUiZpAmRyZSAnTZYHOSc_xz5_msBcpIQY-eLAC8pnT7h8QD0KlEJybFj29UxU_B',
    coverAlt:
      'Cover of The Pragmatic Programmer book 20th Anniversary Edition featuring modern slate blue and metallic bronze accents with code snippets subtly embossed',
  },
  {
    id: 'inv-5',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    isbn: '978-0134494166',
    totalUnits: 25,
    availableUnits: 19,
    price: 32.0,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvxAwJheM7Qa0JWNH-udcIwmFxnwm9HdQNbYHUdGB4lm39CbVjmMyF5MiMkq_AI6TSxqE67I871L0GsWzjGHN50XfoHYauYGlrYsSJ9amFSHesg7s90tMH5GWOahDSFai3IYFzyTC4n9wWtXowDI30PGR7Ie95fe-UpXjGNe8hfEHmvWuquv5LtRnLrlTuYFXoa7ewQuMb9E73MHQbYz4sL9i1twIp7PJ_jAW2oPb',
    coverAlt:
      'Cover of Clean Architecture by Robert C. Martin showing structured architectural blueprints overlaid with clean modern graphic typography in navy and silver tones',
  },
  {
    id: 'inv-6',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    category: 'Fiction',
    isbn: '978-0375704024',
    totalUnits: 15,
    availableUnits: 2,
    price: 24.0,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSqcasNMn6kZQtsQ6QM49MI2d5LAsUgaJWddcG1Ch-Civ0bCD4Obg4VJCnCutKW267lUIbt6MQiiR4t-8dWzEyIair1fPm4p-NKqU1Wm2vIbk8zdwqaltEAKVnviwoHpfBS_DPEyeMNC2TRygQja8JmFOba8ZVS2xVUlcozqBaaBdO37GqmjhHnD5FXan1usZKqSzY-Q0TdhGvV4pExQ0G7Pyxu_3oeGzvcxCcAWz1',
    coverAlt:
      'Cover of Norwegian Wood by Haruki Murakami showing atmospheric Tokyo mist and dark emerald green forest motifs with poignant minimalist Japanese typesetting',
  },
];

// Generate complementary dataset to accurately total 48 items matching Stitch pagination indicator
const COMPLEMENTARY_ITEMS: InventoryBook[] = Array.from({ length: 42 }, (_, i) => {
  const index = i + 7;
  const categories = ['Computer Science', 'Self-Growth', 'Literary Fiction', 'Fiction', 'Behavioral Science'];
  const cat = categories[i % categories.length];
  const total = 20 + ((i * 7) % 80);
  const avail = Math.max(0, total - ((i * 5) % total));
  return {
    id: `inv-${index}`,
    title: `Curated Volume ${index}: Selected Monograph`,
    author: `Scholar Author ${index}`,
    category: cat,
    isbn: `978-013${String(index).padStart(4, '0')}7059`,
    totalUnits: total,
    availableUnits: avail,
    price: +(18.5 + (i % 6) * 4.25).toFixed(2),
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr',
    coverAlt: `Cover artwork for Curated Volume ${index}`,
  };
});

const COMPLETE_INVENTORY_CATALOG: InventoryBook[] = [
  ...INITIAL_INVENTORY_ITEMS,
  ...COMPLEMENTARY_ITEMS,
];

export const AdminInventory: React.FC = () => {
  // Store integration
  const globalShowToast = useStore((state) => state.showToast);

  // Component state
  const [books, setBooks] = useState<InventoryBook[]>(COMPLETE_INVENTORY_CATALOG);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal dialog state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('');
  const [formIsbn, setFormIsbn] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formTotal, setFormTotal] = useState<string>('');
  const [formAvailable, setFormAvailable] = useState<string>('');
  const [formCover, setFormCover] = useState<string>('placeholder');

  // Dedicated toast notification state (matches Stitch DOM element IDs #toastNotification and #toastMessage)
  const [toastMessage, setToastMessage] = useState<string>('Exporting catalog CSV inventory snapshot...');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    // Also sync with Zustand global toast
    globalShowToast?.(msg);
  };

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  // Filtering Logic
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return books.filter((book) => {
      // 1. Text Search (ISBN-13, Title, Author)
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q);

      // 2. Category Filter
      const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;

      // 3. Stock Level Filter
      let matchesStock = true;
      if (stockFilter === 'healthy') matchesStock = book.availableUnits > 10;
      if (stockFilter === 'low') matchesStock = book.availableUnits > 0 && book.availableUnits <= 5;
      if (stockFilter === 'out') matchesStock = book.availableUnits === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [books, searchQuery, categoryFilter, stockFilter]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / rowsPerPage));

  // Reset to page 1 when filters or rows per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, stockFilter, rowsPerPage]);

  // Paginated books slice
  const paginatedBooks = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredBooks.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredBooks, currentPage, rowsPerPage]);

  const startIndex = filteredBooks.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * rowsPerPage, filteredBooks.length);

  // Actions
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleReload = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStockFilter('all');
    setCurrentPage(1);
    displayToast('Catalog refreshed.');
  };

  const handleCopyIsbn = (isbn: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(isbn).catch(() => {});
    }
    displayToast(`ISBN ${isbn} copied to clipboard`);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to remove this volume from active catalog records?')) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      displayToast('Book entry archived and removed from view.');
    }
  };

  const handleOpenAddModal = () => {
    setEditingBookId(null);
    setFormTitle('');
    setFormAuthor('');
    setFormCategory('');
    setFormIsbn('');
    setFormPrice('');
    setFormTotal('');
    setFormAvailable('');
    setFormCover('placeholder');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: InventoryBook) => {
    setEditingBookId(book.id);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormCategory(book.category);
    setFormIsbn(book.isbn);
    setFormPrice(book.price.toFixed(2));
    setFormTotal(String(book.totalUnits));
    setFormAvailable(String(book.availableUnits));
    setFormCover(book.coverImage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formAuthor.trim() || !formCategory || !formIsbn.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(formPrice) || 0;
    const totalNum = parseInt(formTotal, 10) || 1;
    const availNum = parseInt(formAvailable, 10) || 0;

    if (availNum > totalNum) {
      alert('Available copies cannot exceed total volume copies.');
      return;
    }

    const defaultCover =
      formCover && formCover !== 'placeholder'
        ? formCover
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr';

    if (editingBookId) {
      // Edit existing volume
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBookId
            ? {
                ...b,
                title: formTitle.trim(),
                author: formAuthor.trim(),
                category: formCategory,
                isbn: formIsbn.trim(),
                price: priceNum,
                totalUnits: totalNum,
                availableUnits: availNum,
                coverImage: defaultCover,
              }
            : b
        )
      );
      displayToast(`"${formTitle.trim()}" updated successfully.`);
    } else {
      // Prepend newly cataloged volume
      const newBook: InventoryBook = {
        id: `inv-${Date.now()}`,
        title: formTitle.trim(),
        author: formAuthor.trim(),
        category: formCategory,
        isbn: formIsbn.trim(),
        price: priceNum,
        totalUnits: totalNum,
        availableUnits: availNum,
        coverImage: defaultCover,
        coverAlt: `Cover artwork for ${formTitle.trim()} by ${formAuthor.trim()}`,
      };
      setBooks((prev) => [newBook, ...prev]);
      setCurrentPage(1);
      displayToast(`"${formTitle.trim()}" registered successfully.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full pb-margin-lg">
      {/* 1. Header & Primary Action CTA */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            Book Inventory &amp; Catalog Management
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mt-1">
            Manage physical book volumes, warehouse quantities, and active catalog listings.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start lg:self-auto">
          <button
            id="openAddBookBtn"
            onClick={handleOpenAddModal}
            type="button"
            className="h-11 px-space-lg rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-all flex items-center gap-space-xs shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* 2. Four Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        {/* Card 1: Total Volumes Listed */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary">Total Volumes Listed</p>
            <h3 className="font-headline-md text-headline-md font-bold text-primary mt-1">3,482</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[26px]">menu_book</span>
          </div>
        </div>

        {/* Card 2: Healthy Reserve Stock */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary">Healthy Reserve Stock</p>
            <h3 className="font-headline-md text-headline-md font-bold text-primary mt-1">3,120</h3>
            <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-1"></p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-[26px]">check_circle</span>
          </div>
        </div>

        {/* Card 3: Restock Required */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary">Restock Required</p>
            <h3 className="font-headline-md text-headline-md font-bold text-tertiary-container mt-1">42</h3>
            <p className="font-body-sm text-body-sm text-tertiary flex items-center gap-1 mt-1"></p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[26px]">inventory</span>
          </div>
        </div>

        {/* Card 4: Estimated Asset Value */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-secondary">Estimated Asset Value</p>
            <h3 className="font-headline-md text-headline-md font-bold text-primary mt-1">$108,490</h3>
            <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-1"></p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[26px]">payments</span>
          </div>
        </div>
      </div>

      {/* 3. Filter, Search & Refresh Toolbar */}
      <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm mb-space-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        {/* Search Input Pill */}
        <div className="flex-1 max-w-md relative flex items-center bg-surface-container-low rounded-full px-space-md py-2">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
          <input
            id="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ISBN-13, book title, author..."
            type="text"
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              type="button"
              className="text-outline hover:text-on-surface transition-colors ml-1"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Controls & Reload */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 pl-space-md pr-8 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Genres</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Self-Growth">Self-Growth</option>
              <option value="Literary Fiction">Literary Fiction</option>
              <option value="Fiction">Fiction</option>
            </select>
            <span className="material-symbols-outlined text-outline absolute right-2.5 top-2.5 pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>

          {/* Stock Dropdown */}
          <div className="relative">
            <select
              id="stockFilter"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-10 pl-space-md pr-8 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">Stock: All Volumes</option>
              <option value="healthy">In Stock (&gt;10)</option>
              <option value="low">Low Stock (≤5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>
            <span className="material-symbols-outlined text-outline absolute right-2.5 top-2.5 pointer-events-none text-[18px]">
              arrow_drop_down
            </span>
          </div>

          {/* Reload Action */}
          <button
            id="reloadCatalogBtn"
            onClick={handleReload}
            title="Reload catalog"
            type="button"
            className="h-10 w-10 rounded-full bg-surface-container-low text-secondary hover:text-primary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {/* 4. Book Inventory Data Table */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="inventoryTable">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
                <th className="py-space-md px-space-lg w-20">Volume</th>
                <th className="py-space-md px-space-md">Title &amp; ISBN-13</th>
                <th className="py-space-md px-space-md">Author</th>
                <th className="py-space-md px-space-md">Department</th>
                <th className="py-space-md px-space-md text-center">Total Units</th>
                <th className="py-space-md px-space-md text-center">Available Units</th>
                <th className="py-space-md px-space-md text-right">Price (vnd)</th>
                <th className="py-space-md px-space-lg w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high font-body-md text-body-md" id="tableBody">
              {paginatedBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[44px] text-outline mb-2">search_off</span>
                      <p className="font-title-md text-title-md font-bold text-primary">No volumes matching criteria</p>
                      <p className="font-body-sm text-body-sm text-secondary mt-1">
                        Try modifying search parameters or genre/stock filter selections.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBooks.map((book) => {
                  const isRestockCritical = book.availableUnits <= 2;
                  const isLowStock = !isRestockCritical && book.availableUnits <= 5;
                  const rowTintClass = isRestockCritical
                    ? 'bg-error-container/20'
                    : isLowStock
                    ? 'bg-tertiary-fixed/20'
                    : '';

                  return (
                    <tr
                      key={book.id}
                      data-available={book.availableUnits}
                      data-category={book.category}
                      className={`hover:bg-surface-container-low/60 transition-colors group ${rowTintClass}`}
                    >
                      {/* Col 1: Volume Cover */}
                      <td className="py-space-md px-space-lg">
                        <div className="w-12 h-16 rounded-lg bg-surface-container overflow-hidden shadow-sm flex items-center justify-center relative">
                          <img
                            src={book.coverImage}
                            data-alt={book.coverAlt}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Col 2: Title & ISBN-13 */}
                      <td className="py-space-md px-space-md">
                        <div className="flex items-center gap-2">
                          <p className="font-title-sm text-title-sm font-bold text-primary group-hover:text-primary-container">
                            {book.title}
                          </p>
                          {isRestockCritical && (
                            <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase">
                              Restock Needed
                            </span>
                          )}
                          {isLowStock && (
                            <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm uppercase">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-space-xs mt-0.5">
                          <span className="font-body-sm text-body-sm text-outline">ISBN: {book.isbn}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyIsbn(book.isbn)}
                            className="text-outline hover:text-primary transition-colors"
                            title="Copy ISBN"
                          >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          </button>
                        </div>
                      </td>

                      {/* Col 3: Author */}
                      <td className="py-space-md px-space-md text-on-surface">{book.author}</td>

                      {/* Col 4: Department / Category */}
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                          {book.category}
                        </span>
                      </td>

                      {/* Col 5: Total Units */}
                      <td className="py-space-md px-space-md text-center font-semibold text-on-surface">
                        {book.totalUnits}
                      </td>

                      {/* Col 6: Available Units Badge */}
                      <td className="py-space-md px-space-md text-center">
                        {isRestockCritical ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                            {book.availableUnits}
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-semibold">
                            {book.availableUnits}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                            {book.availableUnits}
                          </span>
                        )}
                      </td>

                      {/* Col 7: Unit Price */}
                      <td className="py-space-md px-space-md text-right font-title-sm text-title-sm font-bold text-primary">
                        ${book.price.toFixed(2)}
                      </td>

                      {/* Col 8: In-Row Actions */}
                      <td className="py-space-md px-space-lg text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(book)}
                            title="Edit book"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id)}
                            title="Delete listing"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => displayToast(`Exporting snapshot for "${book.title}"...`)}
                            title="More options"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Table Pagination Controls */}
        <div className="py-space-md px-space-lg bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
          {/* Rows per page & counter */}
          <div className="flex items-center gap-space-md text-secondary font-body-sm text-body-sm">
            <span className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-surface-container-low text-on-surface rounded-full px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </span>
            <span className="text-outline">|</span>
            <span>
              Showing {filteredBooks.length > 0 ? startIndex : 0}–{endIndex} of {filteredBooks.length} items
            </span>
          </div>

          {/* Page Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="First page"
            >
              <span className="material-symbols-outlined text-[20px]">first_page</span>
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Previous page"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {/* Numeric Indicators */}
            <div className="flex items-center gap-1 px-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-9 h-9 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-secondary hover:bg-surface-container-low'
                }`}
              >
                1
              </button>

              {totalPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`w-9 h-9 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors ${
                    currentPage === 2
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  2
                </button>
              )}

              {totalPages >= 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={`w-9 h-9 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors ${
                    currentPage === 3
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  3
                </button>
              )}

              {totalPages > 4 && <span className="text-outline px-1">...</span>}

              {totalPages >= 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-9 h-9 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors ${
                    currentPage === totalPages
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Next page"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Last page"
            >
              <span className="material-symbols-outlined text-[20px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Modal: Catalog New Volume (#addBookModal) */}
      <div
        id="addBookModal"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm transition-opacity duration-200 ${
          isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[921px]">
          {/* Modal Header */}
          <div className="px-space-xl pt-space-lg pb-space-md flex items-center justify-between border-b border-surface-container-high/40">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                {editingBookId ? 'Edit Volume Specifications' : 'Catalog New Volume'}
              </h2>
              <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                Input book specifications to add this volume to the warehouse registry.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors"
              title="Close dialog"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Modal Form */}
          <form id="newBookForm" onSubmit={handleFormSubmit} className="overflow-y-auto px-space-xl py-space-md space-y-space-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Book Title
                </label>
                <input
                  id="formTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  required
                  type="text"
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                />
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Author(s)
                </label>
                <input
                  id="formAuthor"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="e.g. Yuval Noah Harari"
                  required
                  type="text"
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                />
              </div>

              {/* Department / Category */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Department / Category
                </label>
                <div className="relative">
                  <select
                    id="formCategory"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    className="w-full h-12 pl-space-md pr-8 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container appearance-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>
                      Select category...
                    </option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Self-Growth">Self-Growth</option>
                    <option value="Literary Fiction">Literary Fiction</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Behavioral Science">Behavioral Science</option>
                  </select>
                  <span className="material-symbols-outlined text-outline absolute right-3 top-3 pointer-events-none text-[20px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* ISBN-13 */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  ISBN-13
                </label>
                <input
                  id="formIsbn"
                  value={formIsbn}
                  onChange={(e) => setFormIsbn(e.target.value)}
                  placeholder="978-xxxxxxxxxx"
                  required
                  type="text"
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                />
              </div>

              {/* Unit Price (USD) */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Unit Price (USD)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-secondary font-semibold">$</span>
                  <input
                    id="formPrice"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="29.99"
                    required
                    type="number"
                    className="w-full h-12 pl-8 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                  />
                </div>
              </div>

              {/* Total Volume Copies */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Total Volume Copies
                </label>
                <input
                  id="formTotal"
                  value={formTotal}
                  onChange={(e) => setFormTotal(e.target.value)}
                  min="1"
                  placeholder="50"
                  required
                  type="number"
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                />
              </div>

              {/* Available Copies */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Available Copies
                </label>
                <input
                  id="formAvailable"
                  value={formAvailable}
                  onChange={(e) => setFormAvailable(e.target.value)}
                  min="0"
                  placeholder="45"
                  required
                  type="number"
                  className="w-full h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                />
              </div>

              {/* Cover Image URL Preview */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-label-md text-label-md font-semibold text-on-surface block">
                  Cover Image URL Preview
                </label>
                <div className="flex items-center gap-space-md">
                  <input
                    id="formCover"
                    value={formCover}
                    onChange={(e) => setFormCover(e.target.value)}
                    placeholder="https://images.bookverse.io/covers/..."
                    type="url"
                    className="flex-1 h-12 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                  />
                  <div className="w-10 h-14 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {formCover && formCover !== 'placeholder' ? (
                      <img src={formCover} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-outline text-[20px]">image</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-space-md pb-space-sm flex items-center justify-end gap-space-sm">
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-11 px-space-lg rounded-full text-secondary hover:bg-surface-container-low font-label-lg text-label-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 px-space-xl rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-all shadow-md"
              >
                {editingBookId ? 'Update Book Listing' : 'Save Book to Catalog'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 7. Toast Notification Pill (#toastNotification & #toastMessage) */}
      <div
        id="toastNotification"
        className={`fixed bottom-6 right-6 z-50 px-space-lg py-space-md rounded-full bg-primary text-on-primary shadow-xl font-label-md text-label-md flex items-center gap-2 transform transition-all duration-300 pointer-events-none ${
          isToastVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
        <span id="toastMessage">{toastMessage}</span>
      </div>
    </div>
  );
};

export default AdminInventory;

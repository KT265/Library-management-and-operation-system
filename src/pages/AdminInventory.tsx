import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { InventoryBook, StockFilterType, SortOptionType } from '../components/admin-inventory/types';
import { InventoryHeader } from '../components/admin-inventory/InventoryHeader';
import { InventoryToolbar } from '../components/admin-inventory/InventoryToolbar';
import { InventoryTable } from '../components/admin-inventory/InventoryTable';
import { InventoryPagination } from '../components/admin-inventory/InventoryPagination';
import { AddBookModal } from '../components/admin-inventory/AddBookModal';
import { EditBookModal } from '../components/admin-inventory/EditBookModal';
import { DeleteConfirmDialog } from '../components/admin-inventory/DeleteConfirmDialog';

// 6 Core Canonical Reference Volumes in VND
const INITIAL_INVENTORY_ITEMS: InventoryBook[] = [
  {
    id: 'inv-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Khoa học máy tính',
    isbn: '978-1449373320',
    totalUnits: 50,
    availableUnits: 38,
    price: 360000,
    publisher: 'NXB Trẻ',
    publishYear: 2023,
    formatVi: 'Bìa cứng',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr',
    coverAlt:
      'Bìa sách Designing Data-Intensive Applications - Martin Kleppmann',
  },
  {
    id: 'inv-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Phát triển bản thân',
    isbn: '978-0735211292',
    totalUnits: 120,
    availableUnits: 48,
    price: 169000,
    publisher: 'NXB Thế Giới',
    publishYear: 2022,
    formatVi: 'Bìa mềm',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUStideZHq6BmOKiYu7mgtlQihp3F4Y2Wn3RED25OX9mUHfLms37LzaG3-Fn2_xSKVsRSfqoLs-9dG4mio3HNWA7yhx6SEb3lkCvfXsAyb_pr17ZO1DDNTpqO_8BaXXVSrmZ1wO_eUpOmk6obkeDZwNCIrh-1r3wsbaGujhdRgevosIlGwN64gmq_vA1XzYg_WbRRwYz5cq0XGsAoXw1zKe_JmABYP5hqgqokiYki',
    coverAlt:
      'Bìa sách Atomic Habits - James Clear',
  },
  {
    id: 'inv-3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    category: 'Văn học cổ điển',
    isbn: '978-0593318171',
    totalUnits: 30,
    availableUnits: 15,
    price: 185000,
    publisher: 'NXB Hội Nhà Văn',
    publishYear: 2021,
    formatVi: 'Bìa mềm',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTQ_WwYkQvYn3nrOUA5Gd69WYH8f-tnmZKz9f8hY-0Wa4Vuhx5O9MtUDdQb6UXxCrIX5foekfPKWqgYRFVz92N0n9WDLSJ0r61pjmxpDkBZB1fbS48c4ZYcyJ9m3DrOlqVq16Z6aoday_uVEyKcYnnt7pKIh6EbEMmdY4uzg1s-Vt1yZLWjmjvRFYiG70iTueQTUPDp5F08pjWXtNmTRNLXE3MVEvDIhDjFr-w5nJ',
    coverAlt:
      'Bìa sách Klara and the Sun - Kazuo Ishiguro',
  },
  {
    id: 'inv-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andy Hunt',
    category: 'Khoa học máy tính',
    isbn: '978-0135957059',
    totalUnits: 40,
    availableUnits: 3,
    price: 320000,
    publisher: 'NXB Tổng hợp TP.HCM',
    publishYear: 2023,
    formatVi: 'Bìa cứng',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtcRj3ztsntN5PnK6PR6R-sSTO1NuppR4punJz6oZTNQbWZ7gheS0b4E-J7dB4IIkG7bLA5J6wAjFE1hNQ7Jh-Vs0H-lojI_4btNfJEbaRySiyaqA_Xj2hmEnv0sA9XlxzBN9zVfkD9MndFwbrYc5eNg7_6Z9qXIHFGPRXXvgJmKUiZpAmRyZSAnTZYHOSc_xz5_msBcpIQY-eLAC8pnT7h8QD0KlEJybFj29UxU_B',
    coverAlt:
      'Bìa sách The Pragmatic Programmer 20th Anniversary Edition',
  },
  {
    id: 'inv-5',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'Khoa học máy tính',
    isbn: '978-0134494166',
    totalUnits: 25,
    availableUnits: 19,
    price: 280000,
    publisher: 'NXB Trẻ',
    publishYear: 2022,
    formatVi: 'Bìa mềm',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvxAwJheM7Qa0JWNH-udcIwmFxnwm9HdQNbYHUdGB4lm39CbVjmMyF5MiMkq_AI6TSxqE67I871L0GsWzjGHN50XfoHYauYGlrYsSJ9amFSHesg7s90tMH5GWOahDSFai3IYFzyTC4n9wWtXowDI30PGR7Ie95fe-UpXjGNe8hfEHmvWuquv5LtRnLrlTuYFXoa7ewQuMb9E73MHQbYz4sL9i1twIp7PJ_jAW2oPb',
    coverAlt:
      'Bìa sách Clean Architecture - Robert C. Martin',
  },
  {
    id: 'inv-6',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    category: 'Tiểu thuyết',
    isbn: '978-0375704024',
    totalUnits: 15,
    availableUnits: 2,
    price: 210000,
    publisher: 'NXB Hội Nhà Văn',
    publishYear: 2020,
    formatVi: 'Bìa mềm',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSqcasNMn6kZQtsQ6QM49MI2d5LAsUgaJWddcG1Ch-Civ0bCD4Obg4VJCnCutKW267lUIbt6MQiiR4t-8dWzEyIair1fPm4p-NKqU1Wm2vIbk8zdwqaltEAKVnviwoHpfBS_DPEyeMNC2TRygQja8JmFOba8ZVS2xVUlcozqBaaBdO37GqmjhHnD5FXan1usZKqSzY-Q0TdhGvV4pExQ0G7Pyxu_3oeGzvcxCcAWz1',
    coverAlt:
      'Bìa sách Norwegian Wood (Rừng Na Uy) - Haruki Murakami',
  },
];

// Generate complementary dataset to accurately total 48 items matching Stitch pagination indicator
const COMPLEMENTARY_ITEMS: InventoryBook[] = Array.from({ length: 42 }, (_, i) => {
  const index = i + 7;
  const categories = ['Khoa học máy tính', 'Phát triển bản thân', 'Văn học cổ điển', 'Tiểu thuyết', 'Tâm lý học'];
  const cat = categories[i % categories.length];
  const total = 20 + ((i * 7) % 80);
  const avail = Math.max(0, total - ((i * 5) % total));
  return {
    id: `inv-${index}`,
    title: `Tuyển tập Ấn bản ${index}: Chuyên đề Đặc biệt`,
    author: `Tác giả Tinh hoa ${index}`,
    category: cat,
    isbn: `978-013${String(index).padStart(4, '0')}7059`,
    totalUnits: total,
    availableUnits: avail,
    price: 185000 + (i % 6) * 35000,
    publisher: 'NXB BookVerse Guild',
    publishYear: 2023,
    formatVi: i % 2 === 0 ? 'Bìa mềm' : 'Bìa cứng',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuiJbYjbBTNMTSvNzEOg0hozusRe0q75o0ImjGvjVudqogCGSYo3jJLRBS8ZVmsTON6QJOHmdeDyM6BfxokKEKvyigGVOKC5-eDhUofXube4SHqMDasP3KQFHyMqMJlJnUu3l2QrryaaIe560_q3WYcQTijSeTCVyTTVqKdcmFKksLxo0Cq-MxOSu5smoTEvpjGY4CyLj-IM7hoZ-y_PymBmlL3kHimWDU9snqQEr',
    coverAlt: `Bìa tác phẩm Tuyển tập Ấn bản ${index}`,
  };
});

const COMPLETE_INVENTORY_CATALOG: InventoryBook[] = [
  ...INITIAL_INVENTORY_ITEMS,
  ...COMPLEMENTARY_ITEMS,
];

const INVENTORY_CATEGORIES = [
  'Khoa học máy tính',
  'Phát triển bản thân',
  'Văn học cổ điển',
  'Tiểu thuyết',
  'Tâm lý học',
];

export const AdminInventory: React.FC = () => {
  const globalShowToast = useStore((state) => state.showToast);

  // Component state
  const [books, setBooks] = useState<InventoryBook[]>(COMPLETE_INVENTORY_CATALOG);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockFilterType>('all');
  const [sortOption, setSortOption] = useState<SortOptionType>('default');

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<InventoryBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<InventoryBook | null>(null);

  // Dedicated toast notification state (preserves #toastNotification and #toastMessage)
  const [toastMessage, setToastMessage] = useState<string>('Đang xuất tệp dữ liệu CSV tồn kho ấn phẩm...');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
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
    let result = books.filter((book) => {
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

    // 4. Sorting
    if (sortOption === 'stock-desc') {
      result = [...result].sort((a, b) => b.availableUnits - a.availableUnits);
    } else if (sortOption === 'stock-asc') {
      result = [...result].sort((a, b) => a.availableUnits - b.availableUnits);
    } else if (sortOption === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [books, searchQuery, categoryFilter, stockFilter, sortOption]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBooks.slice(start, start + rowsPerPage);
  }, [filteredBooks, currentPage, rowsPerPage]);

  // Handlers
  const handleAddBook = (newBookData: Omit<InventoryBook, 'id'>) => {
    const newBook: InventoryBook = {
      ...newBookData,
      id: `inv-${Date.now()}`,
    };
    setBooks((prev) => [newBook, ...prev]);
    displayToast(`Đã thêm thành công ấn phẩm “${newBook.title}” vào kho sách.`);
  };

  const handleSaveEditBook = (updated: InventoryBook) => {
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    displayToast(`Đã cập nhật thông tin ấn phẩm “${updated.title}”.`);
  };

  const handleConfirmDelete = (bookId: string) => {
    const bookToDelete = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    displayToast(`Đã xóa ấn phẩm “${bookToDelete?.title || bookId}” khỏi danh mục kho sách.`);
  };

  const handleExportCsv = () => {
    displayToast('Đang kết xuất tệp CSV dữ liệu kiểm kê kho sách...');
  };

  return (
    <div
      id="admin-inventory-page"
      data-testid="admin-inventory-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-lg"
    >
      {/* 1. Inventory Header with Add CTA */}
      <InventoryHeader
        totalCount={books.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* 2. Search, Filter & Sort Toolbar */}
      <InventoryToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(cat) => {
          setCategoryFilter(cat);
          setCurrentPage(1);
        }}
        stockFilter={stockFilter}
        onStockChange={(stk) => {
          setStockFilter(stk);
          setCurrentPage(1);
        }}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categories={INVENTORY_CATEGORIES}
        onExportCsv={handleExportCsv}
      />

      {/* 3. 8-Column Data Table */}
      <InventoryTable
        books={paginatedBooks}
        onEditBook={(book) => setEditingBook(book)}
        onDeleteBook={(book) => setDeletingBook(book)}
      />

      {/* 4. Pagination Controls */}
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      {/* 5. Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
        categories={INVENTORY_CATEGORIES}
      />

      {/* 6. Edit Book Modal */}
      <EditBookModal
        isOpen={!!editingBook}
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onSaveBook={handleSaveEditBook}
        categories={INVENTORY_CATEGORIES}
      />

      {/* 7. Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingBook}
        book={deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Preserved Dedicated Toast Notification DOM */}
      {isToastVisible && (
        <div
          id="toastNotification"
          data-testid="admin-inventory-toast"
          className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="status"
          aria-live="polite"
        >
          <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">
            info
          </span>
          <span id="toastMessage" data-testid="admin-inventory-toast-message" className="text-body-sm font-medium">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;

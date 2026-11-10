import React, { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, mapFirestoreBookToInventoryBook } from '../services/firebase';
import { useStore } from '../store/useStore';
import { InventoryBook, StockFilterType, SortOptionType } from '../components/admin-inventory/types';
import { InventoryHeader } from '../components/admin-inventory/InventoryHeader';
import { InventoryToolbar } from '../components/admin-inventory/InventoryToolbar';
import { InventoryTable } from '../components/admin-inventory/InventoryTable';
import { InventoryPagination } from '../components/admin-inventory/InventoryPagination';
import { AddBookModal } from '../components/admin-inventory/AddBookModal';
import { EditBookModal } from '../components/admin-inventory/EditBookModal';
import { DeleteConfirmDialog } from '../components/admin-inventory/DeleteConfirmDialog';

const INVENTORY_CATEGORIES = [
  'Khoa học máy tính',
  'Phát triển bản thân',
  'Văn học cổ điển',
  'Tiểu thuyết',
  'Tâm lý học',
];

export const AdminInventory: React.FC = () => {
  const globalShowToast = useStore((state) => state.showToast);

  // Firestore Data State
  const [books, setBooks] = useState<InventoryBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Component state
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
  const [toastMessage, setToastMessage] = useState<string>('');
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

  // Real Firestore Query
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const booksSnap = await getDocs(collection(db, 'Books'));
      const fetchedBooks: InventoryBook[] = booksSnap.docs.map((docSnap) =>
        mapFirestoreBookToInventoryBook(docSnap.data(), docSnap.id)
      );
      setBooks(fetchedBooks);
    } catch (err: any) {
      console.error('[AdminInventory] Error querying Firestore "Books":', err);
      setError('Không thể kết nối đến máy chủ cơ sở dữ liệu kho sách. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

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

      // 2. Category Filter (Supports single or multi-categories)
      const matchesCategory =
        categoryFilter === 'all' ||
        book.category === categoryFilter ||
        Boolean(book.categories && book.categories.includes(categoryFilter));

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
  const handleAddBook = async (newBookData: Omit<InventoryBook, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Books'), {
        title: newBookData.title,
        nameAuthor: newBookData.author,
        categories: [{ id: 'cat-gen', nameCategories: newBookData.category }],
        ISBN12: newBookData.isbn,
        stockQuantity: newBookData.availableUnits,
        originalPrice: newBookData.price,
        salePrice: newBookData.price,
        imgCoverPage: newBookData.coverImage,
        description: newBookData.description || '',
        specifications: {
          publisher: newBookData.publisher,
          releaseDate: `${newBookData.publishYear || 2026}-01-01`,
        },
      });
      const newBook: InventoryBook = { ...newBookData, id: docRef.id };
      setBooks((prev) => [newBook, ...prev]);
      displayToast(`Đã thêm thành công ấn phẩm “${newBook.title}” vào kho sách.`);
    } catch (e) {
      console.error('[AdminInventory] Error adding book to Firestore:', e);
      displayToast('Lỗi khi lưu ấn phẩm lên cơ sở dữ liệu.');
    }
  };

  const handleSaveEditBook = async (updated: InventoryBook) => {
    try {
      await updateDoc(doc(db, 'Books', updated.id), {
        title: updated.title,
        nameAuthor: updated.author,
        stockQuantity: updated.availableUnits,
        salePrice: updated.price,
        ISBN12: updated.isbn,
      });
      setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      displayToast(`Đã cập nhật thông tin ấn phẩm “${updated.title}”.`);
    } catch (e) {
      console.error('[AdminInventory] Error updating book:', e);
      displayToast('Lỗi khi cập nhật ấn phẩm.');
    }
  };

  const handleConfirmDelete = async (bookId: string) => {
    const bookToDelete = books.find((b) => b.id === bookId);
    try {
      await deleteDoc(doc(db, 'Books', bookId));
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      displayToast(`Đã xóa ấn phẩm “${bookToDelete?.title || bookId}” khỏi danh mục kho sách.`);
    } catch (e) {
      console.error('[AdminInventory] Error deleting book:', e);
      displayToast('Lỗi khi xóa ấn phẩm khỏi cơ sở dữ liệu.');
    }
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

      {/* Loading & Error States */}
      {loading ? (
        <div
          id="admin-inventory-loading"
          data-testid="admin-inventory-loading-spinner"
          className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium text-body-md">Đang đồng bộ dữ liệu kho sách từ Firestore...</p>
        </div>
      ) : error ? (
        <div
          id="admin-inventory-error"
          data-testid="admin-inventory-error-state"
          className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center"
        >
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-error font-medium mb-4">{error}</p>
          <button
            onClick={fetchInventory}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        /* 3. 8-Column Data Table */
        <InventoryTable
          books={paginatedBooks}
          onEditBook={(book) => setEditingBook(book)}
          onDeleteBook={(book) => setDeletingBook(book)}
        />
      )}

      {/* 4. Pagination Controls */}
      {!loading && !error && (
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
      )}

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

import React, { useState, useMemo, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, mapFirestoreOrderToFulfillmentOrder } from '../services/firebase';
import { useStore } from '../store/useStore';
import {
  FulfillmentOrder,
  OrdersFilterState,
} from '../components/admin-orders/types';
import { OrdersHeader } from '../components/admin-orders/OrdersHeader';
import { FulfillmentKpisBar } from '../components/admin-orders/FulfillmentKpisBar';
import { OrdersFilterToolbar } from '../components/admin-orders/OrdersFilterToolbar';
import { FulfillmentOrdersTable } from '../components/admin-orders/FulfillmentOrdersTable';
import { CirculationConsoleModal } from '../components/admin-orders/CirculationConsoleModal';

export const AdminOrders: React.FC = () => {
  const showToast = useStore((state) => state.showToast);

  const [orders, setOrders] = useState<FulfillmentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<OrdersFilterState>({
    searchTerm: '',
    statusChip: 'All',
    paymentFilter: 'all',
    fromDate: '2025-10-15',
    toDate: '2025-11-15',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [consoleOrder, setConsoleOrder] = useState<FulfillmentOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'Order'));
      const fetched = snap.docs.map((docSnap) =>
        mapFirestoreOrderToFulfillmentOrder(docSnap.data(), docSnap.id)
      );
      setOrders(fetched);
    } catch (err: any) {
      console.error('[AdminOrders] Error fetching from "Order":', err);
      setError(`Không thể tải dữ liệu đơn hàng luân chuyển từ Firestore (${err?.message || err?.code || 'Lỗi kết nối'}).`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search filter
      if (filterState.searchTerm.trim()) {
        const q = filterState.searchTerm.toLowerCase().trim();
        const matchesId = order.orderNumber.toLowerCase().includes(q);
        const matchesPatron =
          order.patronName.toLowerCase().includes(q) ||
          order.patronEmail.toLowerCase().includes(q);
        const matchesBook = order.books.some((b) => b.title.toLowerCase().includes(q));
        if (!matchesId && !matchesPatron && !matchesBook) return false;
      }

      // 2. Status Chip filter
      if (filterState.statusChip !== 'All') {
        if (order.fulfillmentCycle !== filterState.statusChip) return false;
      }

      // 3. Payment Method filter
      if (
        filterState.paymentFilter === 'vietqr' &&
        order.paymentStatus !== 'VietQR Settled' &&
        order.paymentStatus !== 'Pending VietQR'
      ) {
        return false;
      }
      if (filterState.paymentFilter === 'cod' && order.paymentStatus !== 'COD Settled') {
        return false;
      }

      return true;
    });
  }, [orders, filterState]);

  // Derived / computed sorted orders based on sortOption
  const sortedOrders = useMemo(() => {
    if (sortOption === 'default') {
      return filteredOrders;
    }

    const getMillis = (item: FulfillmentOrder): number => {
      const ts = (item as any).createAt || (item as any).createdAt;
      if (!ts) return 0;
      if (typeof ts.toMillis === 'function') return ts.toMillis();
      if (typeof ts.toDate === 'function') return ts.toDate().getTime();
      if (ts.seconds) return ts.seconds * 1000 + (ts.nanoseconds ? ts.nanoseconds / 1000000 : 0);
      const time = new Date(ts).getTime();
      return isNaN(time) ? 0 : time;
    };

    const getPrice = (item: FulfillmentOrder): number => {
      return Number((item as any).totalPrice ?? item.orderTotalVND ?? 0);
    };

    return [...filteredOrders].sort((a, b) => {
      if (sortOption === 'newest') {
        return getMillis(b) - getMillis(a);
      }
      if (sortOption === 'price_desc') {
        return getPrice(b) - getPrice(a);
      }
      if (sortOption === 'price_asc') {
        return getPrice(a) - getPrice(b);
      }
      return 0;
    });
  }, [filteredOrders, sortOption]);

  // Handlers
  const handleFilterUpdate = (updates: Partial<OrdersFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterState({
      searchTerm: '',
      statusChip: 'All',
      paymentFilter: 'all',
      fromDate: '2025-10-15',
      toDate: '2025-11-15',
    });
    setSortOption('default');
    setCurrentPage(1);
  };

  const handleSyncWebhooks = async () => {
    setIsSyncing(true);
    try {
      await fetchOrders();
      showToast?.('Đồng bộ dữ liệu đơn hàng thành công! Tất cả giao dịch VietQR đã được đối soát.');
    } catch (e) {
      showToast?.('Lỗi khi đồng bộ dữ liệu đơn hàng.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResolveOverdue = (order: FulfillmentOrder) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== order.id) return o;
        return {
          ...o,
          isOverdue: false,
          fineAmountVND: undefined,
          fulfillmentCycle: 'Returned',
          dueSubtext: 'Đã giải quyết quá hạn và miễn phạt',
        };
      })
    );
    showToast?.(`Đã xử lý quá hạn cho đơn hàng ${order.orderNumber} và cập nhật trạng thái.`);
  };

  const handleUpdateOrderFromConsole = (updated: FulfillmentOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    showToast?.(`Đã cập nhật chi tiết điều phối cho đơn hàng ${updated.orderNumber}.`);
  };

  return (
    <div
      id="admin-orders-page"
      data-testid="admin-orders-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-lg"
    >
      {/* 1. Header with Title & Sync Webhook Button */}
      <OrdersHeader onSyncWebhooks={handleSyncWebhooks} isSyncing={isSyncing} />

      {/* 2. Status Summary Pills / KPI Bar (Dynamic) */}
      <FulfillmentKpisBar orders={orders} />

      {/* 3. Filter Toolbar with Search, Status Chips, Payment Select, Date Range & Sorting */}
      <OrdersFilterToolbar
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Loading & Error States */}
      {loading ? (
        <div
          id="admin-orders-loading"
          data-testid="admin-orders-loading-spinner"
          className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium text-body-md">Đang đồng bộ đơn hàng từ Firestore...</p>
        </div>
      ) : error ? (
        <div
          id="admin-orders-error"
          data-testid="admin-orders-error-state"
          className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center"
        >
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-error font-medium mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        /* 4. 7-Column Fulfillment Orders Table */
        <FulfillmentOrdersTable
          orders={sortedOrders}
          totalFulfillmentsCount={orders.length}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          onOpenConsole={(order) => setConsoleOrder(order)}
          onResolveOverdue={handleResolveOverdue}
        />
      )}

      {/* 5. Circulation Console Modal */}
      <CirculationConsoleModal
        isOpen={!!consoleOrder}
        order={consoleOrder}
        onClose={() => setConsoleOrder(null)}
        onUpdateOrder={handleUpdateOrderFromConsole}
      />
    </div>
  );
};

export default AdminOrders;

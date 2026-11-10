import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS, convertTimestampToISO } from '../services/firebase';
import { DashboardHeader } from '../components/admin-dashboard/DashboardHeader';
import { KpiMetricsBento } from '../components/admin-dashboard/KpiMetricsBento';
import { RecentOrdersTable } from '../components/admin-dashboard/RecentOrdersTable';
import { LowStockAlertsCard } from '../components/admin-dashboard/LowStockAlertsCard';
import { StockAlertItem, OrderItem } from '../components/admin-dashboard/types';

export const AdminDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('30');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kpiMetrics, setKpiMetrics] = useState({
    revenue: 0,
    ordersCount: 0,
    booksCount: 0,
    patronsCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlertItem[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksSnap, ordersSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, FIRESTORE_COLLECTIONS.BOOKS)),
        getDocs(collection(db, FIRESTORE_COLLECTIONS.ORDER)),
        getDocs(collection(db, FIRESTORE_COLLECTIONS.USERS)),
      ]);

      // 1. Process Low Stock Alerts (copiesLeft < 10)
      const booksData = booksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const lowStock: StockAlertItem[] = booksData
        .filter((b: any) => (b.stockQuantity ?? b.stockCount ?? 0) < 10)
        .map((b: any) => {
          const copiesLeft = b.stockQuantity ?? b.stockCount ?? 0;
          return {
            id: b.id,
            title: b.title || 'Chưa có tiêu đề',
            author: b.nameAuthor || b.author || 'Tác giả',
            isbn: b.ISBN12 || b.specifications?.isbn || 'N/A',
            copiesLeft,
            coverImage:
              b.imgCoverPage ||
              b.coverImage ||
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
            coverAlt: `Bìa sách ${b.title || ''}`,
            dotColor: copiesLeft <= 2 ? 'bg-error' : 'bg-tertiary',
            alertText:
              copiesLeft === 0
                ? 'Đã hết hàng trong kho'
                : copiesLeft <= 2
                ? `Chỉ còn ${copiesLeft} bản trong kho`
                : `Còn ${copiesLeft} bản trong kho`,
            alertClasses:
              copiesLeft <= 2
                ? 'font-label-sm text-label-sm font-bold text-error'
                : 'font-label-sm text-label-sm font-bold text-tertiary',
          };
        });
      setStockAlerts(lowStock);

      // 2. Process Recent Orders (sorted by createdAt descending, top 5)
      const rawOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rawOrders.sort((a: any, b: any) => {
        const timeA = new Date(convertTimestampToISO(a.createAt || a.createdAt)).getTime();
        const timeB = new Date(convertTimestampToISO(b.createAt || b.createdAt)).getTime();
        return timeB - timeA;
      });

      const mappedRecentOrders: OrderItem[] = rawOrders.slice(0, 5).map((ord: any) => {
        const items = Array.isArray(ord.items) ? ord.items : [];
        const count = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
        const titles = items.map((it: any) => `"${it.title || 'Sách'}"`).slice(0, 2).join(', ');
        const itemSummary =
          count > 0 ? `${count} ấn phẩm • ${titles}${items.length > 2 ? '...' : ''}` : 'Chưa có ấn phẩm';

        const paymentStatus = String(ord.statusPayment || ord.paymentStatus || '').toUpperCase();
        const orderStatus = String(ord.statusOrder || ord.status || '').toUpperCase();

        let badgeLabel = 'Chờ xử lý';
        let badgeClasses =
          'bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';

        if (paymentStatus === 'PAID') {
          badgeLabel = ord.methodPayment === 'COD' ? 'Đã thanh toán COD' : 'Đã thanh toán VietQR';
          badgeClasses =
            'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
        } else if (orderStatus === 'DELIVERED') {
          badgeLabel = 'Đã giao thành công';
          badgeClasses =
            'bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
        } else if (orderStatus === 'SHIPPED') {
          badgeLabel = 'Đang vận chuyển';
          badgeClasses =
            'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
        } else if (paymentStatus === 'PENDING' || orderStatus === 'PROCESSING') {
          badgeLabel = 'Chờ xuất kho';
          badgeClasses =
            'bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
        }

        const dateIso = convertTimestampToISO(ord.createAt || ord.createdAt);
        const dateFormatted = new Date(dateIso).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const displayOrderNumber = ord.codeOrder
          ? ord.codeOrder.startsWith('#')
            ? ord.codeOrder
            : `#${ord.codeOrder.replace(/^ORD-/, '')}`
          : `#${ord.id.substring(0, 6)}`;

        return {
          id: ord.id,
          orderNumber: displayOrderNumber,
          customerName: ord.infoCustom?.cusName || ord.infoCustom?.name || ord.userName || 'Độc giả',
          itemSummary,
          amount: ord.totalPrice ?? ord.totalAmount ?? 0,
          badgeLabel,
          badgeClasses,
          date: dateFormatted,
          gateway: ord.methodPayment === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'VietQR tức thì qua PayOS',
          reference: ord.payosTransactionId || ord.codeOrder || `ORD-${ord.id.substring(0, 8)}`,
        };
      });
      setRecentOrders(mappedRecentOrders);

      // 3. Process KPI Metrics
      const totalRevenue = rawOrders
        .filter((o: any) => String(o.statusPayment || o.paymentStatus || '').toUpperCase() === 'PAID')
        .reduce((sum: number, o: any) => sum + (o.totalPrice ?? o.totalAmount ?? 0), 0);

      const successfulOrders = rawOrders.filter((o: any) => {
        const pay = String(o.statusPayment || o.paymentStatus || '').toUpperCase();
        const stat = String(o.statusOrder || o.status || '').toUpperCase();
        return pay === 'PAID' || stat === 'DELIVERED';
      }).length;

      setKpiMetrics({
        revenue: totalRevenue,
        ordersCount: successfulOrders,
        booksCount: booksSnap.size,
        patronsCount: usersSnap.size,
      });
    } catch (err: any) {
      console.error('[AdminDashboard] Error querying Firestore:', err);
      setError('Không thể kết nối đến máy chủ cơ sở dữ liệu để tải dữ liệu thống kê tổng quan. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      id="admin-dashboard-page"
      data-testid="admin-dashboard-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-xl"
    >
      <DashboardHeader
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {loading ? (
        <div
          id="admin-dashboard-loading"
          data-testid="admin-dashboard-loading-spinner"
          className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium text-body-md">Đang đồng bộ dữ liệu tổng quan từ Firestore...</p>
        </div>
      ) : error ? (
        <div
          id="admin-dashboard-error"
          data-testid="admin-dashboard-error-state"
          className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center"
        >
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-error font-medium mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <KpiMetricsBento
            revenue={kpiMetrics.revenue}
            ordersCount={kpiMetrics.ordersCount}
            booksCount={kpiMetrics.booksCount}
            patronsCount={kpiMetrics.patronsCount}
          />

          <div
            id="dashboard-bottom-grid"
            data-testid="admin-dashboard-bottom-grid"
            className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg"
          >
            <RecentOrdersTable orders={recentOrders} />
            <LowStockAlertsCard alerts={stockAlerts} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

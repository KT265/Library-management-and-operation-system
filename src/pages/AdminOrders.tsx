import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  FulfillmentOrder,
  OrdersFilterState,
  OrderFulfillmentCycle,
} from '../components/admin-orders/types';
import { OrdersHeader } from '../components/admin-orders/OrdersHeader';
import { FulfillmentKpisBar } from '../components/admin-orders/FulfillmentKpisBar';
import { OrdersFilterToolbar } from '../components/admin-orders/OrdersFilterToolbar';
import { FulfillmentOrdersTable } from '../components/admin-orders/FulfillmentOrdersTable';
import { CirculationConsoleModal } from '../components/admin-orders/CirculationConsoleModal';

const DEFAULT_FULFILLMENT_ORDERS: FulfillmentOrder[] = [
  {
    id: 'ord-9842',
    orderNumber: '#ORD-9842',
    dispatchType: 'Nhận tại cửa hàng',
    patronName: 'TS. Emily Vance',
    patronEmail: 'e.vance@mit.edu',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHapRlh5mbWu8i_mnWCQJWaS1zfKfJr0pomj0A8ql3-peLvuVFadlDJJFEDV2VSMXOLq0nAVk1zomVmyWR0R9YSlXL2TYWRf_HKoRZmS2TrHN2_v7ZJA7JzF1lLMUduUJsTVWMiNuh6wT9ZFWPgtmrV6nrdy0SoASN27kNvPFqmdAbSXiiak5LWZ91sO3F7Xq52AqzAUCdP0-URZK2nel6X6N2B7KyvO5jNboE_j64',
    books: [
      {
        title: 'Designing Data-Intensive Applications',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAnS1t9sxFgJPWbU1L436mPSO_xYodqi8MmtvCkV1MUciCJPyinRxOzM4CBeUrtiwYZmuxk5nXun_ZIzdHXxLpLBGWdOh_77-kQmZRrbLCuzGNKYpk6hfBYV77sERw6O27A_fX5Y8_OMeuBek_CBIL1fC4MXk9x8ySwrkTeEEBj-mZShXVAJrqyw7a6kqyFT62opZFsUO6-NQM_QNaPUDOceyhoLpjZHOhcMFy4hbvi',
        quantity: 1,
        orderNote: 'Ấn bản tiêu chuẩn',
      },
    ],
    dueDate: '30 Thg 10, 2025',
    dueSubtext: 'Đang vận chuyển',
    paymentStatus: 'VietQR Settled',
    fulfillmentCycle: 'Delivered',
    orderTotalVND: 360000,
  },
  {
    id: 'ord-9841',
    orderNumber: '#ORD-9841',
    dispatchType: 'Giao hàng tiêu chuẩn',
    patronName: 'Minh Nguyễn',
    patronEmail: 'minh.nguyen@outlook.vn',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Sc11A-az2K2DJ75z-whnKKXPCr8eA1i9PEmV6Z8_5iavt9Qno7SLkxJmNtBo-GTxkghPXHQ37dYNbIMw-Z8OLjbeu5_CSw9ViTzMTOyvgDm7FSdAtG4NDstAJC8CFvuku-BGy3FxfjejTAIYutb9GRclLgQ3_w10i4iTQxB8F-asJ_X4G1iJgZjQhjyDy7L3O7Y2GdelOk2iv3eMvq-mcAXGsM57Bn6elPDRn1Ib',
    books: [
      {
        title: 'Atomic Habits',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDwqymBozqhPBbHCa6GU0WHOKzH3YPTunZV99YjIilgKmuHIsaZChkAnJRnYPigql4qGRzvxKncEuOEzAxbr2L31ploECY_pe4GrqSfullMIzghwSDlOrTzTEFp2nBH4Z20nCf-Gexb_BVORXnZrjqH9RHkY62xTs7yqJWOEYUia_Ma5ZEZkNfLgt3EERFGkGGzFA1J7_L3gKVE9mjoLG1t8jSimskmjqK3nfqECh7U',
        quantity: 2,
        orderNote: 'Mua bán lẻ sở hữu',
      },
    ],
    dueDate: '26 Thg 10, 2025',
    dueSubtext: 'Đã hoàn tất giao đúng hạn',
    paymentStatus: 'VietQR Settled',
    fulfillmentCycle: 'Returned',
    orderTotalVND: 338000,
  },
  {
    id: 'ord-9839',
    orderNumber: '#ORD-9839',
    dispatchType: 'Tủ nhận sách tự động',
    patronName: 'Claire Thorne',
    patronEmail: 'thorne.c@narrative.org',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyN34aVfa-bXwxb1H6LnPzth9UNHynmH5zOdFuCeJ8B4SdEHZIbvVXzEkTLhRV3z3Ch3e7jxN9xLiVmWTVexIpV9cD_Al-sdJaW94UgA0OouTMQ48zYaU3AAjKBU27iE08ILSGZRsPnRGmj36oMSqLqInkvepFuGlARaTT6Wd8fRFNvI7OPCqhnLhxNdkNLQny1EWPsWMFHSyEaXKouQf4Z19SVfU6JK8ew1WuLSyt',
    books: [
      {
        title: 'Klara and the Sun',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC-6UQpcHUiw9xMrnLf_Gq_5Y8B5riiX9VF1M2m6zbylofYdnOEuAUekkW15n14ch2HhGL8NQ25sj13oQf6wk7g8tOxKgBD-M6NZNDkv0gvRUP_UhaYnD7vSg28uaAlBFlubFjXkO-E0pmuu2yV-3Hi_73Sb6MrbE8EWR69VjFF43V_C1g5M8RFHgrvJtOowNPf-jgx4ok396VJaVufB0I4QEdi0DkvET7UwBbCXRVS',
        quantity: 1,
        orderNote: 'Ấn bản tiêu chuẩn',
      },
    ],
    dueDate: '04 Thg 11, 2025',
    dueSubtext: 'Chờ đóng gói xuất kho',
    paymentStatus: 'Pending VietQR',
    fulfillmentCycle: 'Pending',
    orderTotalVND: 185000,
  },
  {
    id: 'ord-9835',
    orderNumber: '#ORD-9835',
    dispatchType: 'Giao hàng hỏa tốc',
    patronName: 'Julian Barnes',
    patronEmail: 'j.barnes@archsystem.io',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxeC-0lmaz0ju3t_j9yl3UQg9PxXxxYPIVcCAO5AgiXJvcObd8ZtJbzu8jtUJBm3MLno_CVmozs9uDq2ZRSi-SZvuilhuKxgLAoHVaaI3WYnVTzo858K8mVGdOfuWynOrQKbRhHNfVYLow_aG5iFsaqGqbkJ1s82T7Qpc0Ey81OgTwe3Wa8qSAGBh_BGx4o-CkysRBTv_c0MVv1gxYFcUImdLuveVvqCwcerrLnvvm',
    books: [
      {
        title: 'The Pragmatic Programmer',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDDdjkNZpjjMAW77nDoMynRJZxUtk2dFVdsyADceY8fYeOTu_IQ9eoIo1bG8i78NrNrF1gxE5_yn79QeTrnDYtTh3OvZ0Qb_uC7Yjybz6zCtB8Z8b0o0Q_7Z8mAYrH9mcSCz5sPEIfHttQ4WWbphK_2Wd-Q4A-sfyK1uGD5bQ-OTIDFlnZ03SJROLcVSybnZwQgQ68BSdBt0pLkufOxXnqeQYhEUfYkJncr4m6NHeWM',
        quantity: 1,
        orderNote: 'Giao nhận tiêu chuẩn',
      },
    ],
    dueDate: '18 Thg 10, 2025',
    dueSubtext: 'Đã hoàn tất giao hàng',
    paymentStatus: 'VietQR Settled',
    fulfillmentCycle: 'Delivered',
    orderTotalVND: 320000,
  },
  {
    id: 'ord-9830',
    orderNumber: '#ORD-9830',
    dispatchType: 'Giao hàng tận nơi',
    patronName: 'Thảo Trần',
    patronEmail: 'thao.tran@polytech.edu.vn',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBslFp4V-fR7ivEhkHa4asRMlun8-CACkdAovSUVpBXe-D8Yym4LYrYvGNEUYWxI9L3eFDQb2gf5FT58trtoaCaLkquQ7oLdeWyZzIHx_WCoj_cSFVwy4DCB8XcW4lLUSYnqb8e4Pei-uZCDKVyFvdK3g4E67_jALZWxsVJZ-v-s1yTI98BoNO0HbvA8dzQdQZpsJU9G__x8p0oQQLYly0M8GiStPHpZ2DU_Fo4fZZ-',
    books: [
      {
        title: 'Clean Architecture',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC0B5EoR8Q55vyjhLtGFslVM9aqDbg2H2N9S_s7-Qf5ECyhI6EovRR9SI0hvsxpXW8D3KOCoCHWobuHvVg_jOPLHu5Xkj8TdX-0NdiqcFitGY0VUBgIBGNYdbS2RqjII28ABa_UcMayKcTJC_KT2SB3ldhFXvmyxVOj1mBGyP-uw18cXa_bYhbDrrSvwKGa8XvcYR4wWwamIIPWgf-Xrer4w0k0bN7ZjT2qBYRQVv7k',
        quantity: 1,
        orderNote: 'Đặt trước ấn bản mới',
      },
    ],
    dueDate: '01 Thg 11, 2025',
    dueSubtext: 'Đang vận chuyển',
    paymentStatus: 'VietQR Settled',
    fulfillmentCycle: 'Delivered',
    orderTotalVND: 280000,
  },
  {
    id: 'ord-9824',
    orderNumber: '#ORD-9824',
    dispatchType: 'Giao hàng tận nhà',
    patronName: 'Alex Nguyễn',
    patronEmail: 'alex.nguyen@craftpress.com',
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJw42WOAuglEX617CuLiMFiwxCPo2yQ2O6IfKQYORHpqyDIRCANaHmTEapU5pMgRybj4mwHqi9USSqG4RbMGPHkeDz57H7YDvVU_RIq7HYhY-vZEaC4LRce6caF7iP4yxBVzoCiIMobeMFOuxEWMuyImi-aga8baIILxwgM62IPT61nH8msfAwenyVqC7FX-z26bcHDkMJ0AYyX5HJW8iNONJzBlTqvU3d5pFn08up',
    books: [
      {
        title: 'Norwegian Wood',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAZyrcBPs0IZ_bqN_IcsUDS6bASzWQ-IUOiIDIfzV_oO-OPG5hvPVdnS9P6FgZxI4ownOKPd72BismjWnD96agmTSSrUhER0SH8m4W0a-qPw000rkyZBu0Th-o4V88Cu7sxNWjNy7ZLoFzlX2m0NWLqV8h1RGyd_m6QinMrZAQU9lVll5UIusBJ7a1TOS1P1pbeLemiloM5ew18zig_xNSmSaHbPF8kZxRAMU9oyaaO',
        quantity: 1,
        orderNote: 'Bộ ấn phẩm bán lẻ',
      },
    ],
    dueDate: '22 Thg 10, 2025',
    dueSubtext: 'Đã hoàn tất lưu kho',
    paymentStatus: 'COD Settled',
    fulfillmentCycle: 'Returned',
    orderTotalVND: 420000,
  },
];

// Generate complementary items to reach 74 total fulfillments matching Stitch spec
const COMPLEMENTARY_ORDERS: FulfillmentOrder[] = Array.from({ length: 68 }, (_, i) => {
  const num = 9823 - i;
  const cycles: OrderFulfillmentCycle[] = ['Returned', 'Delivered', 'Pending', 'Returned'];
  const cycle = cycles[i % cycles.length];
  const paymentStatuses: FulfillmentOrder['paymentStatus'][] = [
    'VietQR Settled',
    'Pending VietQR',
    'COD Settled',
  ];
  return {
    id: `ord-${num}`,
    orderNumber: `#ORD-${num}`,
    dispatchType: i % 2 === 0 ? 'Giao hàng bưu điện' : 'Nhận tại quầy thư viện',
    patronName: `Độc giả ${num}`,
    patronEmail: `patron.${num}@bookverse.vn`,
    patronAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHapRlh5mbWu8i_mnWCQJWaS1zfKfJr0pomj0A8ql3-peLvuVFadlDJJFEDV2VSMXOLq0nAVk1zomVmyWR0R9YSlXL2TYWRf_HKoRZmS2TrHN2_v7ZJA7JzF1lLMUduUJsTVWMiNuh6wT9ZFWPgtmrV6nrdy0SoASN27kNvPFqmdAbSXiiak5LWZ91sO3F7Xq52AqzAUCdP0-URZK2nel6X6N2B7KyvO5jNboE_j64',
    books: [
      {
        title: `Ấn phẩm Tuyển tập #${(i % 12) + 1}`,
        coverImage: '',
        quantity: 1,
        orderNote: 'Lưu hành tiêu chuẩn',
      },
    ],
    dueDate: '15 Thg 11, 2025',
    dueSubtext: cycle === 'Returned' ? 'Đã hoàn tất' : 'Đang xử lý theo lịch',
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    fulfillmentCycle: cycle,
    orderTotalVND: 180000 + (i % 5) * 50000,
  };
});

const COMPLETE_FULFILLMENT_ORDERS: FulfillmentOrder[] = [
  ...DEFAULT_FULFILLMENT_ORDERS,
  ...COMPLEMENTARY_ORDERS,
];

export const AdminOrders: React.FC = () => {
  const showToast = useStore((state) => state.showToast);

  const [orders, setOrders] = useState<FulfillmentOrder[]>(COMPLETE_FULFILLMENT_ORDERS);
  const [filterState, setFilterState] = useState<OrdersFilterState>({
    searchTerm: '',
    statusChip: 'All',
    paymentFilter: 'all',
    fromDate: '2025-10-15',
    toDate: '2025-11-15',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [consoleOrder, setConsoleOrder] = useState<FulfillmentOrder | null>(null);

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
    setCurrentPage(1);
  };

  const handleSyncWebhooks = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast?.('Đồng bộ dữ liệu đơn hàng thành công! Tất cả giao dịch VietQR đã được đối soát.');
    }, 1200);
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

      {/* 2. 4 Status Summary Pills / KPI Bar */}
      <FulfillmentKpisBar />

      {/* 3. Filter Toolbar with Search, Status Chips, Payment Select, Date Range */}
      <OrdersFilterToolbar
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
      />

      {/* 4. 7-Column Fulfillment Orders Table */}
      <FulfillmentOrdersTable
        orders={filteredOrders}
        totalFulfillmentsCount={COMPLETE_FULFILLMENT_ORDERS.length}
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

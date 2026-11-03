import React, { useState, useMemo } from 'react';

export interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  dispatchType: string;
  patronName: string;
  patronEmail: string;
  patronAvatar: string;
  books: {
    title: string;
    coverImage: string;
    quantity: number;
    loanNote: string;
  }[];
  dueDate: string;
  dueSubtext: string;
  paymentStatus: 'Paid via PayOS' | 'Pending VietQR' | 'COD Settled';
  fulfillmentCycle: 'Borrowing' | 'Returned' | 'Pending' | 'Overdue';
  fineAmount?: string;
  isOverdue?: boolean;
}

const DEFAULT_FULFILLMENT_ORDERS: FulfillmentOrder[] = [
  {
    id: 'ord-9842',
    orderNumber: '#ORD-9842',
    dispatchType: 'Desk Pickup',
    patronName: 'Dr. Emily Vance',
    patronEmail: 'e.vance@mit.edu',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHapRlh5mbWu8i_mnWCQJWaS1zfKfJr0pomj0A8ql3-peLvuVFadlDJJFEDV2VSMXOLq0nAVk1zomVmyWR0R9YSlXL2TYWRf_HKoRZmS2TrHN2_v7ZJA7JzF1lLMUduUJsTVWMiNuh6wT9ZFWPgtmrV6nrdy0SoASN27kNvPFqmdAbSXiiak5LWZ91sO3F7Xq52AqzAUCdP0-URZK2nel6X6N2B7KyvO5jNboE_j64',
    books: [
      {
        title: 'Designing Data-Intensive Applications',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnS1t9sxFgJPWbU1L436mPSO_xYodqi8MmtvCkV1MUciCJPyinRxOzM4CBeUrtiwYZmuxk5nXun_ZIzdHXxLpLBGWdOh_77-kQmZRrbLCuzGNKYpk6hfBYV77sERw6O27A_fX5Y8_OMeuBek_CBIL1fC4MXk9x8ySwrkTeEEBj-mZShXVAJrqyw7a6kqyFT62opZFsUO6-NQM_QNaPUDOceyhoLpjZHOhcMFy4hbvi',
        quantity: 1,
        loanNote: 'Hardcover loan',
      },
    ],
    dueDate: 'Oct 30, 2025',
    dueSubtext: '3 days remaining',
    paymentStatus: 'Paid via PayOS',
    fulfillmentCycle: 'Borrowing',
  },
  {
    id: 'ord-9841',
    orderNumber: '#ORD-9841',
    dispatchType: 'Courier Standard',
    patronName: 'Minh Nguyen',
    patronEmail: 'minh.nguyen@outlook.vn',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Sc11A-az2K2DJ75z-whnKKXPCr8eA1i9PEmV6Z8_5iavt9Qno7SLkxJmNtBo-GTxkghPXHQ37dYNbIMw-Z8OLjbeu5_CSw9ViTzMTOyvgDm7FSdAtG4NDstAJC8CFvuku-BGy3FxfjejTAIYutb9GRclLgQ3_w10i4iTQxB8F-asJ_X4G1iJgZjQhjyDy7L3O7Y2GdelOk2iv3eMvq-mcAXGsM57Bn6elPDRn1Ib',
    books: [
      {
        title: 'Atomic Habits',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwqymBozqhPBbHCa6GU0WHOKzH3YPTunZV99YjIilgKmuHIsaZChkAnJRnYPigql4qGRzvxKncEuOEzAxbr2L31ploECY_pe4GrqSfullMIzghwSDlOrTzTEFp2nBH4Z20nCf-Gexb_BVORXnZrjqH9RHkY62xTs7yqJWOEYUia_Ma5ZEZkNfLgt3EERFGkGGzFA1J7_L3gKVE9mjoLG1t8jSimskmjqK3nfqECh7U',
        quantity: 2,
        loanNote: 'Retail Purchase',
      },
    ],
    dueDate: 'Oct 26, 2025',
    dueSubtext: 'Delivered on time',
    paymentStatus: 'Paid via PayOS',
    fulfillmentCycle: 'Returned',
  },
  {
    id: 'ord-9839',
    orderNumber: '#ORD-9839',
    dispatchType: 'Locker Dispatch',
    patronName: 'Claire Thorne',
    patronEmail: 'thorne.c@narrative.org',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyN34aVfa-bXwxb1H6LnPzth9UNHynmH5zOdFuCeJ8B4SdEHZIbvVXzEkTLhRV3z3Ch3e7jxN9xLiVmWTVexIpV9cD_Al-sdJaW94UgA0OouTMQ48zYaU3AAjKBU27iE08ILSGZRsPnRGmj36oMSqLqInkvepFuGlARaTT6Wd8fRFNvI7OPCqhnLhxNdkNLQny1EWPsWMFHSyEaXKouQf4Z19SVfU6JK8ew1WuLSyt',
    books: [
      {
        title: 'Klara and the Sun',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-6UQpcHUiw9xMrnLf_Gq_5Y8B5riiX9VF1M2m6zbylofYdnOEuAUekkW15n14ch2HhGL8NQ25sj13oQf6wk7g8tOxKgBD-M6NZNDkv0gvRUP_UhaYnD7vSg28uaAlBFlubFjXkO-E0pmuu2yV-3Hi_73Sb6MrbE8EWR69VjFF43V_C1g5M8RFHgrvJtOowNPf-jgx4ok396VJaVufB0I4QEdi0DkvET7UwBbCXRVS',
        quantity: 1,
        loanNote: '21-day loan',
      },
    ],
    dueDate: 'Nov 04, 2025',
    dueSubtext: 'Awaiting dispatch',
    paymentStatus: 'Pending VietQR',
    fulfillmentCycle: 'Pending',
  },
  {
    id: 'ord-9835',
    orderNumber: '#ORD-9835',
    dispatchType: 'Circulation Desk',
    patronName: 'Julian Barnes',
    patronEmail: 'j.barnes@archsystem.io',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxeC-0lmaz0ju3t_j9yl3UQg9PxXxxYPIVcCAO5AgiXJvcObd8ZtJbzu8jtUJBm3MLno_CVmozs9uDq2ZRSi-SZvuilhuKxgLAoHVaaI3WYnVTzo858K8mVGdOfuWynOrQKbRhHNfVYLow_aG5iFsaqGqbkJ1s82T7Qpc0Ey81OgTwe3Wa8qSAGBh_BGx4o-CkysRBTv_c0MVv1gxYFcUImdLuveVvqCwcerrLnvvm',
    books: [
      {
        title: 'The Pragmatic Programmer',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDdjkNZpjjMAW77nDoMynRJZxUtk2dFVdsyADceY8fYeOTu_IQ9eoIo1bG8i78NrNrF1gxE5_yn79QeTrnDYtTh3OvZ0Qb_uC7Yjybz6zCtB8Z8b0o0Q_7Z8mAYrH9mcSCz5sPEIfHttQ4WWbphK_2Wd-Q4A-sfyK1uGD5bQ-OTIDFlnZ03SJROLcVSybnZwQgQ68BSdBt0pLkufOxXnqeQYhEUfYkJncr4m6NHeWM',
        quantity: 1,
        loanNote: 'Standard loan',
      },
    ],
    dueDate: 'Oct 18, 2025',
    dueSubtext: 'Expired (7 days late)',
    paymentStatus: 'Paid via PayOS',
    fulfillmentCycle: 'Overdue',
    fineAmount: '$4.50',
    isOverdue: true,
  },
  {
    id: 'ord-9830',
    orderNumber: '#ORD-9830',
    dispatchType: 'Campus Hub',
    patronName: 'Thao Tran',
    patronEmail: 'thao.tran@polytech.edu.vn',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBslFp4V-fR7ivEhkHa4asRMlun8-CACkdAovSUVpBXe-D8Yym4LYrYvGNEUYWxI9L3eFDQb2gf5FT58trtoaCaLkquQ7oLdeWyZzIHx_WCoj_cSFVwy4DCB8XcW4lLUSYnqb8e4Pei-uZCDKVyFvdK3g4E67_jALZWxsVJZ-v-s1yTI98BoNO0HbvA8dzQdQZpsJU9G__x8p0oQQLYly0M8GiStPHpZ2DU_Fo4fZZ-',
    books: [
      {
        title: 'Clean Architecture',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0B5EoR8Q55vyjhLtGFslVM9aqDbg2H2N9S_s7-Qf5ECyhI6EovRR9SI0hvsxpXW8D3KOCoCHWobuHvVg_jOPLHu5Xkj8TdX-0NdiqcFitGY0VUBgIBGNYdbS2RqjII28ABa_UcMayKcTJC_KT2SB3ldhFXvmyxVOj1mBGyP-uw18cXa_bYhbDrrSvwKGa8XvcYR4wWwamIIPWgf-Xrer4w0k0bN7ZjT2qBYRQVv7k',
        quantity: 1,
        loanNote: '14-day loan',
      },
    ],
    dueDate: 'Nov 01, 2025',
    dueSubtext: '5 days remaining',
    paymentStatus: 'Paid via PayOS',
    fulfillmentCycle: 'Borrowing',
  },
  {
    id: 'ord-9824',
    orderNumber: '#ORD-9824',
    dispatchType: 'Home Courier',
    patronName: 'Alex Nguyen',
    patronEmail: 'alex.nguyen@craftpress.com',
    patronAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJw42WOAuglEX617CuLiMFiwxCPo2yQ2O6IfKQYORHpqyDIRCANaHmTEapU5pMgRybj4mwHqi9USSqG4RbMGPHkeDz57H7YDvVU_RIq7HYhY-vZEaC4LRce6caF7iP4yxBVzoCiIMobeMFOuxEWMuyImi-aga8baIILxwgM62IPT61nH8msfAwenyVqC7FX-z26bcHDkMJ0AYyX5HJW8iNONJzBlTqvU3d5pFn08up',
    books: [
      {
        title: 'Norwegian Wood',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZyrcBPs0IZ_bqN_IcsUDS6bASzWQ-IUOiIDIfzV_oO-OPG5hvPVdnS9P6FgZxI4ownOKPd72BismjWnD96agmTSSrUhER0SH8m4W0a-qPw000rkyZBu0Th-o4V88Cu7sxNWjNy7ZLoFzlX2m0NWLqV8h1RGyd_m6QinMrZAQU9lVll5UIusBJ7a1TOS1P1pbeLemiloM5ew18zig_xNSmSaHbPF8kZxRAMU9oyaaO',
        quantity: 1,
        loanNote: 'Retail & Loan bundle',
      },
      {
        title: 'Invisible Cities',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUmmc03pFV0RP0gBY2eoU-yOqbHy9FPT6JBrCzUrNWr71OBsS2hNmIIm7MGuNSvhL-NWV98N8hZ-TgPNxRaoyNaUEARdMPlGbnJtnE8ELbwJU7z1iCcF5AdWFSH6Xr5VUOAs4d1t9jJNkgQNtCM1Ql8RelT_NjF_fX9GivRhSHTlZZz5EQoD7im4VQNW4KxZpni2Z0MN_CFr2qaIepU4q3y0ghzYyZ70h5og1fA7pp',
        quantity: 1,
        loanNote: 'Retail & Loan bundle',
      },
    ],
    dueDate: 'Oct 22, 2025',
    dueSubtext: 'Restocked to depot',
    paymentStatus: 'COD Settled',
    fulfillmentCycle: 'Returned',
  },
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<FulfillmentOrder[]>(DEFAULT_FULFILLMENT_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusChip, setStatusChip] = useState<'All' | 'Pending' | 'Returned' | 'Overdue'>('All');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'payos' | 'vietqr' | 'cod'>('all');
  const [fromDate, setFromDate] = useState('2025-10-15');
  const [toDate, setToDate] = useState('2025-11-15');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FulfillmentOrder | null>(null);
  const [selectedAction, setSelectedAction] = useState<'dispatched' | 'returned' | 'waive_fine' | 'retrigger_payos'>('returned');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Open Circulation Action Console Modal
  const openStatusModal = (order: FulfillmentOrder) => {
    setActiveOrder(order);
    setSelectedAction(order.fulfillmentCycle === 'Overdue' ? 'waive_fine' : 'returned');
    setIsModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsModalOpen(false);
    setActiveOrder(null);
  };

  // Confirm State Transition Action
  const confirmAction = () => {
    if (!activeOrder) return;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== activeOrder.id) return ord;

        if (selectedAction === 'dispatched') {
          return {
            ...ord,
            fulfillmentCycle: 'Borrowing',
            dueSubtext: 'In transit to patron',
          };
        } else if (selectedAction === 'returned') {
          return {
            ...ord,
            fulfillmentCycle: 'Returned',
            dueSubtext: 'Restocked to depot',
            isOverdue: false,
            fineAmount: undefined,
          };
        } else if (selectedAction === 'waive_fine') {
          return {
            ...ord,
            fineAmount: undefined,
            isOverdue: false,
            dueSubtext: 'Fine waived by curator',
          };
        } else if (selectedAction === 'retrigger_payos') {
          return {
            ...ord,
            paymentStatus: 'Paid via PayOS',
          };
        }
        return ord;
      })
    );

    showToast('Fulfillment cycle updated successfully');
    closeStatusModal();
  };

  const syncWebhooks = () => {
    showToast('VietQR & PayOS transaction webhook sync completed');
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = order.orderNumber.toLowerCase().includes(query);
        const matchesPatron = order.patronName.toLowerCase().includes(query) || order.patronEmail.toLowerCase().includes(query);
        const matchesBook = order.books.some((b) => b.title.toLowerCase().includes(query));
        if (!matchesId && !matchesPatron && !matchesBook) return false;
      }

      // Status chip
      if (statusChip !== 'All') {
        if (order.fulfillmentCycle !== statusChip) return false;
      }

      // Payment filter
      if (paymentFilter === 'payos' && order.paymentStatus !== 'Paid via PayOS') return false;
      if (paymentFilter === 'vietqr' && order.paymentStatus !== 'Pending VietQR') return false;
      if (paymentFilter === 'cod' && order.paymentStatus !== 'COD Settled') return false;

      return true;
    });
  }, [orders, searchTerm, statusChip, paymentFilter]);

  // Dynamic KPI counts
  const awaitingCount = orders.filter((o) => o.fulfillmentCycle === 'Pending').length + 11; // 12 total target
  const activeCount = orders.filter((o) => o.fulfillmentCycle === 'Borrowing').length + 46; // 48 target
  const overdueCount = orders.filter((o) => o.fulfillmentCycle === 'Overdue' || o.isOverdue).length + 4; // 5 target

  return (
    <div className="flex flex-col w-full pb-space-lg">
      {/* Top Banner / Operations Header with subtle editorial accent */}
      <div className="relative w-full pt-space-lg pb-space-xl flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
        <div className="space-y-space-xs max-w-3xl">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            Order Fulfillment
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Track physical dispatches, patron borrow cycles, returns
          </p>
        </div>
      </div>

      {/* Metric Summary Cards (M3 Elevated & Tonal Grid) */}
      <div className="grid grid-cols-1 gap-gutter mb-space-xl md:grid-cols-3 w-full">
        {/* Card 1: Awaiting Dispatch */}
        <div className="p-space-lg rounded-DEFAULT bg-surface-container-lowest shadow-[0_1px_3px_0px_rgba(26,54,93,0.04),0_1px_2px_-1px_rgba(26,54,93,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                Awaiting Dispatch
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                  {awaitingCount}
                </span>
                <span className="font-title-sm text-title-sm text-secondary">orders</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-secondary"></div>
        </div>

        {/* Card 2: Active Borrowings */}
        <div className="p-space-lg rounded-DEFAULT bg-surface-container-lowest shadow-[0_1px_3px_0px_rgba(26,54,93,0.04),0_1px_2px_-1px_rgba(26,54,93,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                Active Borrowings
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                  {activeCount}
                </span>
                <span className="font-title-sm text-title-sm text-secondary">volumes</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">auto_stories</span>
            </div>
          </div>
        </div>

        {/* Card 3: Overdue Returns */}
        <div className="p-space-lg rounded-DEFAULT bg-surface-container-lowest shadow-[0_1px_3px_0px_rgba(26,54,93,0.04),0_1px_2px_-1px_rgba(26,54,93,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                Overdue Returns
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display-md text-display-md font-bold text-tertiary-container tracking-tight">
                  {overdueCount}
                </span>
                <span className="font-title-sm text-title-sm text-secondary">patrons flagged</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm"></div>
        </div>
      </div>

      {/* Filter & Search Toolbar (M3 Surface Container Low) */}
      <div className="w-full bg-surface-container-low p-space-md rounded-DEFAULT mb-space-lg flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
        {/* Search and Direct Criteria */}
        <div className="flex flex-col sm:flex-row items-center gap-space-md flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 flex items-center bg-surface-container-lowest rounded-full px-space-md py-2.5 shadow-sm">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input
              id="orderSearchInput"
              type="search"
              placeholder="Filter by Order ID or Patron..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
            {(['All', 'Pending', 'Returned', 'Overdue'] as const).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setStatusChip(chip)}
                className={`filter-chip px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
                  statusChip === chip
                    ? 'active-filter bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters & Refresh */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm justify-between xl:justify-end">
          {/* Payment Method Dropdown */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="appearance-none bg-surface-container-lowest rounded-full pl-4 pr-10 py-2.5 font-label-sm text-label-sm text-on-surface shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="all">Payment: All Methods</option>
              <option value="payos">Paid via PayOS</option>
              <option value="vietqr">Pending VietQR</option>
              <option value="cod">COD (Cash on Delivery)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-2.5 text-secondary text-[18px]">
              expand_more
            </span>
          </div>

          {/* Refresh / Sync VietQR Status */}
          <button
            type="button"
            title="Sync Webhooks"
            onClick={syncWebhooks}
            className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors shadow-sm active:rotate-180"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector Toolbar (Vietnamese Copy) */}
      <div className="w-full bg-surface-container-low px-space-md py-3 rounded-DEFAULT mb-space-lg flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-2 text-secondary font-label-md text-label-md">
            <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
            <span className="font-semibold text-on-surface">Khoảng thời gian:</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-2">
              <label htmlFor="fromDateInput" className="font-label-sm text-label-sm text-secondary whitespace-nowrap">
                Từ ngày
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-full px-3 py-1.5 shadow-sm border border-transparent focus-within:border-primary">
                <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">calendar_month</span>
                <input
                  id="fromDateInput"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none w-32 cursor-pointer"
                />
              </div>
            </div>
            <span className="text-outline text-label-sm">—</span>
            <div className="flex items-center gap-2">
              <label htmlFor="toDateInput" className="font-label-sm text-label-sm text-secondary whitespace-nowrap">
                Đến ngày
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-full px-3 py-1.5 shadow-sm border border-transparent focus-within:border-primary">
                <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">event</span>
                <input
                  id="toDateInput"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none w-32 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Orders Data Table Container */}
      <div className="relative w-full rounded-DEFAULT bg-surface-container-lowest shadow-[0_1px_3px_0px_rgba(26,54,93,0.04),0_1px_2px_-1px_rgba(26,54,93,0.03)] overflow-hidden">
        <div className="overflow-x-auto min-h-[460px]">
          <table className="w-full text-left border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold whitespace-nowrap min-w-0">Order ID</th>
                <th className="py-3 px-space-md font-semibold">Patron / User</th>
                <th className="py-3 px-space-md font-semibold">Book List &amp; Volumes</th>
                <th className="py-3 px-space-md font-semibold">Due / Delivery Date</th>
                <th className="py-3 px-space-md font-semibold">Payment Status</th>
                <th className="py-3 px-space-md font-semibold">Fulfillment Cycle</th>
                <th className="py-3 px-space-md font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y-0 text-on-surface font-body-md">
              {filteredOrders.map((order) => {
                const isOverdue = order.isOverdue || order.fulfillmentCycle === 'Overdue';

                return (
                  <tr
                    key={order.id}
                    className={`transition-colors group ${
                      isOverdue
                        ? 'bg-error-container/10 hover:bg-error-container/20'
                        : 'hover:bg-surface-container-low/70 bg-surface-container-lowest'
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span
                        className={`select-all font-title-sm text-title-sm font-bold ${
                          isOverdue ? 'text-tertiary' : 'text-primary'
                        }`}
                      >
                        {order.orderNumber}
                      </span>
                      <span
                        className={`block font-body-sm text-body-sm font-normal ${
                          isOverdue ? 'text-tertiary-fixed-dim' : 'text-secondary'
                        }`}
                      >
                        {order.dispatchType}
                      </span>
                    </td>

                    {/* Patron / User */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <img
                          src={order.patronAvatar}
                          alt={order.patronName}
                          className="w-9 h-9 rounded-full object-cover shrink-0 bg-surface-container-high"
                        />
                        <div className="min-w-0">
                          <p className="font-title-sm text-title-sm font-semibold text-on-surface truncate">
                            {order.patronName}
                          </p>
                          <p className="font-body-sm text-body-sm text-secondary truncate">
                            {order.patronEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Book List & Volumes */}
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-3">
                        {order.books.length > 1 ? (
                          <div className="flex -space-x-4 shrink-0">
                            {order.books.map((b, idx) => (
                              <div
                                key={idx}
                                className="relative w-8 h-11 rounded overflow-hidden shadow-sm ring-2 ring-surface-container-lowest"
                              >
                                <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative w-8 h-11 shrink-0 rounded overflow-hidden shadow-sm">
                            <img
                              src={order.books[0].coverImage}
                              alt={order.books[0].title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 max-w-xs">
                          <p className="font-title-sm text-title-sm text-on-surface font-medium truncate">
                            {order.books.map((b) => b.title).join(', ')}
                          </p>
                          <span className="inline-block font-label-sm text-label-sm text-secondary">
                            Qty: {order.books.reduce((acc, b) => acc + b.quantity, 0)}x •{' '}
                            {order.books[0].loanNote}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Due / Delivery Date */}
                    <td className="py-3.5 px-space-md whitespace-nowrap">
                      <span
                        className={`font-title-sm text-title-sm block ${
                          isOverdue ? 'text-error font-bold' : 'text-on-surface font-medium'
                        }`}
                      >
                        {order.dueDate}
                      </span>
                      <span
                        className={`font-body-sm text-body-sm ${
                          isOverdue ? 'text-tertiary font-medium' : 'text-secondary'
                        }`}
                      >
                        {order.dueSubtext}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-3.5 px-space-md whitespace-nowrap">
                      {order.paymentStatus === 'Paid via PayOS' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          <span
                            className="material-symbols-outlined text-[15px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          Paid via PayOS
                        </span>
                      )}
                      {order.paymentStatus === 'Pending VietQR' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[15px]">pending</span>
                          Pending VietQR
                        </span>
                      )}
                      {order.paymentStatus === 'COD Settled' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[15px]">local_atm</span>
                          COD Settled
                        </span>
                      )}
                    </td>

                    {/* Fulfillment Cycle Badge */}
                    <td className="py-3.5 px-space-md whitespace-nowrap">
                      {order.fulfillmentCycle === 'Borrowing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[15px]">menu_book</span>
                          Borrowing
                        </span>
                      )}
                      {order.fulfillmentCycle === 'Returned' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                          <span
                            className="material-symbols-outlined text-[15px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            assignment_turned_in
                          </span>
                          Returned
                        </span>
                      )}
                      {order.fulfillmentCycle === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[15px]">schedule</span>
                          Pending
                        </span>
                      )}
                      {order.fulfillmentCycle === 'Overdue' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[15px]">report_problem</span>
                          Overdue {order.fineAmount && `(Fine: ${order.fineAmount})`}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-space-md text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {isOverdue ? (
                          <button
                            type="button"
                            onClick={() => openStatusModal(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary text-on-tertiary hover:bg-tertiary-container font-label-sm text-label-sm transition-colors shadow-sm"
                          >
                            <span>Resolve</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openStatusModal(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-colors"
                          >
                            <span>Update</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                          </button>
                        )}
                        <button
                          type="button"
                          title="Inspect Order Details"
                          onClick={() => showToast(`Inspecting ${order.orderNumber} line items`)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* M3 Pagination Controls Bar */}
        <div className="py-3.5 px-space-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md text-body-sm font-body-sm text-secondary">
            <span>
              Showing <strong className="font-semibold text-on-surface">1 - {filteredOrders.length}</strong> of{' '}
              <strong className="font-semibold text-on-surface">74</strong> fulfillments
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <span>Rows per page:</span>
              <select className="bg-surface-container-lowest rounded-full px-2 py-1 font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline opacity-40 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">first_page</span>
            </button>
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full flex items-center justify-center text-outline opacity-40 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center shadow-sm"
            >
              1
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center transition-colors"
            >
              3
            </button>
            <span className="px-1 text-outline">…</span>
            <button
              type="button"
              className="w-9 h-9 rounded-full hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center transition-colors"
            >
              8
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Circulation Action Console Modal (#statusModal) */}
      {isModalOpen && activeOrder && (
        <div id="statusModal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Scrim / Backdrop */}
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
            onClick={closeStatusModal}
          />

          {/* Modal Content Card */}
          <div className="relative w-full max-w-lg rounded-lg bg-surface-container-lowest p-space-xl shadow-[0_20px_25px_-5px_rgba(26,54,93,0.12),0_8px_10px_-6px_rgba(26,54,93,0.06)] transform transition-all animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-space-md">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Circulation Action Console
                </span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary" id="modalOrderTitle">
                  Update {activeOrder.orderNumber}
                </h2>
                <p className="font-body-sm text-body-sm text-secondary" id="modalOrderSubtitle">
                  Patron: {activeOrder.patronName} • Volume: {activeOrder.books[0]?.title}
                </p>
              </div>
              <button
                type="button"
                onClick={closeStatusModal}
                className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Action Selectors */}
            <div className="space-y-space-sm pt-space-xs pb-space-lg">
              {/* Option 1: Dispatched */}
              <label className="flex items-center gap-space-md p-space-md rounded-DEFAULT bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="orderAction"
                  value="dispatched"
                  checked={selectedAction === 'dispatched'}
                  onChange={() => setSelectedAction('dispatched')}
                  className="w-4 h-4 text-primary accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <span className="font-title-sm text-title-sm text-on-surface block font-semibold">
                    Mark as Dispatched
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    Notify courier and release volume from depot shelf.
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
              </label>

              {/* Option 2: Confirm Return */}
              <label className="flex items-center gap-space-md p-space-md rounded-DEFAULT bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="orderAction"
                  value="returned"
                  checked={selectedAction === 'returned'}
                  onChange={() => setSelectedAction('returned')}
                  className="w-4 h-4 text-primary accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <span className="font-title-sm text-title-sm text-on-surface block font-semibold">
                    Confirm Return &amp; Restock
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    Perform book condition check and release borrower lock.
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
              </label>

              {/* Option 3: Waive Fine (Contextual for Overdue) */}
              {(activeOrder.isOverdue || activeOrder.fulfillmentCycle === 'Overdue') && (
                <label
                  id="waiveFineOption"
                  className="flex items-center gap-space-md p-space-md rounded-DEFAULT bg-tertiary-fixed/40 hover:bg-tertiary-fixed/60 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="orderAction"
                    value="waive_fine"
                    checked={selectedAction === 'waive_fine'}
                    onChange={() => setSelectedAction('waive_fine')}
                    className="w-4 h-4 text-tertiary accent-tertiary cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="font-title-sm text-title-sm text-tertiary block font-semibold">
                      Waive Late Penalty Fine
                    </span>
                    <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
                      Authorized curator exemption for late patron returns.
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">money_off</span>
                </label>
              )}

              {/* Option 4: Re-trigger PayOS Webhook */}
              <label className="flex items-center gap-space-md p-space-md rounded-DEFAULT bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="orderAction"
                  value="retrigger_payos"
                  checked={selectedAction === 'retrigger_payos'}
                  onChange={() => setSelectedAction('retrigger_payos')}
                  className="w-4 h-4 text-primary accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <span className="font-title-sm text-title-sm text-on-surface block font-semibold">
                    Re-trigger PayOS Webhook Check
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    Manually query VietQR transaction hash with NAPAS provider.
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">sync</span>
              </label>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-space-sm pt-space-md">
              <button
                type="button"
                onClick={closeStatusModal}
                className="h-11 px-5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                className="h-11 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-colors"
              >
                Confirm State Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-5 py-3 rounded-full font-label-lg text-label-lg shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

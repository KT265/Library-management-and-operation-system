import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  itemSummary: string;
  amount: string;
  badgeLabel: string;
  badgeClasses: string;
  date: string;
  gateway: string;
  reference: string;
}

interface StockAlertItem {
  title: string;
  author: string;
  isbn: string;
  copiesLeft: number;
  coverImage: string;
  coverAlt: string;
  dotColor: string;
  alertText: string;
  alertClasses: string;
}

const RECENT_ORDERS: OrderItem[] = [
  {
    id: 'ord-924',
    orderNumber: '#924',
    customerName: 'Claire Thorne',
    itemSummary: '2 items • "The Great Gatsby", "Beloved"',
    amount: '$54.20',
    badgeLabel: 'VietQR Paid',
    badgeClasses: 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2 py-0.2 rounded-full font-bold',
    date: 'Today, 10:42 AM',
    gateway: 'VietQR via PayOS (Instant Settlement)',
    reference: 'VQR-2026-924',
  },
  {
    id: 'ord-923',
    orderNumber: '#923',
    customerName: 'Minh Nguyen',
    itemSummary: '1 item • "Kafka on the Shore"',
    amount: '$22.00',
    badgeLabel: 'Fulfillment Pending',
    badgeClasses: 'bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-2 py-0.2 rounded-full font-bold',
    date: 'Today, 09:15 AM',
    gateway: 'PayOS Webhook Pending Dispatch',
    reference: 'ORD-2026-923',
  },
  {
    id: 'ord-922',
    orderNumber: '#922',
    customerName: 'Julian Barnes',
    itemSummary: '3 items • Collector Folio Series',
    amount: '$118.50',
    badgeLabel: 'Shipped',
    badgeClasses: 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2 py-0.2 rounded-full font-bold',
    date: 'Yesterday, 16:30 PM',
    gateway: 'VietQR Express Settlement',
    reference: 'VNPOST-884920',
  },
  {
    id: 'ord-921',
    orderNumber: '#921',
    customerName: 'Thao Tran',
    itemSummary: '1 item • "Dune: Deluxe Edition"',
    amount: '$45.00',
    badgeLabel: 'Delivered',
    badgeClasses: 'bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm px-2 py-0.2 rounded-full font-bold',
    date: 'Oct 30, 2026, 14:05 PM',
    gateway: 'COD / Standard Courier Delivered',
    reference: 'COD-2026-921',
  },
];

const STOCK_ALERTS: StockAlertItem[] = [
  {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    isbn: '978-0307744661',
    copiesLeft: 2,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-tjGNFabNIRWPpQbea61qHTfRUKjfJEjhnYgcttODLs43injb6bB0vOv9AuOw3ZJTNRbBSk5TBGZibQeuILerlB893SFDBWXF5HOPgUsm-OXOSxXsvLwvBLqc8Yfd13PrZZc_OOWLUUOUACwa39gmzHewA_aE3bbC_uRw4uwvFmpSaHKT34WIQPoIQ_xm4QbeM7LCvZ2qsyu09PsdFgntn1m1kRW4CWGw8ovUKfYM',
    coverAlt:
      'Cover of Norwegian Wood novel by Haruki Murakami, minimalist typographic layout in red and deep navy on matte book paper.',
    dotColor: 'bg-error',
    alertText: 'Only 2 copies remaining',
    alertClasses: 'font-label-sm text-label-sm font-bold text-error',
  },
  {
    title: 'Piranesi (Hardcover)',
    author: 'Susanna Clarke',
    isbn: '978-1635575637',
    copiesLeft: 3,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDo6MYjfBSW8u2ZoP0V4pVcL5OK8JTBdAh4ur7rJGR7ue_wLPUOnBvm48p9C6Rk74cwdhRrJjY81M8H7Waxq89dbY0p_wZE4cl9opT1oBoHetjHOAfnkd3SYWG3lVA-E75JmByOBpPBRE7CQzpMchT6O0lpimsBG1-xe84T-N69SQ7FMF9IValngwU1yyQzg6X9vrjwByV3RVXH4K26CFayXZeB6lZ7sntAkbQvTpY',
    coverAlt:
      'Cover of Piranesi by Susanna Clarke, classic marbled paper texture aesthetic with celestial engraving on deep sea blue background.',
    dotColor: 'bg-tertiary',
    alertText: '3 copies remaining',
    alertClasses: 'font-label-sm text-label-sm font-bold text-tertiary',
  },
  {
    title: 'Invisible Cities',
    author: 'Italo Calvino',
    isbn: '978-0156453806',
    copiesLeft: 1,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAorltsVX6b6skd2IsRHxQdS7tiTHKpvJQKV98W28tWjOIgmGrAHrfa3URQKnL52FCaUhzon6wtWG5tsxhhvozflN7ePtw_STOwj8Og2Y6WCbQxbnSKts31gJo9oZnLPqIpz9y5UCKI0VkAmJnoik6NSlYbPs1cd3-DbNd_ay26BiuvAMmb_DzUzMqhk5gHER9zqLM0RgwZvBzjR700VdftEQzRsyvUkEkeLa9jb1aQ',
    coverAlt:
      'Cover of Invisible Cities by Italo Calvino, architectural drawing inspired fine art book edition with subtle silver foil.',
    dotColor: 'bg-error',
    alertText: 'Only 1 copy remaining',
    alertClasses: 'font-label-sm text-label-sm font-bold text-error',
  },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedRange, setSelectedRange] = useState('30');
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'copies'>('revenue');
  const [inspectedOrder, setInspectedOrder] = useState<OrderItem | null>(null);

  return (
    <div className="flex flex-col w-full pb-space-xxl space-y-space-xl">
      {/* Top Action & View Control Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <h1
            className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Admin Overview &amp; Sales Analytics
          </h1>
        </div>

        {/* Actions: Date Range Selector Pill */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="relative inline-flex items-center bg-surface-container-lowest rounded-full px-space-md py-2 shadow-sm text-on-surface">
            <span className="material-symbols-outlined text-outline text-[18px] mr-2">
              calendar_today
            </span>
            <select
              id="date-range-select"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-transparent font-label-lg text-label-lg text-on-surface focus:outline-none cursor-pointer appearance-none pr-6"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last Quarter (Q3)</option>
              <option value="365">Year to Date (2024)</option>
            </select>
            <span className="material-symbols-outlined text-outline text-[16px] absolute right-3 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: Revenue */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary-container/40 blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                $48,290.00
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
              <span className="inline-flex items-center text-primary-container font-semibold bg-secondary-fixed px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                +14.2%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Catalog Count */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
              Catalog Titles
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">library_books</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                1,842
              </span>
              <span className="text-secondary font-title-sm text-title-sm">Volumes</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
              <span className="text-primary font-semibold bg-surface-container-high px-2 py-0.5 rounded-full">
                +24 this week
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-tertiary tracking-tight">
                19
              </span>
              <span className="text-tertiary font-title-sm text-title-sm">To Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
              <span className="inline-flex items-center text-on-tertiary bg-tertiary px-2 py-0.5 rounded-full font-bold">
                Action Req.
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Readers */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-transform flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-space-md">
            <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
              Active Readers
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md font-bold text-primary tracking-tight">
                6,420
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md">
              <span className="text-primary font-semibold bg-secondary-container px-2 py-0.5 rounded-full">
                +380 patrons
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Section: Visual Sales Analytics & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between lg:col-span-12">
          {/* Header Row & Segmented Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
            <div>
              <h2 className="font-title-lg text-title-lg font-bold text-primary">
                Sales Trajectory &amp; Run-Rate
              </h2>
            </div>
            <div className="inline-flex p-1 bg-surface-container rounded-full text-label-sm font-label-sm self-start">
              <button
                type="button"
                onClick={() => setActiveChartMetric('revenue')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeChartMetric === 'revenue'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Revenue
              </button>
              <button
                type="button"
                onClick={() => setActiveChartMetric('copies')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeChartMetric === 'copies'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Copies Sold
              </button>
            </div>
          </div>

          {/* Custom SVG Chart Container */}
          <div className="w-full relative pt-4">
            {/* Target Marker Line Mockup */}
            <div className="absolute left-8 right-2 top-20 border-b border-dashed border-tertiary-fixed-dim/70 flex justify-end pointer-events-none"></div>

            {/* Inline SVG Visualization */}
            <svg
              className="w-full h-56 text-primary"
              preserveAspectRatio="none"
              viewBox="0 0 1100 240"
            >
              {/* Horizontal Reference Lines */}
              <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="30" y2="30" />
              <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="80" y2="80" />
              <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="130" y2="130" />
              <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="180" y2="180" />

              {/* Y-Axis Value Labels */}
              <text fill="#74777f" fontSize="11" textAnchor="end" x="32" y="34">
                {activeChartMetric === 'revenue' ? '50k' : '2.5k'}
              </text>
              <text fill="#74777f" fontSize="11" textAnchor="end" x="32" y="84">
                {activeChartMetric === 'revenue' ? '40k' : '2.0k'}
              </text>
              <text fill="#74777f" fontSize="11" textAnchor="end" x="32" y="134">
                {activeChartMetric === 'revenue' ? '25k' : '1.2k'}
              </text>
              <text fill="#74777f" fontSize="11" textAnchor="end" x="32" y="184">
                {activeChartMetric === 'revenue' ? '10k' : '500'}
              </text>

              {/* 10 Monthly Histogram Bars */}
              {activeChartMetric === 'revenue' ? (
                <>
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="65" rx="6" width="50" x="75" y="125" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="80" rx="6" width="50" x="175" y="110" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="95" rx="6" width="50" x="275" y="95" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="60" rx="6" width="50" x="375" y="130" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="105" rx="6" width="50" x="475" y="85" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="120" rx="6" width="50" x="575" y="70" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="100" rx="6" width="50" x="675" y="90" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="130" rx="6" width="50" x="775" y="60" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="140" rx="6" width="50" x="875" y="50" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#002045" height="152" rx="6" width="50" x="975" y="38" />
                  {/* Spline Curve Overlay & Peak Dot */}
                  <path
                    d="M 100 125 C 200 110, 300 95, 400 130 C 500 85, 600 70, 700 90 C 800 60, 900 50, 1000 38"
                    fill="none"
                    stroke="#f57c51"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="1000" cy="38" fill="#661c00" r="5" />
                </>
              ) : (
                <>
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="50" rx="6" width="50" x="75" y="140" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="70" rx="6" width="50" x="175" y="120" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="85" rx="6" width="50" x="275" y="105" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="45" rx="6" width="50" x="375" y="145" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="100" rx="6" width="50" x="475" y="90" />
                  <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="110" rx="6" width="50" x="575" y="80" />
                  <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="90" rx="6" width="50" x="675" y="100" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="120" rx="6" width="50" x="775" y="70" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="135" rx="6" width="50" x="875" y="55" />
                  <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#002045" height="148" rx="6" width="50" x="975" y="42" />
                  {/* Spline Curve Overlay & Peak Dot */}
                  <path
                    d="M 100 140 C 200 120, 300 105, 400 145 C 500 90, 600 80, 700 100 C 800 70, 900 55, 1000 42"
                    fill="none"
                    stroke="#f57c51"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="1000" cy="42" fill="#661c00" r="5" />
                </>
              )}
            </svg>

            {/* X-Axis Labels */}
            <div className="grid grid-cols-10 pl-10 pr-2 pt-2 text-center text-outline font-label-sm text-label-sm">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span className="text-primary font-bold">Oct</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Bottom Widget Cards: Side-by-Side (6 cols / 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Left Card: Recent Orders Quick List */}
        <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-primary">
                    Recent Orders
                  </h2>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Real-time gateway status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="font-label-lg text-label-lg text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                data-path="order-management"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              </button>
            </div>

            {/* Orders Stream */}
            <div className="space-y-space-sm">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="p-space-sm rounded-2xl bg-surface hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm"
                >
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-label-md text-label-md shrink-0">
                      {order.orderNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-title-sm text-title-sm font-semibold text-primary truncate">
                          {order.customerName}
                        </p>
                        <span className={order.badgeClasses}>{order.badgeLabel}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary truncate">
                        {order.itemSummary}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-title-sm text-title-sm font-bold text-primary">
                      {order.amount}
                    </p>
                    <button
                      type="button"
                      onClick={() => setInspectedOrder(order)}
                      className="text-secondary hover:text-primary font-label-sm text-label-sm cursor-pointer transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-space-md pt-space-sm text-center"></div>
        </div>

        {/* Right Card: Low Stock Alerts (< 5 copies) */}
        <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-primary">
                    Warehouse Stock Alerts
                  </h2>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Volumes below safety baseline (&lt; 5)
                  </p>
                </div>
              </div>
              <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full">
                3 Critical
              </span>
            </div>

            {/* Stock List */}
            <div className="space-y-space-sm">
              {STOCK_ALERTS.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-space-md rounded-2xl bg-surface hover:bg-surface-container/60 transition-colors flex items-center justify-between gap-space-md"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <img
                      className="w-12 h-16 rounded-md object-cover flex-shrink-0 shadow-sm"
                      src={alert.coverImage}
                      alt={alert.coverAlt}
                      data-alt={alert.coverAlt}
                    />
                    <div className="min-w-0">
                      <h4 className="font-title-sm text-title-sm font-semibold text-primary truncate">
                        {alert.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-outline truncate">
                        {alert.author} • ISBN {alert.isbn}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${alert.dotColor}`}></span>
                        <span className={alert.alertClasses}>{alert.alertText}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/admin/inventory')}
                    className="shrink-0 text-xs text-primary font-semibold hover:underline hidden sm:inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Restock</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-space-md pt-space-sm text-center"></div>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectedOrder && (
        <div
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-lg w-full shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                  {inspectedOrder.orderNumber}
                </div>
                <div>
                  <h3 className="font-title-lg font-bold text-primary">Order Inspection</h3>
                  <p className="font-body-sm text-secondary">{inspectedOrder.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-space-md text-on-surface font-body-md text-body-md">
              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Patron Buyer
                </span>
                <p className="font-title-sm font-semibold text-primary">
                  {inspectedOrder.customerName}
                </p>
              </div>

              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Volumes Purchased
                </span>
                <p className="font-body-md text-on-surface">{inspectedOrder.itemSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-space-md bg-surface p-space-md rounded-2xl">
                <div>
                  <span className="text-secondary font-label-sm block uppercase tracking-wider">
                    Settlement Status
                  </span>
                  <span className={inspectedOrder.badgeClasses}>
                    {inspectedOrder.badgeLabel}
                  </span>
                </div>
                <div>
                  <span className="text-secondary font-label-sm block uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="font-title-md font-bold text-primary">
                    {inspectedOrder.amount}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Gateway Telemetry &amp; Reference
                </span>
                <p className="font-body-sm text-outline">{inspectedOrder.gateway}</p>
                <p className="font-mono text-xs text-secondary mt-0.5">
                  Ref ID: {inspectedOrder.reference}
                </p>
              </div>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
              <button
                type="button"
                onClick={() => setInspectedOrder(null)}
                className="px-4 py-2 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectedOrder(null);
                  navigate('/admin/orders');
                }}
                className="px-5 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold cursor-pointer transition-colors shadow-sm"
              >
                Go to Fulfillment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

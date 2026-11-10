import React from 'react';
import { OrderDisplay, OrderFilterTab } from './types';
import { OrderHistoryCard } from './OrderHistoryCard';

export interface OrderHistorySectionProps {
  orders: OrderDisplay[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: OrderFilterTab;
  setActiveTab: (tab: OrderFilterTab) => void;
  onOpenTracking: (order: OrderDisplay) => void;
  onOpenReview: (order: OrderDisplay) => void;
  onOpenVietQr: (order: OrderDisplay) => void;
  onReorder: (order: OrderDisplay) => void;
  onCancelOrder: (order: OrderDisplay) => void;
}

export const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({
  orders,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onOpenTracking,
  onOpenReview,
  onOpenVietQr,
  onReorder,
  onCancelOrder,
}) => {
  const filterTabs: { id: OrderFilterTab; label: string; legacyLabel: string; domId: string }[] = [
    { id: 'all', label: 'Tất cả đơn hàng', legacyLabel: 'All Orders', domId: 'tab-all-orders' },
    {
      id: 'processing',
      label: 'Đang xử lý & Đang giao',
      legacyLabel: 'Paid & Dispatched',
      domId: 'tab-processing-orders',
    },
    {
      id: 'pending',
      label: 'Chờ thanh toán',
      legacyLabel: 'Pending Settlement',
      domId: 'tab-pending-orders',
    },
    { id: 'delivered', label: 'Đã giao thành công', legacyLabel: 'Delivered', domId: 'tab-delivered-orders' },
    { id: 'cancelled', label: 'Đã hủy', legacyLabel: 'Cancelled', domId: 'tab-cancelled-orders' },
  ];

  return (
    <div
      id="order-history-section"
      data-testid="user-profile-order-history"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-md">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">history_edu</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Lịch sử đơn hàng &amp; Trạng thái giao nhận
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            search
          </span>
          <input
            id="order-search"
            data-testid="user-profile-order-history-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, tựa sách, tác giả..."
            className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Filter Chips Container */}
      <div
        id="filter-chips"
        data-testid="user-profile-order-history-filters"
        className="flex items-center gap-2 overflow-x-auto pb-space-sm mb-space-md border-b border-outline-variant/20 scrollbar-none"
      >
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={tab.domId}
              data-testid={'user-profile-order-history-tab-' + tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span>{tab.label}</span>
              <span className="sr-only"> ({tab.legacyLabel})</span>
            </button>
          );
        })}
      </div>

      {/* Orders Container List */}
      <div
        id="orders-container"
        data-testid="user-profile-order-history-list"
        className="flex flex-col space-y-space-md"
      >
        {/* Legacy ID alias */}
        <div id="userOrdersList" className="sr-only" />

        {orders.length === 0 ? (
          <div
            id="empty-orders"
            data-testid="user-profile-order-history-empty"
            className="p-space-xl text-center bg-surface-container-low/40 rounded-lg border border-dashed border-outline-variant/50"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container/50 flex items-center justify-center mx-auto text-primary mb-2">
              <span className="material-symbols-outlined text-[24px]">inbox</span>
            </div>
            <h4 className="font-title-sm text-title-sm font-bold text-on-surface mb-1">
              Không có đơn hàng nào trong trạng thái này
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục tất cả đơn hàng.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderHistoryCard
              key={order.id}
              order={order}
              onOpenTracking={onOpenTracking}
              onOpenReview={onOpenReview}
              onOpenVietQr={onOpenVietQr}
              onReorder={onReorder}
              onCancelOrder={onCancelOrder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistorySection;

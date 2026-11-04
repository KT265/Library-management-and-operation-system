import React from 'react';

interface OrdersHeaderProps {
  onSyncWebhooks: () => void;
  isSyncing: boolean;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  onSyncWebhooks,
  isSyncing,
}) => {
  return (
    <div
      id="orders-header"
      data-testid="admin-orders-header"
      className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
    >
      <div>
        <h1
          id="orders-title"
          data-testid="admin-orders-header-title"
          className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight"
        >
          Điều phối Đơn hàng &amp; Lưu hành
        </h1>
        <p
          id="orders-subtitle"
          data-testid="admin-orders-header-subtitle"
          className="font-body-md text-body-md text-secondary mt-1"
        >
          Theo dõi đơn hàng xuất kho, chu kỳ mượn đọc của độc giả và xử lý trả sách
        </p>
      </div>

      <div className="flex items-center gap-space-sm flex-wrap">
        <button
          type="button"
          id="btn-sync-payos-webhooks"
          data-testid="admin-orders-header-btn-sync"
          title="Sync Webhooks"
          onClick={onSyncWebhooks}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md font-semibold border border-outline-variant/30 shadow-sm transition-colors cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              isSyncing ? 'animate-spin text-secondary' : 'text-primary'
            }`}
          >
            refresh
          </span>
          <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ PayOS Webhook'}</span>
        </button>
      </div>
    </div>
  );
};

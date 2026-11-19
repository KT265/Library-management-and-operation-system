import React from 'react';
import { FulfillmentOrder } from './types';

interface FulfillmentKpisBarProps {
  orders?: FulfillmentOrder[];
}

export const FulfillmentKpisBar: React.FC<FulfillmentKpisBarProps> = ({ orders = [] }) => {
  // Dynamically calculate the counts by filtering the orders array based on statusOrder
  const countAwaiting = orders.filter((o) => {
    const s = (o.statusOrder || o.fulfillmentCycle || '').toUpperCase();
    return s === 'PENDING';
  }).length;

  const countInTransit = orders.filter((o) => {
    const s = (o.statusOrder || o.fulfillmentCycle || '').toUpperCase();
    return s === 'PROCESSING';
  }).length;

  const countCompleted = orders.filter((o) => {
    const s = (o.statusOrder || o.fulfillmentCycle || '').toUpperCase();
    return s === 'DELIVERED';
  }).length;

  return (
    <div
      id="orders-kpis-grid"
      data-testid="admin-orders-kpis-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md"
    >
      {/* Pill 1: Chờ xử lý / Awaiting Dispatch */}
      <div
        id="kpi-awaiting-dispatch"
        data-testid="admin-orders-kpi-awaiting-dispatch"
        className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between"
      >
        <div>
          <span className="text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider block">
            Chờ xử lý (Awaiting Dispatch)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-sm text-display-sm font-bold text-tertiary num-tabular">
              {countAwaiting}
            </span>
            <span className="text-tertiary font-label-md text-label-md">đơn xuất kho</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
        </div>
      </div>

      {/* Pill 2: Đang giao hàng / In Transit */}
      <div
        id="kpi-in-transit"
        data-testid="admin-orders-kpi-in-transit"
        className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between"
      >
        <div>
          <span className="text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider block">
            Đang giao hàng (In Transit)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-sm text-display-sm font-bold text-primary num-tabular">
              {countInTransit}
            </span>
            <span className="text-secondary font-label-md text-label-md">kiện bưu điện</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        </div>
      </div>

      {/* Pill 3: Đã hoàn tất / Completed Orders */}
      <div
        id="kpi-completed-orders"
        data-testid="admin-orders-kpi-completed-orders"
        className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between"
      >
        <div>
          <span className="text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider block">
            Đã hoàn tất (Completed)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-sm text-display-sm font-bold text-primary num-tabular">
              {countCompleted}
            </span>
            <span className="text-secondary font-label-md text-label-md">đơn hàng</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
        </div>
      </div>
    </div>
  );
};


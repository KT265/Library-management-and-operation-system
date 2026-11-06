import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../../utils/currency';
import { OrderItem } from './types';

const INITIAL_RECENT_ORDERS: OrderItem[] = [
  {
    id: 'ord-925',
    orderNumber: '#925',
    customerName: 'Hoàng Long',
    itemSummary: '1 ấn phẩm • "Clean Architecture"',
    amount: 280000,
    badgeLabel: 'Đã thanh toán VietQR',
    badgeClasses: 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold',
    date: 'Hôm nay, 11:20 SA',
    gateway: 'VietQR tức thì qua PayOS',
    reference: 'VQR-2026-925',
  },
  {
    id: 'ord-924',
    orderNumber: '#924',
    customerName: 'Claire Thorne',
    itemSummary: '2 ấn phẩm • "Designing Data-Intensive Applications", "Clean Architecture"',
    amount: 450000,
    badgeLabel: 'Đã thanh toán VietQR',
    badgeClasses: 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold',
    date: 'Hôm nay, 10:42 SA',
    gateway: 'VietQR tức thì qua PayOS',
    reference: 'VQR-2026-924',
  },
  {
    id: 'ord-923',
    orderNumber: '#923',
    customerName: 'Minh Nguyễn',
    itemSummary: '1 ấn phẩm • "Klara and the Sun"',
    amount: 185000,
    badgeLabel: 'Chờ xuất kho',
    badgeClasses: 'bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold',
    date: 'Hôm nay, 09:15 SA',
    gateway: 'PayOS Webhook Chờ xử lý',
    reference: 'ORD-2026-923',
  },
  {
    id: 'ord-922',
    orderNumber: '#922',
    customerName: 'Julian Barnes',
    itemSummary: '3 ấn phẩm • Tuyển tập Ấn bản Đặc biệt Sưu tầm',
    amount: 980000,
    badgeLabel: 'Đang vận chuyển',
    badgeClasses: 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold',
    date: 'Hôm qua, 16:30 CH',
    gateway: 'VietQR Express Settlement',
    reference: 'VNPOST-884920',
  },
  {
    id: 'ord-921',
    orderNumber: '#921',
    customerName: 'Thảo Trần',
    itemSummary: '1 ấn phẩm • "The Pragmatic Programmer"',
    amount: 320000,
    badgeLabel: 'Đã giao thành công',
    badgeClasses: 'bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold',
    date: '30 Thg 10, 2026, 14:05 CH',
    gateway: 'Thanh toán tiền mặt khi nhận hàng (COD)',
    reference: 'COD-2026-921',
  },
];

export const RecentOrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const [inspectedOrder, setInspectedOrder] = useState<OrderItem | null>(null);

  return (
    <div
      id="dashboard-recent-orders-card"
      data-testid="admin-dashboard-recent-orders-card"
      className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30"
    >
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <h2
                id="recent-orders-title"
                data-testid="admin-dashboard-recent-orders-title"
                className="font-title-lg text-title-lg font-bold text-primary"
              >
                Đơn hàng gần đây
              </h2>
              <p className="font-body-sm text-body-sm text-secondary">
                Trạng thái cổng thanh toán và xuất kho thời gian thực
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-view-all-orders"
            data-testid="admin-dashboard-recent-orders-link-viewall"
            onClick={() => navigate('/admin/orders')}
            className="font-label-lg text-label-lg text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Orders Stream / Table */}
        <div
          id="recentOrdersTable"
          data-testid="admin-dashboard-recent-orders-table"
          className="space-y-space-sm"
        >
          {INITIAL_RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              id={`recent-order-row-${order.id}`}
              data-testid={`admin-dashboard-recent-orders-row-${order.id}`}
              className="p-space-sm rounded-2xl bg-surface hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm border border-outline-variant/20"
            >
              <div className="flex items-center gap-space-md min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-label-md text-label-md shrink-0">
                  {order.orderNumber}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-title-sm text-title-sm font-semibold text-primary truncate">
                      {order.customerName}
                    </p>
                    <span className={order.badgeClasses}>{order.badgeLabel}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary truncate mt-0.5">
                    {order.itemSummary}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-title-sm text-title-sm font-bold text-primary num-tabular">
                  {formatVND(order.amount)}
                </p>
                <button
                  type="button"
                  id={`btn-inspect-order-${order.id}`}
                  data-testid={`admin-dashboard-recent-orders-btn-inspect-${order.id}`}
                  onClick={() => setInspectedOrder(order)}
                  className="text-secondary hover:text-primary font-label-sm text-label-sm cursor-pointer transition-colors mt-0.5 inline-block"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Order Dialog Modal */}
      {inspectedOrder && (
        <div
          id="inspect-order-modal-backdrop"
          data-testid="admin-dashboard-modal-backdrop"
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            id="inspect-order-modal"
            data-testid="admin-dashboard-modal-inspect"
            className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-lg w-full shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                  {inspectedOrder.orderNumber}
                </div>
                <div>
                  <h3 className="font-title-lg font-bold text-primary">Chi tiết Đơn hàng</h3>
                  <p className="font-body-sm text-secondary">{inspectedOrder.date}</p>
                </div>
              </div>
              <button
                type="button"
                id="btn-close-inspect-modal"
                data-testid="admin-dashboard-modal-btn-close"
                onClick={() => setInspectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-space-md text-on-surface font-body-md text-body-md">
              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Khách hàng / Độc giả
                </span>
                <p className="font-title-sm font-semibold text-primary">
                  {inspectedOrder.customerName}
                </p>
              </div>

              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Danh mục ấn phẩm đã đặt
                </span>
                <p className="font-body-md text-on-surface">{inspectedOrder.itemSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-space-md bg-surface p-space-md rounded-2xl border border-outline-variant/30">
                <div>
                  <span className="text-secondary font-label-sm block uppercase tracking-wider">
                    Trạng thái thanh toán
                  </span>
                  <span className={inspectedOrder.badgeClasses}>
                    {inspectedOrder.badgeLabel}
                  </span>
                </div>
                <div>
                  <span className="text-secondary font-label-sm block uppercase tracking-wider">
                    Tổng tiền thanh toán
                  </span>
                  <span className="font-title-md font-bold text-primary num-tabular">
                    {formatVND(inspectedOrder.amount)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-secondary font-label-sm block uppercase tracking-wider">
                  Cổng giao dịch &amp; Mã đối soát
                </span>
                <p className="font-body-sm text-outline">{inspectedOrder.gateway}</p>
                <p className="font-mono text-xs text-secondary mt-0.5">
                  Mã tham chiếu: {inspectedOrder.reference}
                </p>
              </div>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
              <button
                type="button"
                id="btn-close-modal-footer"
                data-testid="admin-dashboard-modal-btn-dismiss"
                onClick={() => setInspectedOrder(null)}
                className="px-4 py-2 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                id="btn-go-to-orders"
                data-testid="admin-dashboard-modal-btn-goto-orders"
                onClick={() => {
                  setInspectedOrder(null);
                  navigate('/admin/orders');
                }}
                className="px-5 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold cursor-pointer transition-colors shadow-sm"
              >
                Đi đến Điều phối Đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

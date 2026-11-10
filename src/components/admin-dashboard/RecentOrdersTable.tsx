import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS, convertTimestampToISO } from '../../services/firebase';
import { formatVND } from '../../utils/currency';
import { OrderItem } from './types';

export interface RecentOrdersTableProps {
  orders?: OrderItem[];
  loading?: boolean;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [inspectedOrder, setInspectedOrder] = useState<OrderItem | null>(null);
  const [internalOrders, setInternalOrders] = useState<OrderItem[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  useEffect(() => {
    if (orders !== undefined) return;
    let isMounted = true;
    setInternalLoading(true);

    getDocs(collection(db, FIRESTORE_COLLECTIONS.ORDER))
      .then((ordersSnap) => {
        if (!isMounted) return;
        const rawOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rawOrders.sort((a: any, b: any) => {
          const timeA = new Date(convertTimestampToISO(a.createAt || a.createdAt)).getTime();
          const timeB = new Date(convertTimestampToISO(b.createAt || b.createdAt)).getTime();
          return timeB - timeA;
        });

        const mapped: OrderItem[] = rawOrders.slice(0, 5).map((ord: any) => {
          const items = Array.isArray(ord.items) ? ord.items : [];
          const count = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
          const titles = items.map((it: any) => `"${it.title || 'Sách'}"`).slice(0, 2).join(', ');
          const itemSummary = count > 0 ? `${count} ấn phẩm • ${titles}${items.length > 2 ? '...' : ''}` : 'Chưa có ấn phẩm';

          const paymentStatus = String(ord.statusPayment || ord.paymentStatus || '').toUpperCase();
          const orderStatus = String(ord.statusOrder || ord.status || '').toUpperCase();

          let badgeLabel = 'Chờ xử lý';
          let badgeClasses = 'bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';

          if (paymentStatus === 'PAID') {
            badgeLabel = ord.methodPayment === 'COD' ? 'Đã thanh toán COD' : 'Đã thanh toán VietQR';
            badgeClasses = 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
          } else if (orderStatus === 'DELIVERED') {
            badgeLabel = 'Đã giao thành công';
            badgeClasses = 'bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
          } else if (orderStatus === 'SHIPPED') {
            badgeLabel = 'Đang vận chuyển';
            badgeClasses = 'bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
          } else if (paymentStatus === 'PENDING' || orderStatus === 'PROCESSING') {
            badgeLabel = 'Chờ xuất kho';
            badgeClasses = 'bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold';
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

        setInternalOrders(mapped);
      })
      .catch((err) => {
        console.error('[RecentOrdersTable] Error querying Order from Firestore:', err);
      })
      .finally(() => {
        if (isMounted) setInternalLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orders]);

  const activeOrders = orders !== undefined ? orders : internalOrders;
  const isTableLoading = loading || (orders === undefined && internalLoading);

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

        {/* Orders Stream / Empty State */}
        {isTableLoading ? (
          <div className="py-8 text-center text-secondary font-label-md flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
            <p>Đang tải đơn hàng gần đây...</p>
          </div>
        ) : activeOrders.length === 0 ? (
          <div
            id="recent-orders-empty-state"
            data-testid="admin-dashboard-recent-orders-empty"
            className="p-space-lg text-center bg-surface rounded-2xl border border-outline-variant/20 py-8"
          >
            <span className="material-symbols-outlined text-4xl text-secondary mb-2">inbox</span>
            <p className="font-title-sm font-semibold text-primary">Chưa có đơn hàng nào</p>
            <p className="font-body-sm text-secondary mt-1">
              Hệ thống chưa ghi nhận đơn hàng phát sinh trong kỳ báo cáo.
            </p>
          </div>
        ) : (
          <div
            id="recentOrdersTable"
            data-testid="admin-dashboard-recent-orders-table"
            className="space-y-space-sm"
          >
            {activeOrders.map((order) => (
              <div
                key={order.id}
                id={`recent-order-row-${order.id}`}
                data-testid={`admin-dashboard-recent-orders-row-${order.id}`}
                className="p-space-sm rounded-2xl bg-surface hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm border border-outline-variant/20"
              >
                <div className="flex items-center gap-10 min-w-0">
                  <div className="px-3 py-1.5 rounded-lg w-fit bg-surface-container-high flex items-center justify-center font-bold text-primary font-label-md text-label-md shrink-0">
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
        )}
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

export default RecentOrdersTable;

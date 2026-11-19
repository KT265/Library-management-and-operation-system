import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { formatVND } from '../../utils/currency';
import { FulfillmentOrder, OrderFulfillmentCycle } from './types';

interface CirculationConsoleModalProps {
  isOpen: boolean;
  order: FulfillmentOrder | null;
  onClose: () => void;
  onUpdateOrder: (updated: FulfillmentOrder) => void;
}

export const CirculationConsoleModal: React.FC<CirculationConsoleModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateOrder,
}) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<OrderFulfillmentCycle>('Pending');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setTrackingCode(order.trackingCode || `VNPOST-${Math.floor(100000 + Math.random() * 900000)}`);
      setSelectedCycle(order.fulfillmentCycle);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const mapCycleToStatusOrder = (cycle: OrderFulfillmentCycle): string => {
    switch (cycle) {
      case 'Delivered':
        return 'DELIVERED';
      case 'Processing':
        return 'PROCESSING';
      case 'Returned':
        return 'RETURNED';
      case 'Cancelled':
        return 'CANCELLED';
      case 'Pending':
      default:
        return 'PENDING';
    }
  };

  /**
   * Increments readBookCount for the user associated with the order when delivered.
   * Calculation: Count the exact number of objects in the items array (order.items.length).
   * DO NOT sum up the quantity of each item.
   */
  const syncUserReadBookCountOnDelivery = async (orderId: string) => {
    try {
      const orderSnap = await getDoc(doc(db, 'Order', orderId));
      if (!orderSnap.exists()) return;
      const orderData = orderSnap.data();

      if (orderData.deliveryCountSynced) {
        return;
      }

      const idUser = orderData.idUser || orderData.userId;
      const items = Array.isArray(orderData.items) ? orderData.items : [];
      const itemsCount = items.length;

      if (idUser && itemsCount > 0) {
        await updateDoc(doc(db, 'Users', idUser), {
          readBookCount: increment(itemsCount),
        });
        await updateDoc(doc(db, 'Order', orderId), {
          deliveryCountSynced: true,
        });
      }
    } catch (syncErr) {
      console.error('[CirculationConsole] Error updating user readBookCount on delivery:', syncErr);
    }
  };

  const handleStatusChange = async (newCycle: OrderFulfillmentCycle) => {
    setSelectedCycle(newCycle);
    if (!order?.id) return;

    const newStatusValue = mapCycleToStatusOrder(newCycle);
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, 'Order', order.id), {
        statusOrder: newStatusValue,
        updateAt: serverTimestamp(),
      });

      if (newStatusValue === 'DELIVERED') {
        await syncUserReadBookCountOnDelivery(order.id);
      }
    } catch (err) {
      console.error('[CirculationConsole] Error updating statusOrder in Firestore:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    const newStatusValue = mapCycleToStatusOrder(selectedCycle);
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, 'Order', order.id), {
        statusOrder: newStatusValue,
        trackingCode,
        updateAt: serverTimestamp(),
      });

      if (newStatusValue === 'DELIVERED') {
        await syncUserReadBookCountOnDelivery(order.id);
      }
    } catch (err) {
      console.error('[CirculationConsole] Error saving order to Firestore:', err);
    } finally {
      setIsUpdating(false);
    }

    onUpdateOrder({
      ...order,
      trackingCode,
      fulfillmentCycle: selectedCycle,
      statusOrder: newStatusValue,
      isOverdue: false,
      fineAmountVND: undefined,
    });
    onClose();
  };

  const handleWaiveFine = async () => {
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, 'Order', order.id), {
        statusOrder: 'RETURNED',
        updateAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[CirculationConsole] Error updating status to RETURNED:', err);
    } finally {
      setIsUpdating(false);
    }

    onUpdateOrder({
      ...order,
      isOverdue: false,
      fineAmountVND: undefined,
      dueSubtext: 'Đã miễn phí trễ hạn bởi Quản trị viên',
      fulfillmentCycle: 'Returned',
      statusOrder: 'RETURNED',
    });
    onClose();
  };

  const displayOrderId = order.orderNumber
    ? (order.orderNumber.startsWith('ORD-') ? order.orderNumber : `ORD-${order.orderNumber}`)
    : (order.id.startsWith('ORD-') ? order.id : `ORD-${order.id}`);

  return (
    <div
      id="circulation-console-modal-backdrop"
      data-testid="admin-orders-modal-console-backdrop"
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="circulation-console-modal"
        data-testid="admin-orders-modal-console"
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-lg w-full shadow-2xl border border-surface-container my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between pb-space-sm mb-space-md border-b border-surface-container">
          <div>
            <h3 className="font-title-lg font-bold text-primary">
              Bảng Điều phối Lưu hành
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Mã đơn: {displayOrderId}
            </p>
            <p className="font-body-sm text-secondary mt-0.5">
              Kiểu xuất kho: <span className="font-semibold">{order.dispatchType}</span>
            </p>
          </div>
          <button
            type="button"
            id="btn-close-console-modal"
            data-testid="admin-orders-modal-console-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer shrink-0 ml-4"

>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-space-md font-body-sm text-body-sm text-on-surface">
          {/* Patron Info */}
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
            <img
              src={order.patronAvatar}
              alt={order.patronName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-title-sm font-semibold text-primary">{order.patronName}</p>
              <p className="text-secondary text-xs">{order.patronEmail}</p>
            </div>
          </div>

          {/* Ordered Books */}
          <div>
            <span className="text-secondary font-label-sm block uppercase tracking-wider mb-1">
              Danh mục ấn phẩm yêu cầu
            </span>
            <div className="space-y-1.5">
              {order.books.map((b, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-surface border border-outline-variant/20 flex items-center justify-between"
                >
                  <span className="font-medium text-primary text-xs">{b.title}</span>
                  <span className="text-secondary text-xs">
                    {b.quantity} cuốn • {b.orderNote}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-2 gap-space-md p-space-sm rounded-xl bg-surface border border-outline-variant/20">
            <div>
              <span className="text-secondary text-xs block">Trạng thái thanh toán</span>
              <span className="font-semibold text-primary text-xs mt-0.5 block">
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <span className="text-secondary text-xs block">Tổng tiền</span>
              <span className="font-bold text-primary text-sm num-tabular mt-0.5 block">
                {formatVND(order.orderTotalVND)}
              </span>
            </div>
          </div>

          {/* Tracking Code Input */}
          <div>
            <label htmlFor="trackingCodeInput" className="block text-secondary font-medium mb-1">
              Mã vận đơn / Bưu gửi bưu chính
            </label>
            <input
              type="text"
              id="trackingCodeInput"
              data-testid="admin-orders-modal-input-tracking"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Ví dụ: VNPOST-982401"
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Cycle State Selector */}
          <div>
            <label htmlFor="select-cycle-state" className="block text-secondary font-medium mb-1">
              Tiến độ giao hàng &amp; xử lý
            </label>
            <select
              id="select-cycle-state"
              data-testid="admin-orders-modal-select-cycle"
              value={selectedCycle}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value as OrderFulfillmentCycle)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
            >
              <option value="Pending">Chờ xử lý (Pending)</option>
              <option value="Processing">Đang giao hàng (Processing)</option>
              <option value="Delivered">Đã hoàn tất (Delivered)</option>
            </select>
          </div>

          {/* Overdue Warning & Fine Waiver */}
          {order.isOverdue && (
            <div className="p-space-sm rounded-xl bg-error-container text-on-error-container text-xs flex items-center justify-between gap-2">
              <div>
                <span className="font-bold block">Đơn hàng mượn quá hạn!</span>
                <span>Phạt quá hạn: {formatVND(order.fineAmountVND || 50000)}</span>
              </div>
              <button
                type="button"
                id="btn-waive-fine"
                data-testid="admin-orders-modal-btn-waive-fine"
                onClick={handleWaiveFine}
                className="px-3 py-1 rounded-full bg-surface-container-lowest text-error font-bold text-xs hover:bg-surface-container shadow-xs cursor-pointer"
              >
                Miễn phí &amp; Hoàn trả
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-space-lg pt-space-md border-t border-surface-container flex items-center justify-end gap-space-sm">
          <button
            type="button"
            id="btn-cancel-console"
            data-testid="admin-orders-modal-console-btn-cancel"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            id="btn-save-console"
            data-testid="admin-orders-modal-console-btn-save"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer"
          >
            Cập nhật tiến độ
          </button>
        </div>
      </div>
    </div>
  );
};

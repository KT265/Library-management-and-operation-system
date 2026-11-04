import React from 'react';
import { formatVND } from '../../utils/currency';
import { FulfillmentOrder, OrderFulfillmentCycle } from './types';

interface FulfillmentOrderRowProps {
  order: FulfillmentOrder;
  onOpenConsole: (order: FulfillmentOrder) => void;
  onUpdateCycle: (orderId: string, newCycle: OrderFulfillmentCycle) => void;
  onResolveOverdue: (order: FulfillmentOrder) => void;
}

export const FulfillmentOrderRow: React.FC<FulfillmentOrderRowProps> = ({
  order,
  onOpenConsole,
  onUpdateCycle,
  onResolveOverdue,
}) => {
  const getPaymentBadge = (status: FulfillmentOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid via PayOS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Đã thanh toán qua PayOS</span>
          </span>
        );
      case 'Pending VietQR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
            <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
            <span>Chờ quét mã VietQR</span>
          </span>
        );
      case 'COD Settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">payments</span>
            <span>Đã thu tiền COD</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCycleBadge = (cycle: OrderFulfillmentCycle) => {
    switch (cycle) {
      case 'Borrowing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
            Đang mượn
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
            Đã hoàn trả
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-container text-on-tertiary-container">
            Chờ xử lý
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">
            Quá hạn (Phạt: {formatVND(order.fineAmountVND || 50000)})
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <tr
      id={`order-row-${order.id}`}
      data-testid={`admin-orders-row-${order.id}`}
      className={`border-b border-surface-container transition-colors ${
        order.isOverdue
          ? 'bg-error-container/10 hover:bg-error-container/20'
          : 'hover:bg-surface-container-low/60'
      }`}
    >
      {/* 1. Mã đơn hàng & Kiểu điều phối */}
      <td className="py-3 px-4">
        <span className="font-mono font-bold text-primary text-sm block">
          {order.orderNumber}
        </span>
        <span className="text-secondary text-xs mt-0.5 block">{order.dispatchType}</span>
      </td>

      {/* 2. Độc giả / Người mua */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <img
            src={order.patronAvatar}
            alt={order.patronName}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-outline-variant/30"
          />
          <div className="min-w-0">
            <p className="font-title-sm text-title-sm font-semibold text-primary truncate">
              {order.patronName}
            </p>
            <p className="text-secondary text-xs truncate">{order.patronEmail}</p>
          </div>
        </div>
      </td>

      {/* 3. Danh mục ấn phẩm */}
      <td className="py-3 px-4">
        <div className="space-y-1">
          {order.books.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {b.coverImage && (
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-6 h-8 rounded object-cover shrink-0 shadow-xs"
                />
              )}
              <div className="min-w-0">
                <span className="font-medium text-primary text-xs truncate block max-w-[200px]">
                  {b.title}
                </span>
                <span className="text-secondary text-xs">
                  SL: {b.quantity} • {b.loanNote}
                </span>
              </div>
            </div>
          ))}
        </div>
      </td>

      {/* 4. Hạn trả / Trạng thái */}
      <td className="py-3 px-4">
        <span className="font-semibold text-primary text-xs block">{order.dueDate}</span>
        <span
          className={`text-xs block ${
            order.isOverdue ? 'text-error font-semibold' : 'text-secondary'
          }`}
        >
          {order.dueSubtext}
        </span>
      </td>

      {/* 5. Cổng thanh toán */}
      <td className="py-3 px-4">
        {getPaymentBadge(order.paymentStatus)}
        <div className="mt-1 font-semibold text-primary text-xs num-tabular">
          {formatVND(order.orderTotalVND)}
        </div>
      </td>

      {/* 6. Tiến độ đơn hàng / Quick-toggle Cycle */}
      <td className="py-3 px-4 text-center">
        <div className="flex flex-col items-center gap-1.5">
          {getCycleBadge(order.fulfillmentCycle)}
          <select
            value={order.fulfillmentCycle}
            onChange={(e) =>
              onUpdateCycle(order.id, e.target.value as OrderFulfillmentCycle)
            }
            className="text-[11px] bg-surface-container-low border border-outline-variant/30 rounded-md px-1.5 py-0.5 text-secondary cursor-pointer focus:outline-none"
          >
            <option value="Pending">Chờ xử lý</option>
            <option value="Borrowing">Đang lưu hành</option>
            <option value="Returned">Đã hoàn tất</option>
            <option value="Overdue">Quá hạn</option>
          </select>
        </div>
      </td>

      {/* 7. Thao tác */}
      <td className="py-3 px-4 text-right">
        <div className="inline-flex items-center gap-1.5 justify-end">
          {order.isOverdue && (
            <button
              type="button"
              id={`btn-resolve-${order.id}`}
              data-testid={`admin-orders-btn-resolve-${order.id}`}
              onClick={() => onResolveOverdue(order)}
              className="px-2.5 py-1 rounded-full bg-error text-on-error hover:bg-error/90 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Resolve
            </button>
          )}

          <button
            type="button"
            id={`btn-console-${order.id}`}
            data-testid={`admin-orders-btn-console-${order.id}`}
            title="Điều phối chi tiết"
            onClick={() => onOpenConsole(order)}
            className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-xs border border-outline-variant/30 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Chi tiết</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

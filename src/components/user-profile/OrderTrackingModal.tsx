import React from 'react';
import { OrderDisplay } from './types';

export interface OrderTrackingModalProps {
  isOpen: boolean;
  order: OrderDisplay | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const carrierName = order.carrier || 'BookVerse Express (Giao Hàng Tiêu Chuẩn)';
  const trackingNumber = order.trackingNumber || 'BVE-98421-VN';
  const estDate = order.estimatedDelivery || '28/10/2026';

  const timelineSteps = [
    {
      title: 'Đã tiếp nhận đơn hàng',
      desc: 'Hệ thống đã ghi nhận đơn ' + order.orderNumber,
      done: true,
      time: order.date + ' 09:15',
    },
    {
      title: 'Đã xác nhận thanh toán',
      desc: order.paymentMethod === 'VietQR' ? 'Đối soát VietQR tự động thành công' : 'Xác nhận phương thức COD',
      done: order.status !== 'pending',
      time: order.date + ' 09:30',
    },
    {
      title: 'Đang chuẩn bị ấn phẩm',
      desc: 'Bọc màng co và đóng thùng chống ẩm tiêu chuẩn',
      done: order.status === 'processing' || order.status === 'delivered',
      time: order.date + ' 14:00',
    },
    {
      title: 'Đang trên đường giao',
      desc: 'Kiện hàng đang được luân chuyển bởi ' + carrierName,
      done: order.status === 'delivered',
      time: 'Dự kiến: ' + estDate,
    },
    {
      title: 'Giao hàng thành công',
      desc: 'Độc giả đã ký nhận bưu phẩm nguyên vẹn',
      done: order.status === 'delivered',
      time: order.deliveredDate || 'Hoàn tất',
    },
  ];

  return (
    <div
      id="order-tracking-modal"
      data-testid="user-profile-tracking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-space-md bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Hành trình đơn hàng {order.orderNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg flex flex-col space-y-space-md">
          {/* Carrier Info Card */}
          <div className="p-space-md bg-surface-container-low/60 rounded-lg flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-body-xs text-body-xs text-outline">Đơn vị vận chuyển</span>
              <span className="font-label-md text-label-md font-bold text-primary">
                {carrierName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-xs text-body-xs text-outline">Mã vận đơn bưu cục</span>
              <span className="font-label-md text-label-md font-bold text-on-surface tracking-wide num-tabular">
                {trackingNumber}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/30">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition-colors ${
                    step.done
                      ? 'bg-primary border-primary ring-2 ring-primary/20'
                      : 'bg-surface-container-low border-outline'
                  }`}
                />
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-label-md text-label-md font-bold ${
                      step.done ? 'text-on-surface' : 'text-on-surface-variant'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="font-body-xs text-body-xs text-outline num-tabular">
                    {step.time}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end pt-space-sm border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer"
            >
              Đóng tra cứu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;

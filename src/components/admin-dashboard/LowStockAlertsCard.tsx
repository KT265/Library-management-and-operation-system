import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { StockAlertItem } from './types';

export interface LowStockAlertsCardProps {
  alerts?: StockAlertItem[];
  loading?: boolean;
}

export const LowStockAlertsCard: React.FC<LowStockAlertsCardProps> = ({
  alerts,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [internalAlerts, setInternalAlerts] = useState<StockAlertItem[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  useEffect(() => {
    if (alerts !== undefined) return;
    let isMounted = true;
    setInternalLoading(true);

    getDocs(collection(db, FIRESTORE_COLLECTIONS.BOOKS))
      .then((booksSnap) => {
        if (!isMounted) return;
        const booksData = booksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const lowStock: StockAlertItem[] = booksData
          .filter((b: any) => (b.stockQuantity ?? b.stockCount ?? 0) < 10)
          .map((b: any) => {
            const copiesLeft = b.stockQuantity ?? b.stockCount ?? 0;
            return {
              id: b.id,
              title: b.title || 'Chưa có tiêu đề',
              author: b.nameAuthor || b.author || 'Tác giả',
              isbn: b.ISBN12 || b.specifications?.isbn || 'N/A',
              copiesLeft,
              coverImage:
                b.imgCoverPage ||
                b.coverImage ||
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
              coverAlt: `Bìa sách ${b.title || ''}`,
              dotColor: copiesLeft <= 2 ? 'bg-error' : 'bg-tertiary',
              alertText:
                copiesLeft === 0
                  ? 'Đã hết hàng trong kho'
                  : copiesLeft <= 2
                  ? `Chỉ còn ${copiesLeft} bản trong kho`
                  : `Còn ${copiesLeft} bản trong kho`,
              alertClasses:
                copiesLeft <= 2
                  ? 'font-label-sm text-label-sm font-bold text-error'
                  : 'font-label-sm text-label-sm font-bold text-tertiary',
            };
          });
        setInternalAlerts(lowStock);
      })
      .catch((err) => {
        console.error('[LowStockAlertsCard] Error querying Books from Firestore:', err);
      })
      .finally(() => {
        if (isMounted) setInternalLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [alerts]);

  const activeAlerts = alerts !== undefined ? alerts : internalAlerts;
  const isCardLoading = loading || (alerts === undefined && internalLoading);

  return (
    <div
      id="dashboard-stock-alerts-card"
      data-testid="admin-dashboard-low-stock-card"
      className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30"
    >
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <h2
                id="stock-alerts-title"
                data-testid="admin-dashboard-low-stock-title"
                className="font-title-lg text-title-lg font-bold text-primary"
              >
                Cảnh báo tồn kho
              </h2>
              <p className="font-body-sm text-body-sm text-secondary">
                Các ấn phẩm sắp hết hàng cần nhập bổ sung (&lt; 10 cuốn)
              </p>
            </div>
          </div>
          <span
            id="badge-critical-stock-count"
            data-testid="admin-dashboard-low-stock-badge-count"
            className="bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full"
          >
            {activeAlerts.length} Cần nhập
          </span>
        </div>

        {/* Stock List / Empty State */}
        {isCardLoading ? (
          <div className="py-8 text-center text-secondary font-label-md flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
            <p>Đang kiểm tra tồn kho...</p>
          </div>
        ) : activeAlerts.length === 0 ? (
          <div
            id="stock-alerts-empty-state"
            data-testid="admin-dashboard-low-stock-empty"
            className="p-space-lg text-center bg-surface rounded-2xl border border-outline-variant/20 py-8"
          >
            <span className="material-symbols-outlined text-4xl text-secondary mb-2">check_circle</span>
            <p className="font-title-sm font-semibold text-primary">Tồn kho an toàn</p>
            <p className="font-body-sm text-secondary mt-1">
              Tất cả ấn phẩm trong kho sách đều đạt định mức tồn an toàn (&ge; 10 cuốn).
            </p>
          </div>
        ) : (
          <div
            id="stock-alerts-list"
            data-testid="admin-dashboard-low-stock-list"
            className="space-y-space-sm"
          >
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                id={`stock-alert-item-${alert.id}`}
                data-testid={`admin-dashboard-low-stock-item-${alert.id}`}
                className="p-space-md rounded-2xl bg-surface hover:bg-surface-container/60 transition-colors flex items-center justify-between gap-space-md border border-outline-variant/20"
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
                  id={`btn-restock-${alert.id}`}
                  data-testid={`admin-dashboard-low-stock-btn-restock-${alert.id}`}
                  onClick={() => navigate('/admin/inventory')}
                  className="shrink-0 text-xs text-primary font-semibold hover:underline hidden sm:inline-flex items-center gap-0.5 cursor-pointer bg-surface-container px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span>Nhập kho</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-space-md pt-space-sm text-center">
        <button
          type="button"
          id="btn-manage-all-inventory"
          data-testid="admin-dashboard-low-stock-btn-manage-all"
          onClick={() => navigate('/admin/inventory')}
          className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Xem toàn bộ Kho sách</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default LowStockAlertsCard;

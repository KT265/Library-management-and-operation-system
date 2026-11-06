import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockAlertItem } from './types';

const STOCK_ALERTS: StockAlertItem[] = [
  {
    id: 'alert-1',
    title: 'Norwegian Wood (Rừng Na Uy)',
    author: 'Haruki Murakami',
    isbn: '978-0307744661',
    copiesLeft: 2,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-tjGNFabNIRWPpQbea61qHTfRUKjfJEjhnYgcttODLs43injb6bB0vOv9AuOw3ZJTNRbBSk5TBGZibQeuILerlB893SFDBWXF5HOPgUsm-OXOSxXsvLwvBLqc8Yfd13PrZZc_OOWLUUOUACwa39gmzHewA_aE3bbC_uRw4uwvFmpSaHKT34WIQPoIQ_xm4QbeM7LCvZ2qsyu09PsdFgntn1m1kRW4CWGw8ovUKfYM',
    coverAlt:
      'Bìa sách Rừng Na Uy - Haruki Murakami',
    dotColor: 'bg-error',
    alertText: 'Chỉ còn 2 bản trong kho',
    alertClasses: 'font-label-sm text-label-sm font-bold text-error',
  },
  {
    id: 'alert-2',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    isbn: '978-1635575637',
    copiesLeft: 3,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDo6MYjfBSW8u2ZoP0V4pVcL5OK8JTBdAh4ur7rJGR7ue_wLPUOnBvm48p9C6Rk74cwdhRrJjY81M8H7Waxq89dbY0p_wZE4cl9opT1oBoHetjHOAfnkd3SYWG3lVA-E75JmByOBpPBRE7CQzpMchT6O0lpimsBG1-xe84T-N69SQ7FMF9IValngwU1yyQzg6X9vrjwByV3RVXH4K26CFayXZeB6lZ7sntAkbQvTpY',
    coverAlt:
      'Bìa sách Piranesi - Susanna Clarke',
    dotColor: 'bg-tertiary',
    alertText: 'Còn 3 bản trong kho',
    alertClasses: 'font-label-sm text-label-sm font-bold text-tertiary',
  },
  {
    id: 'alert-3',
    title: 'Invisible Cities (Những thành phố vô hình)',
    author: 'Italo Calvino',
    isbn: '978-0156453806',
    copiesLeft: 1,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAorltsVX6b6skd2IsRHxQdS7tiTHKpvJQKV98W28tWjOIgmGrAHrfa3URQKnL52FCaUhzon6wtWG5tsxhhvozflN7ePtw_STOwj8Og2Y6WCbQxbnSKts31gJo9oZnLPqIpz9y5UCKI0VkAmJnoik6NSlYbPs1cd3-DbNd_ay26BiuvAMmb_DzUzMqhk5gHER9zqLM0RgwZvBzjR700VdftEQzRsyvUkEkeLa9jb1aQ',
    coverAlt:
      'Bìa sách Những thành phố vô hình - Italo Calvino',
    dotColor: 'bg-error',
    alertText: 'Chỉ còn 1 bản trong kho',
    alertClasses: 'font-label-sm text-label-sm font-bold text-error',
  },
];

export const LowStockAlertsCard: React.FC = () => {
  const navigate = useNavigate();

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
            3 Cần nhập
          </span>
        </div>

        {/* Stock List */}
        <div
          id="stock-alerts-list"
          data-testid="admin-dashboard-low-stock-list"
          className="space-y-space-sm"
        >
          {STOCK_ALERTS.map((alert) => (
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

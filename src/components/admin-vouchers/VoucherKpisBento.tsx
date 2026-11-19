import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { AdminVoucher } from './types';
import { parseDateToMs } from '../../hooks/useVoucherStatusCheck';

export interface VoucherKpisBentoProps {
  vouchers?: AdminVoucher[];
}

export const VoucherKpisBento: React.FC<VoucherKpisBentoProps> = ({ vouchers: propVouchers }) => {
  const [liveKpis, setLiveKpis] = useState({
    activeCount: 0,
    totalRedemptions: 0,
    expiringSoonCount: 0,
  });

  useEffect(() => {
    // If propVouchers is provided and non-empty, we can calculate from it
    if (propVouchers && propVouchers.length > 0) {
      const now = Date.now();
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;

      let active = 0;
      let redemptions = 0;
      let expiring = 0;

      for (const v of propVouchers) {
        // 1. MÃ ƯU ĐÃI ĐANG HIỆU LỰC: Sum where stateVoucher === true
        if (v.stateVoucher === true || (v.stateVoucher !== false && v.status === 'active')) {
          active++;
        }

        // 2. TỔNG LƯỢT SỬ DỤNG: Total sum of usedCount
        redemptions += Number(v.usedCount) || 0;

        // 3. SẮP HẾT THỜI HẠN ƯU ĐÃI: expiryDate is within exactly 5 days from now
        const expMs = parseDateToMs(v.expiryDate, true);
        if (expMs !== null && expMs >= now && expMs - now <= fiveDaysMs) {
          expiring++;
        }
      }

      setLiveKpis({
        activeCount: active,
        totalRedemptions: redemptions,
        expiringSoonCount: expiring,
      });
      return;
    }

    // Otherwise, listen in real-time from Firestore collection "Vouchers"
    const unsubscribe = onSnapshot(
      collection(db, 'Vouchers'),
      (snapshot) => {
        const now = Date.now();
        const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;

        let active = 0;
        let redemptions = 0;
        let expiring = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // 1. MÃ ƯU ĐÃI ĐANG HIỆU LỰC: stateVoucher === true
          if (data.stateVoucher === true) {
            active++;
          }

          // 2. TỔNG LƯỢT SỬ DỤNG: sum of usedCount
          redemptions += Number(data.usedCount) || 0;

          // 3. SẮP HẾT THỜI HẠN: within 5 days from new Date()
          const expMs = parseDateToMs(data.expiryDate, true);
          if (expMs !== null && expMs >= now && expMs - now <= fiveDaysMs) {
            expiring++;
          }
        });

        setLiveKpis({
          activeCount: active,
          totalRedemptions: redemptions,
          expiringSoonCount: expiring,
        });
      },
      (err) => {
        console.error('[VoucherKpisBento] Error listening to Vouchers collection:', err);
      }
    );

    return () => unsubscribe();
  }, [propVouchers]);

  return (
    <div
      id="voucher-kpis-grid"
      data-testid="admin-vouchers-kpis-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
    >
      {/* Card 1: Active Vouchers */}
      <div
        id="kpi-active-vouchers"
        data-testid="admin-vouchers-kpi-active"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Mã ưu đãi đang hiệu lực
          </span>
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-active-vouchers-value"
              data-testid="admin-vouchers-kpi-active-val"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              {liveKpis.activeCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-secondary font-title-sm text-title-sm">mã</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Redemptions */}
      <div
        id="kpi-total-redemptions"
        data-testid="admin-vouchers-kpi-redemptions"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Tổng lượt sử dụng
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">redeem</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-total-redemptions-value"
              data-testid="admin-vouchers-kpi-redemptions-val"
              className="font-display-md text-display-md font-bold text-primary tracking-tight num-tabular"
            >
              {liveKpis.totalRedemptions.toLocaleString('vi-VN')}
            </span>
            <span className="text-secondary font-title-sm text-title-sm">lượt</span>
          </div>
        </div>
      </div>

      {/* Card 3: Expiring Soon */}
      <div
        id="kpi-expiring-soon"
        data-testid="admin-vouchers-kpi-expiring"
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-semibold text-secondary uppercase tracking-wider">
            Sắp hết thời hạn ưu đãi
          </span>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">timer</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span
              id="kpi-expiring-value"
              data-testid="admin-vouchers-kpi-expiring-val"
              className="font-display-md text-display-md font-bold text-tertiary tracking-tight num-tabular"
            >
              {liveKpis.expiringSoonCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-tertiary font-title-sm text-title-sm">mã sắp hết hạn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

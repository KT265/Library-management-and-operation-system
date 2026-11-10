import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  limit,
} from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS, mapFirestoreOrderToOrder } from '../services/firebase';
import { useStore } from '../store/useStore';
import { Order } from '../types';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderCodeParam = searchParams.get('orderCode');
  const statusParam = searchParams.get('status') || 'PAID';
  const codeParam = searchParams.get('code');
  const idParam = searchParams.get('id');

  const { clearCart } = useStore();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Purge cart items upon successful checkout completion
    clearCart();

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (!orderCodeParam && !idParam) {
          if (isMounted) setLoading(false);
          return;
        }

        const orderNum = orderCodeParam ? Number(orderCodeParam) : NaN;
        let matchedDocSnap: any = null;

        // 1. Query by numeric orderCode
        if (!Number.isNaN(orderNum)) {
          const qNum = query(
            collection(db, FIRESTORE_COLLECTIONS.ORDER),
            where('orderCode', '==', orderNum),
            limit(1)
          );
          const snapNum = await getDocs(qNum);
          if (!snapNum.empty) {
            matchedDocSnap = snapNum.docs[0];
          }
        }

        // 2. Query by string orderCode or codeOrder
        if (!matchedDocSnap && orderCodeParam) {
          const qStr = query(
            collection(db, FIRESTORE_COLLECTIONS.ORDER),
            where('orderCode', '==', orderCodeParam),
            limit(1)
          );
          const snapStr = await getDocs(qStr);
          if (!snapStr.empty) {
            matchedDocSnap = snapStr.docs[0];
          } else {
            const qCode = query(
              collection(db, FIRESTORE_COLLECTIONS.ORDER),
              where('codeOrder', '==', orderCodeParam),
              limit(1)
            );
            const snapCode = await getDocs(qCode);
            if (!snapCode.empty) {
              matchedDocSnap = snapCode.docs[0];
            }
          }
        }

        // 3. Fallback: Query by doc ID if idParam is present
        if (!matchedDocSnap && idParam) {
          const directRef = doc(db, FIRESTORE_COLLECTIONS.ORDER, idParam);
          const directSnap = await getDoc(directRef);
          if (directSnap.exists()) {
            matchedDocSnap = directSnap;
          }
        }

        if (matchedDocSnap && isMounted) {
          const raw = matchedDocSnap.data();

          // Reconcile payment status to PAID in Firestore if not already set
          if (raw.statusPayment !== 'PAID') {
            try {
              await setDoc(
                matchedDocSnap.ref,
                {
                  statusPayment: 'PAID',
                  updateAt: new Date().toISOString(),
                },
                { merge: true }
              );
              raw.statusPayment = 'PAID';
            } catch (updateErr) {
              console.warn('[PaymentSuccess] Unable to update statusPayment:', updateErr);
            }
          }

          const mapped = mapFirestoreOrderToOrder(raw, matchedDocSnap.id);
          setOrderData(mapped);
        }
      } catch (err) {
        console.error('[PaymentSuccess] Error resolving order details:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderCodeParam, idParam, clearCart]);

  const displayOrderCode =
    orderCodeParam || (orderData?.orderNumber ? orderData.orderNumber.replace('#', '') : '1794309081702');
  const displayAmount = orderData?.totalAmount;

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-body-md text-on-surface-variant">Đang tải thông tin xác nhận thanh toán...</p>
      </div>
    );
  }

  return (
    <div
      id="payment-success-page"
      data-testid="payment-success-page"
      className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-lg w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,54,93,0.06)] border border-surface-container-high text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[48px] text-emerald-600">
            check_circle
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
          Thanh toán thành công!
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Cảm ơn bạn đã tin tưởng BookVerse. Giao dịch thanh toán PayOS đã hoàn tất và đơn hàng của bạn đang được chuẩn bị.
        </p>

        {/* Order Details Table */}
        <div className="bg-surface-container-low rounded-2xl p-5 mb-8 text-left space-y-3 border border-surface-container-high/60">
          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
            <span className="font-body-sm text-on-surface-variant">Mã đơn hàng</span>
            <span
              id="payment-success-order-code"
              data-testid="payment-success-order-code"
              className="font-title-sm font-semibold text-primary"
            >
              #{displayOrderCode}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
            <span className="font-body-sm text-on-surface-variant">Trạng thái thanh toán</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {statusParam === 'PAID' ? 'Đã thanh toán (PAID)' : statusParam}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
            <span className="font-body-sm text-on-surface-variant">Phương thức</span>
            <span className="font-body-sm font-medium text-on-surface">Cổng PayOS (VietQR / Napas247)</span>
          </div>

          {codeParam && (
            <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
              <span className="font-body-sm text-on-surface-variant">Mã phản hồi</span>
              <span className="font-label-sm text-outline">{codeParam}</span>
            </div>
          )}

          {displayAmount !== undefined && (
            <div className="flex justify-between items-center py-1 border-b border-surface-container-high/40">
              <span className="font-body-sm text-on-surface-variant">Tổng thanh toán</span>
              <span className="font-title-sm font-bold text-tertiary">
                {displayAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          )}

          {idParam && (
            <div className="flex justify-between items-center py-1">
              <span className="font-body-sm text-on-surface-variant">Mã giao dịch PayOS</span>
              <span className="font-label-sm text-outline truncate max-w-[200px]">{idParam}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            id="btn-success-view-orders"
            data-testid="payment-success-orders-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-semibold shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>Xem đơn hàng của tôi</span>
          </Link>
          <Link
            to="/catalog"
            id="btn-success-continue-catalog"
            data-testid="payment-success-catalog-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-label-lg font-semibold hover:bg-surface-container-highest transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span>Tiếp tục mua sách</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

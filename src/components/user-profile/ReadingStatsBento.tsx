import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useStore } from '../../store/useStore';

interface ReadingStatsBentoProps {
  completedOrdersCount?: number;
  totalOrdersCount?: number;
  booksReadCount?: number;
}

export const ReadingStatsBento: React.FC<ReadingStatsBentoProps> = ({
  completedOrdersCount,
  totalOrdersCount,
  booksReadCount,
}) => {
  const currentUser = useStore((state) => state.user);

  const [realtimeOrderCount, setRealtimeOrderCount] = useState<number | null>(null);
  const [realtimeReadBookCount, setRealtimeReadBookCount] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    // 1. Real-time query to count orders for currentUser
    const ordersQuery = query(
      collection(db, 'Order'),
      where('idUser', '==', currentUser.id)
    );

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        setRealtimeOrderCount(snapshot.docs.length);
      },
      (err) => {
        console.error('[ReadingStatsBento] Error listening to user orders:', err);
      }
    );

    // 2. Real-time listener on Users document for exact readBookCount
    const userDocRef = doc(db, 'Users', currentUser.id);
    const unsubUser = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRealtimeReadBookCount(
            typeof data.readBookCount === 'number' ? data.readBookCount : 0
          );
        }
      },
      (err) => {
        console.error('[ReadingStatsBento] Error listening to user readBookCount:', err);
      }
    );

    return () => {
      unsubOrders();
      unsubUser();
    };
  }, [currentUser?.id]);

  // Determine display values: prefer real-time query, then passed props, default to 0
  const displayOrders =
    realtimeOrderCount !== null
      ? realtimeOrderCount
      : totalOrdersCount !== undefined
      ? totalOrdersCount
      : completedOrdersCount !== undefined
      ? completedOrdersCount
      : 0;

  const displayBooks =
    realtimeReadBookCount !== null
      ? realtimeReadBookCount
      : booksReadCount !== undefined
      ? booksReadCount
      : 0;

  return (
    <div
      id="reading-stats-bento"
      data-testid="user-profile-stats"
      className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg"
    >
      {/* Bento Card 1: Tổng số đơn hàng */}
      <div
        id="stat-card-completed-orders"
        data-testid="user-profile-stats-card-completed-orders"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Tổng số đơn hàng
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            {displayOrders}
          </span>
          <span className="font-body-xs text-body-xs text-outline mt-0.5 block">
            {displayOrders} đơn hàng
          </span>
        </div>
      </div>

      {/* Bento Card 2: Sách đã đọc */}
      <div
        id="stat-card-books-read"
        data-testid="user-profile-stats-card-books-read"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Sách đã đọc
          </span>
          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            {displayBooks}
          </span>
          <span className="font-body-xs text-body-xs text-outline mt-0.5 block">
            {displayBooks} cuốn đã đọc
          </span>
        </div>
      </div>
    </div>
  );
};

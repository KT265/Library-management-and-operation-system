import { useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Parses timestamp / date input to milliseconds timestamp.
 * If isEndOfDay is true and input has no time component, sets time to 23:59:59.999.
 */
export function parseDateToMs(dateVal: any, isEndOfDay = false): number | null {
  if (!dateVal) return null;
  if (typeof dateVal.toMillis === 'function') {
    return dateVal.toMillis();
  }
  if (typeof dateVal.toDate === 'function') {
    return dateVal.toDate().getTime();
  }
  if (typeof dateVal.seconds === 'number') {
    return dateVal.seconds * 1000;
  }
  if (dateVal instanceof Date) {
    return dateVal.getTime();
  }
  if (typeof dateVal === 'string') {
    // If format is YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal.trim())) {
      const timeSuffix = isEndOfDay ? 'T23:59:59.999' : 'T00:00:00.000';
      const parsed = new Date(dateVal.trim() + timeSuffix).getTime();
      return isNaN(parsed) ? null : parsed;
    }
    const parsed = new Date(dateVal).getTime();
    return isNaN(parsed) ? null : parsed;
  }
  if (typeof dateVal === 'number') {
    return dateVal;
  }
  return null;
}

/**
 * Checks whether the current real-time falls outside the valid [startDate, expiryDate] window.
 * Returns true if invalid (currentTime < startDate OR currentTime > expiryDate).
 */
export function isVoucherOutOfDateWindow(
  startDateVal: any,
  expiryDateVal: any,
  now: number = Date.now()
): boolean {
  const startMs = parseDateToMs(startDateVal, false);
  const expiryMs = parseDateToMs(expiryDateVal, true);

  if (startMs !== null && now < startMs) {
    return true; // Not started yet -> invalid
  }
  if (expiryMs !== null && now > expiryMs) {
    return true; // Expired -> invalid
  }
  return false;
}

/**
 * Auto-checks all vouchers in Firestore and immediately updates stateVoucher to false
 * for any voucher whose current real-time is outside [startDate, expiryDate] while stateVoucher is still true.
 */
export async function autoDeactivateExpiredVouchers(): Promise<number> {
  const now = Date.now();
  let deactivatedCount = 0;

  try {
    const snap = await getDocs(collection(db, 'Vouchers'));
    const updates: Promise<void>[] = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const isInvalid = isVoucherOutOfDateWindow(data.startDate, data.expiryDate, now);

      if (isInvalid && data.stateVoucher === true) {
        updates.push(
          updateDoc(doc(db, 'Vouchers', docSnap.id), {
            stateVoucher: false,
            updateAt: serverTimestamp(),
          }).then(() => {
            deactivatedCount++;
          }).catch((err) => {
            console.error(`[AutoExpire] Lỗi khi cập nhật voucher ${docSnap.id}:`, err);
          })
        );
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }
  } catch (err) {
    console.error('[useVoucherStatusCheck] Lỗi kiểm tra tự động trạng thái voucher:', err);
  }

  return deactivatedCount;
}

/**
 * React hook to auto-run status check on mount.
 */
export function useVoucherStatusCheck(onStatusUpdated?: () => void) {
  useEffect(() => {
    let isMounted = true;
    autoDeactivateExpiredVouchers().then((count) => {
      if (isMounted && count > 0 && onStatusUpdated) {
        onStatusUpdated();
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
}


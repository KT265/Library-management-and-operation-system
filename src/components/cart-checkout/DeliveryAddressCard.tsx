import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { RecipientInfo } from './types';

export interface DeliveryAddressCardProps {
  recipient: RecipientInfo;
  onChangeAddress: () => void;
  /**
   * Optional callback — when the component successfully fetches the user's
   * Firestore address it notifies CartCheckout so the form is pre-filled too.
   */
  onFirestoreAddressLoaded?: (address: RecipientInfo) => void;
}

export const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({
  recipient,
  onChangeAddress,
  onFirestoreAddressLoaded,
}) => {
  const [displayRecipient, setDisplayRecipient] = useState<RecipientInfo>(recipient);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);

  /* ─────────────────────────────────────────────
   * Fetch authenticated user's Firestore profile
   * ─────────────────────────────────────────── */
  useEffect(() => {
    let isMounted = true;

    const fetchUserAddress = async () => {
      try {
        setIsFetchingUser(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          // Not authenticated — keep the prop value as-is
          return;
        }

        const uid = currentUser.uid;
        let userData: Record<string, any> | null = null;

        // 1. Try direct document lookup by UID
        const directRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
        const directSnap = await getDoc(directRef);
        if (directSnap.exists()) {
          userData = directSnap.data();
        }

        // 2. Fallback: query by id field
        if (!userData) {
          const qId = query(
            collection(db, FIRESTORE_COLLECTIONS.USERS),
            where('id', '==', uid),
            limit(1)
          );
          const snapId = await getDocs(qId);
          if (!snapId.empty) {
            userData = snapId.docs[0].data();
          }
        }

        // 3. Fallback: query by emailUser field
        if (!userData && currentUser.email) {
          const qEmail = query(
            collection(db, FIRESTORE_COLLECTIONS.USERS),
            where('emailUser', '==', currentUser.email),
            limit(1)
          );
          const snapEmail = await getDocs(qEmail);
          if (!snapEmail.empty) {
            userData = snapEmail.docs[0].data();
          }
        }

        if (!userData || !isMounted) return;

        /* ── Map Firestore fields to RecipientInfo ── */
        const name = userData.nameUser || userData.name || recipient.name;
        const phone = userData.numTelephone || userData.phone || recipient.phone;

        // addresUser is an array: [city, district, detailAddress]
        // addressUser can be an array of objects: [{ city, district, detail }]
        let city = recipient.city;
        let district = recipient.district;
        let street = recipient.street;

        if (Array.isArray(userData.addresUser) && userData.addresUser.length > 0) {
          const first = userData.addresUser[0];
          if (typeof first === 'object' && first !== null) {
            city = first.city || city;
            district = first.district || district;
            street = first.detail || street;
          } else {
            // flat array: [city, district, detail]
            city = userData.addresUser[0] || city;
            district = userData.addresUser[1] || district;
            street = userData.addresUser[2] || street;
          }
        } else if (Array.isArray(userData.addressUser) && userData.addressUser.length > 0) {
          const first = userData.addressUser[0];
          if (typeof first === 'object' && first !== null) {
            city = first.city || city;
            district = first.district || district;
            street = first.detail || street;
          } else {
            city = userData.addressUser[0] || city;
            district = userData.addressUser[1] || district;
            street = userData.addressUser[2] || street;
          }
        }

        const loaded: RecipientInfo = {
          name,
          phone,
          city,
          district,
          street,
          addressType: recipient.addressType,
          isDefault: true,
        };

        setDisplayRecipient(loaded);

        // Notify parent so the edit form is also pre-filled with Firestore data
        if (onFirestoreAddressLoaded) {
          onFirestoreAddressLoaded(loaded);
        }
      } catch (err) {
        console.warn('[DeliveryAddressCard] Could not fetch user address from Firestore:', err);
      } finally {
        if (isMounted) setIsFetchingUser(false);
      }
    };

    fetchUserAddress();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent updates recipient (e.g. user edits the form), reflect it
  useEffect(() => {
    setDisplayRecipient(recipient);
  }, [recipient]);

  const fullAddress = [displayRecipient.street, displayRecipient.district, displayRecipient.city]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      id="delivery-address-display"
      data-testid="cart-checkout-delivery-card"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm mb-space-lg"
    >
      <div className="flex items-start justify-between gap-space-sm mb-space-sm">
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[20px]">location_on</span>
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            Địa chỉ nhận hàng
          </h3>
          {isFetchingUser && (
            <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin ml-1" />
          )}
        </div>

        <button
          id="changeAddressBtn"
          data-testid="cart-checkout-delivery-card-btn-change"
          type="button"
          onClick={onChangeAddress}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Thay đổi</span>
        </button>
      </div>

      <div className="flex flex-col space-y-1.5 pl-7">
        <div className="flex flex-wrap items-center gap-2">
          <span
            id="display-recipient-name"
            data-testid="cart-checkout-delivery-card-name"
            className="font-label-lg text-label-lg font-bold text-on-surface"
          >
            {displayRecipient.name}
          </span>
          <span className="text-outline-variant select-none">•</span>
          <span
            id="display-recipient-phone"
            data-testid="cart-checkout-delivery-card-phone"
            className="font-body-md text-body-md text-on-surface-variant font-medium num-tabular"
          >
            {displayRecipient.phone}
          </span>
          <span
            id="display-recipient-tag"
            data-testid="cart-checkout-delivery-card-tag"
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container text-on-secondary-container"
          >
            {displayRecipient.addressType === 'Primary Residence' ? 'Nhà riêng' : 'Văn phòng'}
          </span>
        </div>

        <p
          id="display-recipient-address"
          data-testid="cart-checkout-delivery-card-address"
          className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
        >
          {fullAddress || 'Chưa cập nhật địa chỉ'}
        </p>
      </div>
    </div>
  );
};

export default DeliveryAddressCard;

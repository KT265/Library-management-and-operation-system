import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../services/firebase';
import { createPayOsPaymentLink } from '../services/payos';
import { useStore } from '../store/useStore';
import { Order } from '../types';
import {
  RecipientInfo,
  AppliedVoucher,
  ShippingTier,
  PaymentMethod,
} from '../components/cart-checkout/types';
import { CheckoutStepper } from '../components/cart-checkout/CheckoutStepper';
import { CartItemList } from '../components/cart-checkout/CartItemList';
import { DeliveryAddressCard } from '../components/cart-checkout/DeliveryAddressCard';
import { DeliveryAddressForm } from '../components/cart-checkout/DeliveryAddressForm';
import { ShippingTierSelector } from '../components/cart-checkout/ShippingTierSelector';
import { OrderSummaryCard } from '../components/cart-checkout/OrderSummaryCard';
import { VoucherInputBox } from '../components/cart-checkout/VoucherInputBox';
import { PaymentMethodTabs } from '../components/cart-checkout/PaymentMethodTabs';
import { CodPaymentPanel } from '../components/cart-checkout/CodPaymentPanel';
import { VietQrPaymentPanel } from '../components/cart-checkout/VietQrPaymentPanel';

const DEFAULT_RECIPIENT: RecipientInfo = {
  name: 'Alex Nguyễn',
  phone: '0908 345 678',
  city: 'TP. Hồ Chí Minh',
  district: 'Phường Bến Nghé, Quận 1',
  street: 'Tòa nhà Tower 3, Căn hộ 1402, 65 Đường Lê Lợi',
  addressType: 'Primary Residence',
  isDefault: true,
};

export const CartCheckout: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();
  const {
    cartItems,
    user,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    selectAllItems,
    clearCart,
    addOrder,
    showToast,
  } = store;

  // Shipping Tier State
  const [shippingTier, setShippingTier] = useState<ShippingTier>('standard');

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<RecipientInfo>({
    ...DEFAULT_RECIPIENT,
    name: user?.name || DEFAULT_RECIPIENT.name,
    phone: user?.phone || DEFAULT_RECIPIENT.phone,
  });
  const [addressFormData, setAddressFormData] = useState<RecipientInfo>({ ...recipient });

  // Voucher State - Clean defaults without mock vouchers
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<AppliedVoucher[]>([]);
  const [, setIsValidatingVoucher] = useState<boolean>(false);

  // Pre-fetch active vouchers from Firestore "Vouchers"
  useEffect(() => {
    const fetchActiveVouchers = async () => {
      try {
        const snap = await getDocs(collection(db, 'Vouchers'));
        const loaded: AppliedVoucher[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.stateVoucher !== false) {
            const code = (data.codeVouchers || data.code || '').toUpperCase();
            const isPercent = (data.typeVoucher || '').toUpperCase() === 'PERCENT';
            const isFreeship = (data.typeVoucher || '').toUpperCase() === 'FREESHIP';
            const val = data.rateVoucher ?? data.discountValue ?? 0;
            const minSpend = data.minimumVoucher ?? data.minSpend ?? 0;

            loaded.push({
              code,
              description:
                data.description ||
                (isPercent
                  ? `Giảm ${val}% cho đơn từ ${minSpend.toLocaleString('vi-VN')} ₫`
                  : isFreeship
                  ? `Miễn phí vận chuyển cho đơn từ ${minSpend.toLocaleString('vi-VN')} ₫`
                  : `Giảm ${val.toLocaleString('vi-VN')} ₫ cho đơn từ ${minSpend.toLocaleString('vi-VN')} ₫`),
              discountType: isPercent ? 'percentage' : 'fixed',
              discountValue: val,
              minSpend,
            });
          }
        });
        setAvailableVouchers(loaded);
      } catch (e) {
        console.warn('[CartCheckout] Could not load available vouchers from Firestore:', e);
      }
    };

    fetchActiveVouchers();
  }, []);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Computed Values
  const selectedItems = cartItems.filter((item) => item.selected);
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

  const rawSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = Math.round(rawSubtotal);

  // Shipping Fees in authentic VND
  const standardFee = subtotal >= 300000 ? 0 : 25000;
  const expressFee = 45000;
  let finalShippingFee = shippingTier === 'express' ? expressFee : standardFee;

  // Voucher Discount Logic
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === 'FREESHIP') {
      finalShippingFee = 0;
      discountAmount = 0;
    } else if (appliedVoucher.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
    } else {
      discountAmount = appliedVoucher.discountValue;
    }
  }
  discountAmount = Math.min(discountAmount, subtotal);

  // 8% VAT
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const salesTax = Math.round(taxableAmount * 0.08);

  // Final Total in VND
  const finalAmount = Math.max(0, taxableAmount + finalShippingFee + salesTax);

  // Transfer memo format: BOOKVERSE [AMOUNT_LAST4] [USER_FIRSTNAME]
  const amountCode = Math.floor(finalAmount) % 1000000;
  const userFirstCode = (recipient.name.trim().split(' ').pop() || 'READER').toUpperCase();
  const transferMemo = 'BOOKVERSE ' + amountCode + ' ' + userFirstCode;

  // Address Handlers
  const handleAddressFieldChange = (field: keyof RecipientInfo, val: any) => {
    setAddressFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFormData.name.trim() || !addressFormData.phone.trim() || !addressFormData.street.trim()) {
      showToast('Vui lòng điền đầy đủ các thông tin địa chỉ bắt buộc.');
      return;
    }
    setRecipient({ ...addressFormData });
    setIsEditingAddress(false);
    showToast('Đã cập nhật địa chỉ giao nhận hàng thành công.');
  };

  // Voucher Handlers
  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) {
      setVoucherError('Vui lòng nhập mã ưu đãi hợp lệ.');
      return;
    }

    setIsValidatingVoucher(true);
    setVoucherError(null);

    try {
      let targetVoucher = availableVouchers.find((v) => v.code === code);

      if (!targetVoucher) {
        // Query Firestore directly for this voucher code
        const q = query(collection(db, 'Vouchers'), where('codeVouchers', '==', code));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          if (data.stateVoucher !== false) {
            const isPercent = (data.typeVoucher || '').toUpperCase() === 'PERCENT';
            const val = data.rateVoucher ?? data.discountValue ?? 0;
            const minSpend = data.minimumVoucher ?? data.minSpend ?? 0;
            targetVoucher = {
              code,
              description: data.description || (isPercent ? `Giảm ${val}%` : `Giảm ${val.toLocaleString('vi-VN')} ₫`),
              discountType: isPercent ? 'percentage' : 'fixed',
              discountValue: val,
              minSpend,
            };
          }
        }
      }

      if (!targetVoucher) {
        setVoucherError('Mã ưu đãi không tồn tại hoặc đã hết hạn.');
        showToast('Mã ưu đãi không hợp lệ.');
        return;
      }

      if (subtotal < targetVoucher.minSpend) {
        setVoucherError(`Đơn hàng cần tối thiểu từ ${targetVoucher.minSpend.toLocaleString('vi-VN')} ₫ để áp dụng mã này.`);
        showToast('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã.');
        return;
      }

      setAppliedVoucher(targetVoucher);
      setVoucherError(null);
      showToast(`Đã áp dụng mã ưu đãi “${targetVoucher.code}” thành công!`);
    } catch (err: any) {
      console.error('[CartCheckout] Error validating voucher:', err);
      setVoucherError('Lỗi kiểm tra mã ưu đãi. Vui lòng thử lại.');
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError(null);
    setVoucherInput('');
    showToast('Đã hủy áp dụng mã ưu đãi.');
  };

  // Checkout Submission Handler
  const handleCheckout = async () => {
    // 1. Validate Cart
    if (selectedItems.length === 0) {
      showToast('Vui lòng chọn ít nhất một ấn phẩm trong giỏ để tiếp tục.');
      return;
    }

    // 2. Validate User Authentication
    if (!user) {
      showToast('Vui lòng đăng nhập trước khi tiến hành thanh toán.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setIsSubmitting(true);

    try {
      const codeOrder = `#BK-${Math.floor(10000 + Math.random() * 90000)}`;

      // 3. Save Order to Firestore collection "Order"
      const firestoreOrderData = {
        codeOrder,
        idUser: user.id || 'usr-guest',
        totalPrice: finalAmount,
        totalItems: selectedCount,
        subTotal: subtotal,
        discountAmount,
        salesTax,
        appliedVoucher: appliedVoucher?.code || null,
        statusPayment: paymentMethod === 'vietqr' ? 'PENDING' : 'PAID',
        statusOrder: 'PROCESSING',
        methodPayment: paymentMethod === 'vietqr' ? 'VIETQR' : 'COD',
        items: selectedItems.map((item) => ({
          bookId: item.bookId,
          idBook: item.bookId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          coverImage: item.coverImage,
        })),
        infoCustom: {
          name: recipient.name,
          phone: recipient.phone,
          email: user.email || '',
          cusName: recipient.name,
          cusPhone: recipient.phone,
          cusMail: user.email || '',
        },
        shipAddress: {
          city: recipient.city,
          district: recipient.district,
          street: recipient.street,
          addressType: recipient.addressType,
        },
        shipMethod: {
          tier: shippingTier,
          fee: finalShippingFee,
          method: shippingTier === 'express' ? 'Giao hàng hỏa tốc' : 'Giao hàng tiêu chuẩn',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let docId: string;
      try {
        const orderDocRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.ORDER), firestoreOrderData);
        docId = orderDocRef.id;
      } catch (fsErr) {
        console.warn('[CartCheckout] Direct addDoc failed, using fallback docId:', fsErr);
        docId = `ord-${Date.now()}`;
      }

      // Sync into local Zustand store
      const localStoreOrder: Order = {
        id: docId,
        orderNumber: codeOrder,
        userId: user.id,
        userName: recipient.name,
        userEmail: user.email || 'guest@bookverse.vn',
        items: selectedItems.map((item) => ({
          bookId: item.bookId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          coverImage: item.coverImage,
        })),
        subtotal,
        discount: discountAmount,
        shippingFee: finalShippingFee,
        totalAmount: finalAmount,
        total: finalAmount,
        status: paymentMethod === 'vietqr' ? 'pending' : 'processing',
        paymentStatus: paymentMethod === 'vietqr' ? 'pending' : 'paid',
        voucherCode: appliedVoucher?.code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addOrder(localStoreOrder);

      // 4. Execute Payment Flow
      if (paymentMethod === 'vietqr') {
        const origin =
          typeof window !== 'undefined' && window.location?.origin
            ? window.location.origin
            : 'http://localhost:5173';
        const paymentResponse = await createPayOsPaymentLink({
          docId,
          totalPrice: finalAmount,
          cancelUrl: `${origin}/payment-cancel`,
          returnUrl: `${origin}/payment-success`,
        });

        if (paymentResponse?.checkoutUrl) {
          showToast('Đang chuyển hướng tới cổng thanh toán PayOS...');
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = paymentResponse.checkoutUrl;
          }
          return;
        } else {
          throw new Error('Không nhận được checkoutUrl hợp lệ từ cổng thanh toán PayOS.');
        }
      } else {
        // COD Payment Flow
        selectedItems.forEach((item) => removeFromCart(item.id));
        showToast('Đặt hàng thành công! Cảm ơn bạn đã lựa chọn BookVerse.');
        navigate('/orders');
      }
    } catch (err: any) {
      console.error('[CartCheckout] Lỗi trong quá trình thanh toán:', err);
      showToast(err.message || 'Lỗi khi khởi tạo thanh toán PayOS. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="cart-checkout-page"
      data-testid="cart-checkout-page"
      className="bg-surface font-body-md text-on-surface antialiased min-h-screen py-space-lg px-gutter-sm sm:px-gutter"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Editorial Header */}
        <div className="mb-space-lg">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">Giỏ hàng &amp; Thanh toán</span>
          </div>

          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Giỏ hàng &amp; Hoàn tất đơn hàng
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Kiểm tra các ấn phẩm được tuyển chọn, áp dụng ưu đãi và tiến hành thanh toán đối soát tự động.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <CheckoutStepper currentStep={1} />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column (8 cols): Cart Items + Delivery Address + Shipping Tier + Payment Tabs */}
          <div className="lg:col-span-8 space-y-space-xl">
            {/* 1. Cart Items Workspace */}
            <CartItemList
              items={cartItems}
              selectedCount={selectedCount}
              totalCount={totalCount}
              allSelected={allSelected}
              onSelectAll={selectAllItems}
              onToggleItem={toggleItemSelection}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />

            {/* 2. Delivery Address Card / Form */}
            {isEditingAddress ? (
              <DeliveryAddressForm
                formData={addressFormData}
                onChange={handleAddressFieldChange}
                onSave={handleSaveAddress}
                onCancel={() => {
                  setAddressFormData({ ...recipient });
                  setIsEditingAddress(false);
                }}
              />
            ) : (
              <DeliveryAddressCard
                recipient={recipient}
                onChangeAddress={() => {
                  setAddressFormData({ ...recipient });
                  setIsEditingAddress(true);
                }}
              />
            )}

            {/* 3. Shipping Tier Selection */}
            <ShippingTierSelector
              selectedTier={shippingTier}
              onSelectTier={setShippingTier}
              subtotal={subtotal}
              standardFee={standardFee}
              expressFee={expressFee}
            />

            {/* 4. Payment Method Choice Tabs & Detail Panels */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <PaymentMethodTabs
                paymentMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />

              {paymentMethod === 'vietqr' ? (
                <VietQrPaymentPanel
                  finalAmount={finalAmount}
                  transferMemo={transferMemo}
                  onCopySuccess={showToast}
                />
              ) : (
                <CodPaymentPanel />
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Order Summary + Promo Code Sticky Box */}
          <div className="lg:col-span-4 space-y-space-md sticky top-6">
            {/* Promo Code Input Card */}
            <VoucherInputBox
              voucherInput={voucherInput}
              setVoucherInput={setVoucherInput}
              appliedVoucher={appliedVoucher}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              voucherError={voucherError}
              availableVouchers={availableVouchers}
            />

            {/* Financial Summary Card */}
            <OrderSummaryCard
              subtotal={subtotal}
              discountAmount={discountAmount}
              shippingFee={finalShippingFee}
              salesTax={salesTax}
              finalTotal={finalAmount}
              selectedCount={selectedCount}
              isSubmitting={isSubmitting}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;

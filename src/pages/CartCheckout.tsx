import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const VALID_VOUCHERS: AppliedVoucher[] = [
  {
    code: 'BOOKVERSE20',
    description: 'Giảm 20% cho đơn hàng từ 200.000 ₫',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 200000,
  },
  {
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn hàng từ 150.000 ₫',
    discountType: 'fixed',
    discountValue: 25000,
    minSpend: 150000,
  },
  {
    code: 'BIBLIO10',
    description: 'Giảm 50.000 ₫ cho đơn hàng từ 250.000 ₫',
    discountType: 'fixed',
    discountValue: 50000,
    minSpend: 250000,
  },
  {
    code: 'BOOKVERSE10',
    description: 'Giảm 10% tổng giá trị đơn từ 200.000 ₫',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 200000,
  },
  {
    code: 'WELCOME10',
    description: 'Ưu đãi 50.000 ₫ chào mừng độc giả mới từ 200.000 ₫',
    discountType: 'fixed',
    discountValue: 50000,
    minSpend: 200000,
  },
];

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

  // Voucher State
  const [voucherInput, setVoucherInput] = useState<string>('BOOKVERSE20');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(VALID_VOUCHERS[0]);
  const [voucherError, setVoucherError] = useState<string | null>(null);

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
  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) {
      setVoucherError('Vui lòng nhập mã ưu đãi hợp lệ.');
      return;
    }

    const found = VALID_VOUCHERS.find((v) => v.code === code);
    if (!found) {
      setVoucherError('Mã ưu đãi không tồn tại hoặc đã hết hạn.');
      showToast('Mã ưu đãi không hợp lệ.');
      return;
    }

    if (subtotal < found.minSpend) {
      setVoucherError('Đơn hàng cần tối thiểu từ mức quy định để áp dụng mã này.');
      showToast('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã.');
      return;
    }

    setAppliedVoucher(found);
    setVoucherError(null);
    showToast('Đã áp dụng mã ưu đãi thành công!');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError(null);
    setVoucherInput('');
    showToast('Đã hủy áp dụng mã ưu đãi.');
  };

  // Checkout Submission Handler
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showToast('Vui lòng chọn ít nhất một ấn phẩm trong giỏ để tiếp tục.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: '#BK-' + Math.floor(10000 + Math.random() * 90000),
        userId: user?.id || 'usr-guest',
        userName: recipient.name,
        userEmail: user?.email || 'guest@bookverse.vn',
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

      addOrder(newOrder);

      // Remove checked-out items from cart
      selectedItems.forEach((item) => removeFromCart(item.id));

      setIsSubmitting(false);
      showToast('Đặt hàng thành công! Cảm ơn bạn đã lựa chọn BookVerse.');
      navigate('/profile');
    }, 700);
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
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Kiểm tra ấn phẩm, áp dụng mã ưu đãi và thanh toán tiện lợi qua VietQR hoặc nhận hàng trả tiền (COD).
          </p>
        </div>

        {/* 1. Checkout Stepper */}
        <CheckoutStepper currentStep={3} />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Cart items, Address, Shipping, Payment */}
          <div className="lg:col-span-8 flex flex-col">
            {/* 2. Cart Item List & 3. Cart Item Rows */}
            <CartItemList
              items={cartItems}
              allSelected={allSelected}
              selectedCount={selectedCount}
              totalCount={totalCount}
              onSelectAll={selectAllItems}
              onToggleItem={toggleItemSelection}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />

            {/* 4. Delivery Address Card & 5. Delivery Address Form */}
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

            {/* 6. Shipping Tier Selector */}
            <ShippingTierSelector
              selectedTier={shippingTier}
              onSelectTier={setShippingTier}
              subtotal={subtotal}
              standardFee={standardFee}
              expressFee={expressFee}
            />

            {/* 9. Payment Method Tabs */}
            <PaymentMethodTabs
              paymentMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            {/* 10. COD Payment Panel OR 11. VietQR Payment Panel */}
            {paymentMethod === 'cod' ? (
              <CodPaymentPanel />
            ) : (
              <VietQrPaymentPanel
                finalAmount={finalAmount}
                transferMemo={transferMemo}
                onCopySuccess={(msg) => showToast(msg)}
              />
            )}
          </div>

          {/* Right Column: Voucher & Summary Card */}
          <div className="lg:col-span-4 flex flex-col space-y-space-md lg:sticky lg:top-24">
            {/* 8. Voucher Input Box */}
            <VoucherInputBox
              voucherInput={voucherInput}
              setVoucherInput={setVoucherInput}
              appliedVoucher={appliedVoucher}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              voucherError={voucherError}
              availableVouchers={VALID_VOUCHERS}
            />

            {/* 7. Order Summary Card */}
            <OrderSummaryCard
              subtotal={subtotal}
              shippingFee={finalShippingFee}
              discountAmount={discountAmount}
              salesTax={salesTax}
              finalTotal={finalAmount}
              isSubmitting={isSubmitting}
              selectedCount={selectedCount}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;

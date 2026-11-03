import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Order, OrderItem } from '../types';

interface RecipientInfo {
  name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  addressType: 'Primary Residence' | 'Office';
  isDefault: boolean;
}

interface AppliedVoucher {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
}

const DEFAULT_RECIPIENT: RecipientInfo = {
  name: 'Alex Nguyen',
  phone: '+84 908 345 678',
  city: 'Ho Chi Minh City',
  district: 'Ben Nghe, District 1',
  street: 'Tower 3, Apt 1402, 65 Le Loi Boulevard',
  addressType: 'Primary Residence',
  isDefault: true,
};

const VALID_VOUCHERS: AppliedVoucher[] = [
  {
    code: 'BIBLIO10',
    description: 'Giảm $10.00 cho đơn hàng từ $50',
    discountType: 'fixed',
    discountValue: 10.0,
    minSpend: 50.0,
  },
  {
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn hàng từ $25',
    discountType: 'fixed',
    discountValue: 4.99,
    minSpend: 25.0,
  },
  {
    code: 'BOOKVERSE10',
    description: 'Giảm 10% tổng hóa đơn cho đơn từ $30',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 30.0,
  },
  {
    code: 'WELCOME10',
    description: 'Ưu đãi $10 cho độc giả mới từ $30',
    discountType: 'fixed',
    discountValue: 10.0,
    minSpend: 30.0,
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
    showToast,
  } = store;

  // State: Shipping tier (Standard vs Express)
  const [shippingTier, setShippingTier] = useState<'standard' | 'express'>('standard');

  // State: Address display vs form
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<RecipientInfo>({
    ...DEFAULT_RECIPIENT,
    name: user?.name || DEFAULT_RECIPIENT.name,
    phone: user?.phone || DEFAULT_RECIPIENT.phone,
  });
  const [addressFormData, setAddressFormData] = useState<RecipientInfo>({ ...recipient });

  // State: Voucher
  const [voucherInput, setVoucherInput] = useState<string>('BIBLIO10');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(VALID_VOUCHERS[0]);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // State: Payment method (COD vs VietQR)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod');

  // State: Copy feedback
  const [copiedField, setCopiedField] = useState<'account' | 'memo' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Computed calculations
  const selectedItems = cartItems.filter((item) => item.selected);
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = Math.round(rawSubtotal * 100) / 100;

  // Shipping Fee calculation
  const baseShippingFee = shippingTier === 'express' ? 4.99 : 0.0;
  let finalShippingFee = baseShippingFee;

  // Voucher discount calculation
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === 'FREESHIP') {
      finalShippingFee = 0;
      discountAmount = 0; // Shipping waiver does not double-count as a merchandise discount
    } else if (appliedVoucher.discountType === 'percentage') {
      discountAmount = Math.round(((subtotal * appliedVoucher.discountValue) / 100) * 100) / 100;
    } else {
      discountAmount = appliedVoucher.discountValue;
    }
  }
  // Discount cannot exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  // 8% Estimated Sales Tax on (subtotal - discount)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const salesTax = Math.round(taxableAmount * 0.08 * 100) / 100;

  // Final Payable Total
  const finalAmount = Math.max(0, Math.round((taxableAmount + finalShippingFee + salesTax) * 100) / 100);

  // Dynamic VND Equivalent (~25,370 VND/USD rounded to nearest 1,000 VND)
  const vndRawAmount = Math.round((finalAmount * 25370) / 1000) * 1000;

  // Transfer memo format: BOOKVERSE [AMOUNT_LAST4] [USER_FIRSTNAME]
  const amountCode = Math.floor(finalAmount * 100) % 10000;
  const userFirstCode = (recipient.name.trim().split(' ').pop() || 'READER').toUpperCase();
  const transferMemo = `BOOKVERSE ${amountCode || 9184} ${userFirstCode}`;

  // Copy to clipboard helper
  const handleCopy = (text: string, field: 'account' | 'memo') => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`Đã sao chép "${text}" vào clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Voucher submission
  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVoucherError(null);
    const codeClean = voucherInput.trim().toUpperCase();
    if (!codeClean) {
      setVoucherError('Vui lòng nhập mã giảm giá.');
      return;
    }
    const matched = VALID_VOUCHERS.find((v) => v.code === codeClean);
    if (!matched) {
      setVoucherError(`Mã "${codeClean}" không tồn tại hoặc đã hết hạn.`);
      showToast(`Mã giảm giá "${codeClean}" không hợp lệ`);
      return;
    }
    if (subtotal < matched.minSpend) {
      setVoucherError(`Mã ${matched.code} yêu cầu đơn hàng từ $${matched.minSpend.toFixed(2)} trở lên.`);
      showToast(`Chưa đạt giá trị đơn hàng tối thiểu ($${matched.minSpend.toFixed(2)})`);
      return;
    }
    setAppliedVoucher(matched);
    showToast(`Áp dụng mã ${matched.code} thành công (-$${matched.discountValue})`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError(null);
    showToast('Đã gỡ mã giảm giá');
  };

  // Save address form
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setRecipient({ ...addressFormData });
    setIsEditingAddress(false);
    showToast('Đã cập nhật thông tin địa chỉ giao hàng');
  };

  // Order submission
  const handlePlaceOrder = () => {
    if (selectedCount === 0) {
      showToast('Vui lòng chọn ít nhất một cuốn sách để thanh toán');
      return;
    }

    setIsSubmitting(true);
    const orderNum = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: user?.id || 'usr-1',
      userName: recipient.name,
      userEmail: user?.email || 'customer@example.com',
      items: selectedItems.map(
        (i): OrderItem => ({
          bookId: i.bookId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          coverImage: i.coverImage,
        })
      ),
      subtotal,
      discount: discountAmount,
      shippingFee: finalShippingFee,
      totalAmount: finalAmount,
      status: paymentMethod === 'vietqr' ? 'processing' : 'pending',
      paymentStatus: paymentMethod === 'vietqr' ? 'paid' : 'pending',
      voucherCode: appliedVoucher?.code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Forward to Zustand store
    store.addOrder(newOrder);

    // Clear cart
    clearCart();

    // Feedback toast
    showToast(
      paymentMethod === 'vietqr'
        ? `Thanh toán VietQR thành công! Đơn hàng #${orderNum} đã được ghi nhận.`
        : `Đặt hàng COD thành công! Mã đơn: #${orderNum}.`
    );

    // Redirect to profile / orders history
    setTimeout(() => {
      navigate('/profile');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. TOP STEPPER ARCHITECTURE */}
      <div className="w-full border-b border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-gutter sm:px-gutter-lg py-3">
          <div className="flex items-center justify-between sm:justify-center sm:gap-12 text-sm font-label-md">
            {/* Step 1: Cart Items */}
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[15px] font-bold shadow-sm">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </span>
              <span className="hidden sm:inline">1. Giỏ hàng / Cart Items</span>
              <span className="sm:hidden">Giỏ hàng</span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-primary/30" />

            {/* Step 2: Delivery Destination (Active) */}
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-[13px] font-bold shadow-sm ring-4 ring-primary-fixed">
                2
              </span>
              <span className="hidden sm:inline">2. Địa chỉ giao nhận / Destination</span>
              <span className="sm:hidden">Giao nhận</span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-outline-variant/40" />

            {/* Step 3: VietQR Settlement */}
            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
              <span className="w-7 h-7 rounded-full bg-surface-container-high text-secondary flex items-center justify-center text-[13px] font-semibold">
                3
              </span>
              <span className="hidden sm:inline">3. Thanh toán / Settlement</span>
              <span className="sm:hidden">Thanh toán</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT LAYOUT SPLIT */}
      <div className="max-w-7xl w-full mx-auto px-gutter sm:px-gutter-lg py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Cart Items & Shipping Info (7 Columns)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-space-xl">
            {/* A. Cart Items Section */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[24px]">local_mall</span>
                  <h2 className="font-title-lg text-title-lg text-primary font-bold">
                    Items in Selection ({selectedCount})
                  </h2>
                </div>

                {cartItems.length > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer font-label-sm text-label-sm text-secondary hover:text-primary transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={cartItems.length > 0 && cartItems.every((i) => i.selected)}
                      onChange={(e) => selectAllItems(e.target.checked)}
                      className="accent-primary w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Select All ({cartItems.length})</span>
                  </label>
                )}
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-space-xl space-y-space-sm bg-surface-container-low rounded-2xl p-space-lg">
                  <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
                  </div>
                  <h3 className="font-title-md text-title-md font-bold text-primary">
                    Your shopping bag is empty
                  </h3>
                  <p className="font-body-sm text-body-sm text-secondary max-w-sm mx-auto">
                    Explore our curated literary works and technical treatises to add volumes to your selection.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/catalog"
                      className="inline-flex items-center gap-2 px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-space-sm">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-space-md">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="accent-primary w-4 h-4 rounded cursor-pointer shrink-0"
                          aria-label={`Select ${item.title}`}
                        />

                        {/* Thumbnail */}
                        <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center p-0.5 shrink-0 shadow-sm overflow-hidden">
                          <img
                            className="w-full h-full object-contain rounded"
                            src={item.coverImage}
                            alt={item.title}
                          />
                        </div>

                        {/* Title & Meta */}
                        <div className="space-y-1">
                          <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {item.author} • {item.inStock !== false ? 'In Stock' : 'Special Order'}
                          </p>
                        </div>
                      </div>

                      {/* Price & Stepper */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                        <div className="text-right">
                          <span className="font-title-lg text-title-lg text-primary font-bold tracking-tight block">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="font-body-sm text-body-sm text-secondary hidden sm:block">
                            ${item.price.toFixed(2)} / each
                          </span>
                        </div>

                        <div className="flex items-center gap-space-sm">
                          {/* Quantity Stepper */}
                          <div className="flex items-center bg-surface-container-lowest rounded-full p-0.5 border border-outline-variant/30 shadow-sm">
                            <button
                              aria-label="Giảm số lượng"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">remove</span>
                            </button>
                            <span className="w-8 text-center font-title-sm text-title-sm font-semibold text-primary select-none">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Tăng số lượng"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/book/${item.bookId}`}
                              aria-label="View Item"
                              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </Link>
                            <button
                              aria-label="Delete Item"
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* B. Delivery & Shipping Destination Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[24px]">local_shipping</span>
                  <h2 className="font-title-lg text-title-lg text-primary font-bold">Delivery Address</h2>
                </div>
                <button
                  className="px-space-md py-1.5 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setAddressFormData({ ...recipient });
                    setIsEditingAddress(!isEditingAddress);
                  }}
                >
                  {isEditingAddress ? 'Close' : 'Change Address'}
                </button>
              </div>

              {/* View Mode: Recipient Profile Info Box */}
              {!isEditingAddress ? (
                <div
                  id="delivery-address-display"
                  className="p-space-md rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-space-xs">
                      <span id="display-recipient-name" className="font-title-md text-title-md font-bold text-on-surface">
                        {recipient.name}
                      </span>
                      <span
                        id="display-recipient-tag"
                        className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold"
                      >
                        {recipient.addressType === 'Primary Residence' ? 'Primary Residence' : 'Office / Văn phòng'}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span id="display-recipient-phone">{recipient.phone}</span>
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span id="display-recipient-address">
                        {recipient.street}, {recipient.district}, {recipient.city}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressFormData({ ...recipient });
                      setIsEditingAddress(true);
                    }}
                    className="px-space-md py-1.5 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              ) : (
                /* Edit Mode: Inline Form */
                <form
                  id="delivery-address-form"
                  onSubmit={handleSaveAddress}
                  className="p-space-md rounded-2xl bg-surface-container-low space-y-space-md transition-all"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">edit_location_alt</span>
                      <h3 className="font-title-sm text-title-sm font-bold text-primary">
                        Chỉnh sửa địa chỉ nhận hàng / Edit Address
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary">(*) Thông tin bắt buộc</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                        Họ và tên người nhận / Full Name *
                      </label>
                      <input
                        id="input-recipient-name"
                        type="text"
                        value={addressFormData.name}
                        onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                        required
                        className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/40 focus:border-primary shadow-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                        Số điện thoại / Phone Number *
                      </label>
                      <input
                        id="input-recipient-phone"
                        type="tel"
                        value={addressFormData.phone}
                        onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                        required
                        className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/40 focus:border-primary shadow-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                        Tỉnh / Thành phố (City / Province) *
                      </label>
                      <input
                        id="input-recipient-city"
                        type="text"
                        value={addressFormData.city}
                        onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                        required
                        className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/40 focus:border-primary shadow-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                        Quận / Huyện, Phường / Xã *
                      </label>
                      <input
                        id="input-recipient-district"
                        type="text"
                        value={addressFormData.district}
                        onChange={(e) => setAddressFormData({ ...addressFormData, district: e.target.value })}
                        required
                        className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/40 focus:border-primary shadow-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                      Địa chỉ chi tiết (Tòa nhà, số nhà, tên đường) *
                    </label>
                    <input
                      id="input-recipient-street"
                      type="text"
                      value={addressFormData.street}
                      onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                      required
                      className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/40 focus:border-primary shadow-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 font-semibold">
                      Loại địa chỉ (Address Type Tag)
                    </label>
                    <div className="flex items-center gap-space-sm">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 cursor-pointer font-label-sm text-label-sm hover:bg-surface-container transition-colors">
                        <input
                          type="radio"
                          name="addr_tag"
                          value="Primary Residence"
                          checked={addressFormData.addressType === 'Primary Residence'}
                          onChange={() =>
                            setAddressFormData({ ...addressFormData, addressType: 'Primary Residence' })
                          }
                          className="accent-primary w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Nhà riêng / Primary Residence</span>
                      </label>
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 cursor-pointer font-label-sm text-label-sm hover:bg-surface-container transition-colors">
                        <input
                          type="radio"
                          name="addr_tag"
                          value="Office"
                          checked={addressFormData.addressType === 'Office'}
                          onChange={() =>
                            setAddressFormData({ ...addressFormData, addressType: 'Office' })
                          }
                          className="accent-primary w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Văn phòng / Office</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="check-default-addr"
                      checked={addressFormData.isDefault}
                      onChange={(e) =>
                        setAddressFormData({ ...addressFormData, isDefault: e.target.checked })
                      }
                      className="accent-primary w-4 h-4 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="check-default-addr"
                      className="font-body-sm text-body-sm text-on-surface cursor-pointer select-none"
                    >
                      Đặt làm địa chỉ nhận hàng mặc định (Set as default address)
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-space-md py-2 rounded-full font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      Hủy / Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container active:scale-[0.99] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Lưu thay đổi / Save Address</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Shipping Speed Selection */}
              <div className="space-y-space-sm pt-2">
                <label className="font-title-sm text-title-sm text-primary font-semibold block">
                  Select Fulfillment Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {/* Standard Option */}
                  <label
                    onClick={() => setShippingTier('standard')}
                    className={`relative flex items-start gap-space-sm p-space-md rounded-2xl cursor-pointer shadow-sm transition-all ${
                      shippingTier === 'standard'
                        ? 'bg-secondary-container/40 border border-primary/20'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <input
                      checked={shippingTier === 'standard'}
                      onChange={() => setShippingTier('standard')}
                      className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                      name="shipping_tier"
                      type="radio"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-title-sm font-bold text-on-secondary-container">
                          Standard Dispatch
                        </span>
                        <span className="font-label-lg text-label-lg font-bold text-primary">FREE</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary">Estimated 2-3 business days</p>
                      <span className="inline-block mt-1 font-label-sm text-label-sm text-on-surface-variant">
                        Carefully cushioned eco-wrap
                      </span>
                    </div>
                  </label>

                  {/* Express 24h Option */}
                  <label
                    onClick={() => setShippingTier('express')}
                    className={`relative flex items-start gap-space-sm p-space-md rounded-2xl cursor-pointer transition-colors ${
                      shippingTier === 'express'
                        ? 'bg-secondary-container/40 border border-primary/20 shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <input
                      checked={shippingTier === 'express'}
                      onChange={() => setShippingTier('express')}
                      className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                      name="shipping_tier"
                      type="radio"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-title-sm font-bold text-on-surface">
                          Express 24h
                        </span>
                        <span className="font-label-lg text-label-lg font-bold text-tertiary">+$4.99</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary">Priority delivery by tomorrow noon</p>
                      <span className="inline-block mt-1 font-label-sm text-label-sm text-on-surface-variant">
                        Handled with signature verification
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* C. Packaging Integrity Guarantee */}
            <div className="p-space-md rounded-2xl bg-surface-container flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">
                <span className="material-symbols-outlined text-[24px]">format_image_left</span>
              </div>
              <div>
                <h4 className="font-title-sm text-title-sm font-bold text-primary">
                  BookVerse Pristine Condition Guarantee
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Each spine is inspected, plastic-free edge buffered, and sealed to ensure bookstore-grade arrival.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Vouchers, Summary & Payment (5 Columns)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-space-xl">
            {/* A. Ưu đãi & Khuyến mãi (Voucher) */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[24px]">local_offer</span>
                  <div>
                    <h2 className="font-title-lg text-title-lg text-primary font-bold">
                      Ưu đãi &amp; Khuyến mãi (Voucher)
                    </h2>
                    <p className="font-body-sm text-body-sm text-secondary">
                      Áp dụng mã giảm giá để nhận chiết khấu trực tiếp
                    </p>
                  </div>
                </div>
                {appliedVoucher && (
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>1 Mã đang dùng</span>
                  </span>
                )}
              </div>

              {/* Input & Apply Button */}
              <form onSubmit={handleApplyVoucher} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                <div className="relative flex-1 flex items-center bg-surface-container-low rounded-2xl px-space-md py-1.5 focus-within:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-outline mr-space-sm text-[20px]">sell</span>
                  <input
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none uppercase font-mono tracking-wider"
                    placeholder="Nhập mã voucher (vd: BIBLIO10)..."
                    type="text"
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value);
                      if (voucherError) setVoucherError(null);
                    }}
                  />
                  {voucherInput && (
                    <button
                      aria-label="Clear voucher input"
                      className="ml-1 p-1 rounded-full text-outline hover:text-on-surface transition-colors cursor-pointer"
                      type="button"
                      onClick={() => setVoucherInput('')}
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                    </button>
                  )}
                </div>

                <button
                  className="px-space-xl py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary-container active:scale-[0.99] transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                  <span>Áp dụng</span>
                </button>
              </form>

              {/* Error Alert */}
              {voucherError && (
                <p className="font-body-sm text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{voucherError}</span>
                </p>
              )}

              {/* Active Voucher Tag */}
              {appliedVoucher && (
                <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono font-bold text-label-sm">
                      {appliedVoucher.code}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      {appliedVoucher.description}
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-tertiary">
                      {appliedVoucher.code === 'FREESHIP'
                        ? baseShippingFee > 0
                          ? `(-$${baseShippingFee.toFixed(2)})`
                          : '(Miễn phí ship)'
                        : `(-$${discountAmount.toFixed(2)})`}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-0.5 self-start sm:self-auto cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    <span>Gỡ mã</span>
                  </button>
                </div>
              )}
            </div>

            {/* B. Order Summary Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-md space-y-space-md">
              <h2 className="font-title-lg text-title-lg text-primary font-bold">Order Breakdown</h2>
              <div className="space-y-space-sm text-body-md font-body-md text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>Merchandise Subtotal</span>
                  <span className="font-semibold text-on-surface font-title-sm text-title-sm">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {shippingTier === 'express' ? 'Express 24h Delivery' : 'Standard Delivery'}
                  </span>
                  <span
                    className={`font-semibold font-title-sm text-title-sm ${
                      finalShippingFee === 0 ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {finalShippingFee === 0 ? 'FREE ($0.00)' : `$${finalShippingFee.toFixed(2)}`}
                  </span>
                </div>

                {appliedVoucher && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-tertiary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">loyalty</span>
                      <span>Promo CODE: {appliedVoucher.code}</span>
                    </span>
                    <span className="font-semibold font-title-sm text-title-sm">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-semibold text-on-surface font-title-sm text-title-sm">
                    ${salesTax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-space-sm">
                <div className="flex items-baseline justify-between p-space-md rounded-2xl bg-surface-container-low">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                      Final Payable Amount
                    </span>
                    <div className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
                      ${finalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-secondary">Equivalent VND</span>
                    <div className="font-title-sm text-title-sm font-semibold text-primary">
                      ~ {vndRawAmount.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* C. PROMINENT VIETQR / COD PAYMENT ENGINE */}
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-xl space-y-space-md relative overflow-hidden">
              {/* Header Banner */}
              <div className="flex items-center justify-between pb-1">
                <div className="space-y-0.5">
                  <h3 className="font-title-lg text-title-lg font-bold text-primary">
                    Phương thức thanh toán
                  </h3>
                </div>
                <span
                  id="active-method-badge"
                  className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold"
                >
                  Đang chọn: {paymentMethod === 'cod' ? 'COD' : 'VietQR'}
                </span>
              </div>

              {/* Interactive Toggle Tabs */}
              <div className="grid grid-cols-2 gap-space-sm">
                <button
                  id="tab-cod"
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-2.5 p-space-sm rounded-2xl text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-secondary-container/40 border border-primary'
                      : 'bg-surface-container-low hover:bg-surface-container border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md font-bold text-primary block">COD</span>
                      {paymentMethod === 'cod' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-secondary font-medium">
                      Tiền mặt khi nhận
                    </span>
                  </div>
                </button>

                <button
                  id="tab-vietqr"
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`flex items-center gap-2.5 p-space-sm rounded-2xl text-left transition-all cursor-pointer ${
                    paymentMethod === 'vietqr'
                      ? 'bg-secondary-container/40 border border-primary'
                      : 'bg-surface-container-low hover:bg-surface-container border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[22px]">qr_code_scanner</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface block">
                        VietQR
                      </span>
                      {paymentMethod === 'vietqr' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-secondary">Quét mã PayOS</span>
                  </div>
                </button>
              </div>

              {/* COD PAYMENT SECTION */}
              {paymentMethod === 'cod' && (
                <div id="cod-payment-section" className="space-y-space-md">
                  <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-space-sm">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-title-sm text-title-sm font-bold text-primary">
                          Xác nhận thanh toán khi nhận hàng
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Thanh toán tiền mặt cho nhân viên giao hàng khi nhận sách.
                        </p>
                      </div>
                    </div>

                    <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
                      <div className="flex items-center justify-between text-body-sm font-body-sm">
                        <span className="text-secondary">Tổng số lượng sách</span>
                        <span className="font-semibold text-on-surface font-title-sm text-title-sm">
                          {selectedCount} cuốn sách
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-body-sm font-body-sm">
                        <span className="text-secondary">Phí thu hộ (COD fee)</span>
                        <span className="font-semibold text-primary">Miễn phí (FREE)</span>
                      </div>
                      <div className="pt-1 border-t border-outline-variant/30 flex items-baseline justify-between">
                        <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                          Tổng tiền thanh toán khi nhận hàng
                        </span>
                        <div className="text-right">
                          <span className="font-title-md text-title-md font-bold text-primary block">
                            ${finalAmount.toFixed(2)}
                          </span>
                          <span className="font-body-sm text-body-sm text-secondary font-medium">
                            (~ {vndRawAmount.toLocaleString('vi-VN')}₫)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-xl bg-secondary-container/30 text-on-secondary-container">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                        verified_user
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Quý khách được đồng kiểm hàng trước khi thanh toán. Vui lòng chuẩn bị sẵn đúng số tiền.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={selectedCount === 0 || isSubmitting}
                    className="w-full py-3.5 px-space-xl rounded-full bg-primary text-on-primary font-title-md text-title-md font-bold hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span>Xác nhận đặt hàng COD (${finalAmount.toFixed(2)})</span>
                  </button>
                </div>
              )}

              {/* VIETQR PAYMENT SECTION */}
              {paymentMethod === 'vietqr' && (
                <div id="qr-payment-section" className="space-y-space-md">
                  {/* Real-time Pulse Status Banner */}
                  <div className="flex items-center justify-between p-space-sm rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        Chờ thanh toán qua VietQR (Tự động xác nhận)
                      </span>
                    </div>
                    <span className="font-mono text-label-sm font-bold text-emerald-700">Live</span>
                  </div>

                  {/* Centerpiece QR Box */}
                  <div className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col items-center">
                      <div className="w-56 h-56 relative flex items-center justify-center bg-white p-2 rounded-xl border border-outline-variant/20 shadow-inner">
                        {/* High fidelity SVG matching Stitch design 1b262ef8 */}
                        <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 200 200">
                          <path
                            d="M10 10h50v50h-50z M20 20v30h30v-30z M30 30h10v10h-10z"
                            fillRule="evenodd"
                          />
                          <path
                            d="M140 10h50v50h-50z M150 20v30h30v-30z M160 30h10v10h-10z"
                            fillRule="evenodd"
                          />
                          <path
                            d="M10 140h50v50h-50z M20 150v30h30v-30z M30 160h10v10h-10z"
                            fillRule="evenodd"
                          />
                          <rect height="10" width="10" x="70" y="20" />
                          <rect height="10" width="20" x="90" y="20" />
                          <rect height="10" width="10" x="120" y="20" />
                          <rect height="10" width="30" x="70" y="40" />
                          <rect height="20" width="10" x="110" y="40" />
                          <rect height="20" width="10" x="20" y="70" />
                          <rect height="10" width="20" x="40" y="80" />
                          <rect height="10" width="60" x="70" y="70" />
                          <rect height="20" width="10" x="80" y="90" />
                          <rect height="10" width="30" x="100" y="90" />
                          <rect height="20" width="20" x="140" y="80" />
                          <rect height="10" width="20" x="170" y="70" />
                          <rect height="10" width="30" x="20" y="110" />
                          <rect height="30" width="20" x="70" y="110" />
                          <rect height="10" width="30" x="100" y="120" />
                          <rect height="30" width="10" x="150" y="110" />
                          <rect height="20" width="20" x="170" y="100" />
                          <rect height="10" width="20" x="70" y="150" />
                          <rect height="30" width="10" x="100" y="150" />
                          <rect height="10" width="20" x="120" y="140" />
                          <rect height="10" width="40" x="150" y="150" />
                          <rect height="20" width="20" x="130" y="170" />
                          <rect height="10" width="10" x="170" y="170" />
                          {/* BookVerse center brand emblem */}
                          <circle cx="100" cy="100" fill="#002045" r="18" />
                          <path d="M93 94h14v12h-14z" fill="#ffffff" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                      Open any banking app or e-wallet (MoMo, ZaloPay, Vietcombank, Techcombank, MB Bank) and scan to settle instantly with zero transaction fee.
                    </p>
                  </div>

                  {/* Structured Banking Credentials Table */}
                  <div className="space-y-space-xs font-body-sm text-body-sm">
                    <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
                      <span className="text-secondary font-label-md text-label-md">Receiving Bank</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                          MB Bank
                        </span>
                        <span className="text-outline">/</span>
                        <span className="font-label-md text-label-md font-bold text-primary">
                          Vietcombank
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
                      <span className="text-secondary font-label-md text-label-md">Account Name</span>
                      <span className="font-title-sm text-title-sm font-bold text-primary uppercase">
                        BOOKVERSE CORP
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
                      <span className="text-secondary font-label-md text-label-md">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-title-sm font-mono font-bold text-primary">
                          998822334455
                        </span>
                        <button
                          className="p-1 rounded-full text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                          onClick={() => handleCopy('998822334455', 'account')}
                          title="Copy Account Number"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedField === 'account' ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-space-sm rounded-xl bg-tertiary-fixed/30">
                      <span className="text-on-tertiary-fixed font-label-md text-label-md font-semibold">
                        Transfer Content (Memo)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-title-sm font-mono font-bold text-tertiary">
                          {transferMemo}
                        </span>
                        <button
                          className="p-1 rounded-full text-tertiary hover:bg-tertiary-fixed transition-colors cursor-pointer"
                          onClick={() => handleCopy(transferMemo, 'memo')}
                          title="Copy Memo"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedField === 'memo' ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* VietQR Confirm CTA */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={selectedCount === 0 || isSubmitting}
                    className="w-full py-3.5 px-space-xl rounded-full bg-primary text-on-primary font-title-md text-title-md font-bold hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span>Kiểm tra trạng thái thanh toán VietQR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;

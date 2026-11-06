import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  OrderDisplay,
  OrderFilterTab,
  PatronProfileData,
} from '../components/user-profile/types';
import { PatronHeaderCard } from '../components/user-profile/PatronHeaderCard';
import { ReadingStatsBento } from '../components/user-profile/ReadingStatsBento';
import { OrderHistorySection } from '../components/user-profile/OrderHistorySection';
import { EditProfileModal } from '../components/user-profile/EditProfileModal';
import { WriteReviewModal } from '../components/user-profile/WriteReviewModal';
import { OrderTrackingModal } from '../components/user-profile/OrderTrackingModal';
import { VietQrModal } from '../components/user-profile/VietQrModal';

// Canonical orders with authentic VND pricing
const CANONICAL_ORDERS: OrderDisplay[] = [
  {
    id: 'ord-1',
    orderNumber: '#BK-98421',
    date: '24/10/2026',
    total: 485000,
    status: 'paid',
    paymentMethod: 'VietQR',
    carrier: 'BookVerse Express',
    trackingNumber: 'BVE-98421-VN',
    estimatedDelivery: '27/10/2026',
    shippingNote: 'Đã giao cho đơn vị vận chuyển BookVerse Express',
    items: [
      {
        bookId: 'book-4',
        title: 'The Architecture of Silence',
        author: 'Helena Cross',
        format: 'Ấn bản tiêu chuẩn',
        price: 240000,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAdt59T1h03vA_Uv0JHXvzevXxjlgCUqcl81eSzNIjPMWYxGlSWPRNZsQOMeCsSVJyobDSsvSLuUVlNA3Ka8CfjBdg_u6JJYXvAd1CN_21mWyFEGcIHxoBmB2eW_Arj_njKxG5zYZYvFtTyYDmXhUbcotMU4zyjQwRtFMfQkSymbAFX-pLI1xhxpabtkRdssaZh7D6FMYdkze3aqvrqu-ulRMuKL4ptvZhMDAKyIZaY',
      },
      {
        bookId: 'book-5',
        title: 'Echoes in the Pine Grove',
        author: 'Marcus Thorne',
        format: 'Ấn bản tiêu chuẩn',
        price: 125000,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ4vs46dqeAxShFX6R-zB8inFT6LwlAkkAvQt6tlGMEldDPYd5TbhWqx6xx0gfBva-S1EnYfhAwms0hlrrHFe7lZUwCjfhDdcZgnSYQ1IiLjmj3ZvNy7kOYJFw_ZEc7BhJGqvbBavNSLcQKCHeO4vuw3-ku60kbUgTfanAKDH6qEZDIHouj8LCInK8tLcIVeeuKAUe2AK1JckrMCXzHiS6l4sZpOcHdHoK_bvXJoiU',
      },
      {
        bookId: 'book-6',
        title: 'Modernist Letterforms',
        author: 'S. C. Bradley',
        format: 'Ấn bản tiêu chuẩn',
        price: 120000,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCWu85GoYVfISjiMZqE-sjPD-sqLUxYfEq9SOEI7ilazs6GuNLheWldbMt-UbgSQkt6H_ynunYWErXI7alfMwDPIbpPxtEaxDG02ER_Ee_wN59-KHs4YDAinhDPhBY86gp4Kv-BrYBmJz9LZ5sP0uGbp1KXbm5Beunb2Mk-DoFs-ffh0DOaJqzC3wDIKU-goX3buCMtI5CldQcraRe-HxyujnbT9E8PBS_OBNijxG-g',
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '#BK-97510',
    date: '12/10/2026',
    total: 320000,
    status: 'delivered',
    paymentMethod: 'COD',
    deliveredDate: '16/10/2026',
    shippingNote: 'Đã giao thành công vào ngày 16/10/2026',
    items: [
      {
        bookId: 'book-7',
        title: 'Cartographies of the Mind: Selected Works',
        author: 'Prof. Julian A. Vance',
        format: 'Ấn bản tiêu chuẩn',
        price: 320000,
        quantity: 1,
        signedCopy: true,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAvptmmcAQ4LVa3kekNBl1AVHLagOoyKeBzRHPiugU9h3RzAkt7VOSzM4fYatpwbCx24NzdcQBoyScAuJpw7QtSkgzNR7Po7LCSCy_AFs2PPRPMwa_7k7p2COdbzWUrw0pLs-rdpWglwf982kEAgXE4kahKoHG_rCvZ76mb6maJto8m-ip04--NuxIk2SoNZ6Fx5g4SQMbSV-Zt5E0Vh2eX0ohQQcbdYv4zy58hEq8S',
      },
    ],
  },
  {
    id: 'ord-3',
    orderNumber: '#BK-96102',
    date: '28/09/2026',
    total: 360000,
    status: 'pending',
    paymentMethod: 'VietQR',
    shippingNote: 'Kiện hàng 3 ấn phẩm • Đang chờ đối soát chuyển khoản ngân hàng',
    items: [
      {
        bookId: 'book-8',
        title: 'The Poetics of Space',
        author: 'Gaston Bachelard',
        format: 'Ấn bản tiêu chuẩn',
        price: 180000,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWsVl9tJ4A0uh4f9SX7mrqJL4-1UcG2D4fSR0m8vPPT-hQrGvH-6KCWwWtlQwhwmPKcCOdv3kf6zeXI58S4kDXbHT2Y_TE5-avM0DKbUl3gyQaOgZODnUCX1jZVbw0ju2mknqvKAa3kPliMv4uLxkU_wNplv3zVsFkp2DTAtdGcABrCE_n9d6nraOzvUjv0PoCw-gH_10W8VUkACtvn9YFwEBPIlC_eySkC6Ta2vg',
      },
      {
        bookId: 'book-9',
        title: 'Typography Essentials',
        author: 'Ina Saltz',
        format: 'Ấn bản tiêu chuẩn',
        price: 180000,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCWu85GoYVfISjiMZqE-sjPD-sqLUxYfEq9SOEI7ilazs6GuNLheWldbMt-UbgSQkt6H_ynunYWErXI7alfMwDPIbpPxtEaxDG02ER_Ee_wN59-KHs4YDAinhDPhBY86gp4Kv-BrYBmJz9LZ5sP0uGbp1KXbm5Beunb2Mk-DoFs-ffh0DOaJqzC3wDIKU-goX3buCMtI5CldQcraRe-HxyujnbT9E8PBS_OBNijxG-g',
      },
    ],
  },
];

export const UserProfile: React.FC = () => {
  const { user, login, showToast } = useStore();

  // Active filter tab & Search query
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Orders state
  const [orders, setOrders] = useState<OrderDisplay[]>(CANONICAL_ORDERS);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [isVietQrModalOpen, setIsVietQrModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);

  // Profile data for edit modal
  const profileData: PatronProfileData = {
    name: user?.name || 'Minh Nguyễn',
    email: user?.email || 'minh.nguyen@example.com',
    phone: user?.phone || '0908 345 678',
    address: user?.address || 'Tòa nhà Tower 3, 65 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    bio: 'Độc giả đam mê kiến trúc phần mềm phân tán, hệ thống cơ sở dữ liệu và văn học kinh điển thế giới.',
  };

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by tab status
    if (activeTab === 'processing') {
      result = result.filter((o) => o.status === 'processing' || o.status === 'paid');
    } else if (activeTab === 'pending') {
      result = result.filter((o) => o.status === 'pending');
    } else if (activeTab === 'delivered') {
      result = result.filter((o) => o.status === 'delivered');
    } else if (activeTab === 'cancelled') {
      result = result.filter((o) => o.status === 'cancelled');
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((o) => {
        const orderNumMatch = o.orderNumber.toLowerCase().includes(q);
        const itemMatch = o.items.some(
          (item) => item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q)
        );
        return orderNumMatch || itemMatch;
      });
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // Modal Handlers
  const handleOpenEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updated: PatronProfileData) => {
    login({
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
    });
    setIsEditModalOpen(false);
    showToast('Đã lưu thông tin tài khoản độc giả thành công.');
  };

  const handleOpenTracking = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleOpenReview = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    setIsReviewModalOpen(false);
    showToast('Đã gửi đánh giá ' + rating + ' sao (' + comment.slice(0, 15) + '...) thành công!');
  };

  const handleOpenVietQr = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsVietQrModalOpen(true);
  };

  const handleConfirmPaid = (order: OrderDisplay) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'paid' as const } : o))
    );
    setIsVietQrModalOpen(false);
    showToast('Xác nhận thanh toán thành công! Đơn hàng đang được đóng gói.');
  };

  const handleReorder = (order: OrderDisplay) => {
    showToast('Đã thêm các ấn phẩm từ đơn ' + order.orderNumber + ' vào giỏ hàng.');
  };

  const handleCancelOrder = (order: OrderDisplay) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'cancelled' as const } : o))
    );
    showToast('Đã hủy đơn hàng ' + order.orderNumber + ' thành công.');
  };

  return (
    <div
      id="user-profile-page"
      data-testid="user-profile-page"
      className="bg-surface font-body-md text-on-surface antialiased min-h-screen py-space-lg px-gutter-sm sm:px-gutter"
    >
      <div className="max-w-6xl mx-auto">
        {/* 1. Patron Header Card */}
        <PatronHeaderCard user={user} onEditProfile={handleOpenEditProfile} />

        {/* 2. Reading Stats Bento */}
        <ReadingStatsBento />

        {/* 4. Order History Section & 5. Order History Cards */}
        <OrderHistorySection
          orders={filteredOrders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenTracking={handleOpenTracking}
          onOpenReview={handleOpenReview}
          onOpenVietQr={handleOpenVietQr}
          onReorder={handleReorder}
          onCancelOrder={handleCancelOrder}
        />

        {/* 6. Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          initialData={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />

        {/* 7. Write Review Modal */}
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          order={selectedOrder}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleSubmitReview}
        />

        {/* 8. Order Tracking Modal */}
        <OrderTrackingModal
          isOpen={isTrackingModalOpen}
          order={selectedOrder}
          onClose={() => setIsTrackingModalOpen(false)}
        />

        {/* 9. VietQR Modal */}
        <VietQrModal
          isOpen={isVietQrModalOpen}
          order={selectedOrder}
          onClose={() => setIsVietQrModalOpen(false)}
          onConfirmPaid={handleConfirmPaid}
        />
      </div>
    </div>
  );
};

export default UserProfile;

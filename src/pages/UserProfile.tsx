import React, { useState, useMemo, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore } from '../store/useStore';
import {
  OrderDisplay,
  OrderItemDisplay,
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

export const UserProfile: React.FC = () => {
  const { user, login, showToast } = useStore();

  // Active filter tab & Search query
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Orders state
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [readingStats, setReadingStats] = useState<{
    completedOrders: number;
    booksRead: number;
  }>({
    completedOrders: 18,
    booksRead: 64,
  });

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [isVietQrModalOpen, setIsVietQrModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);

  const fetchUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Fetch user orders from collection "Order"
      const ordersQ = query(collection(db, 'Order'), where('idUser', '==', user.id));
      const ordersSnap = await getDocs(ordersQ);
      const mappedOrders: OrderDisplay[] = ordersSnap.docs.map((d) => {
        const data = d.data();
        const items = Array.isArray(data.items) ? data.items : [];
        const mappedItems: OrderItemDisplay[] = items.map((it: any) => ({
          bookId: it.bookId || it.idBook || 'book-1',
          title: it.title || 'Ấn phẩm sách',
          author: it.author || it.nameAuthor || 'Tác giả',
          format: it.format || 'Ấn bản tiêu chuẩn',
          price: it.price || 0,
          quantity: it.quantity || 1,
          coverImage: it.imgCover || it.coverImage || '',
          signedCopy: Boolean(it.signedCopy),
        }));

        let dateStr = 'Hôm nay';
        if (data.createAt?.toDate) {
          dateStr = data.createAt.toDate().toLocaleDateString('vi-VN');
        } else if (data.createdAt) {
          dateStr = new Date(data.createdAt).toLocaleDateString('vi-VN');
        }

        const statusRaw = (data.statusOrder || data.status || 'PROCESSING').toLowerCase();
        let status: OrderDisplay['status'] = 'processing';
        if (statusRaw === 'delivered') status = 'delivered';
        else if (statusRaw === 'cancelled') status = 'cancelled';
        else if (statusRaw === 'pending') status = 'pending';
        else if (data.statusPayment === 'PAID') status = 'paid';

        return {
          id: d.id,
          orderNumber: data.codeOrder
            ? data.codeOrder.startsWith('#')
              ? data.codeOrder
              : `#${data.codeOrder}`
            : `#BK-${d.id.slice(0, 6)}`,
          date: dateStr,
          total: data.totalPrice || data.totalAmount || 0,
          status,
          paymentMethod: (data.methodPayment === 'COD' ? 'COD' : 'VietQR') as 'VietQR' | 'COD',
          shippingNote:
            data.shippingNote ||
            (status === 'delivered' ? 'Đã giao thành công' : 'Đang xử lý kiện hàng'),
          carrier: data.shipMethod?.method || 'BookVerse Express',
          trackingNumber: data.orderCode ? `BVE-${data.orderCode}` : undefined,
          items: mappedItems,
        };
      });
      setOrders(mappedOrders);

      // 2. Fetch patron reading stats from collection "Users"
      const userDoc = await getDoc(doc(db, 'Users', user.id));
      if (userDoc.exists()) {
        const uData = userDoc.data();
        const completedCount =
          uData.compltOrderCount ??
          uData.complOrderCount ??
          mappedOrders.filter((o) => o.status === 'delivered' || o.status === 'paid').length;
        const readCount =
          uData.readBookCount ??
          mappedOrders.reduce(
            (sum, o) => sum + o.items.reduce((iSum, it) => iSum + it.quantity, 0),
            0
          );
        setReadingStats({
          completedOrders: completedCount,
          booksRead: readCount,
        });
      } else {
        setReadingStats({
          completedOrders: mappedOrders.filter(
            (o) => o.status === 'delivered' || o.status === 'paid'
          ).length,
          booksRead: mappedOrders.reduce(
            (sum, o) => sum + o.items.reduce((iSum, it) => iSum + it.quantity, 0),
            0
          ),
        });
      }
    } catch (err: any) {
      console.error('[UserProfile] Error fetching user data:', err);
      setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  // Profile data for edit modal
  const profileData: PatronProfileData = {
    name: user?.name || 'Minh Nguyễn',
    email: user?.email || 'minh.nguyen@example.com',
    phone: user?.phone || '0908 345 678',
    address: user?.address || 'Tòa nhà Tower 3, 65 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    city: user?.city || 'TP. Hồ Chí Minh',
    district: user?.district || 'Quận 1',
    detailedAddress: user?.detailedAddress || 'Tòa nhà Tower 3, 65 Đường Lê Lợi',
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
      city: updated.city,
      district: updated.district,
      detailedAddress: updated.detailedAddress,
    });
    setIsEditModalOpen(false);
    showToast('Đã lưu thông tin tài khoản thành công!');
  };

  const handleOpenReview = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleOpenTracking = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleOpenVietQr = (order: OrderDisplay) => {
    setSelectedOrder(order);
    setIsVietQrModalOpen(true);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'cancelled',
            shippingNote: 'Đơn hàng đã được độc giả hủy yêu cầu',
          };
        }
        return o;
      })
    );
    showToast('Đã hủy đơn hàng thành công!');
  };

  return (
    <div
      id="user-profile-page-root"
      data-testid="user-profile-page-coordinator"
      className="flex flex-col w-full bg-surface text-primary font-body-md"
    >
      <div className="w-full max-w-7xl mx-auto px-gutter-sm md:px-gutter-lg py-space-xl">
        {/* 1. Patron Header Card */}
        <PatronHeaderCard user={user} onEditProfile={handleOpenEditProfile} />

        {/* 2. Reading Stats Bento */}
        <ReadingStatsBento
          completedOrdersCount={readingStats.completedOrders}
          booksReadCount={readingStats.booksRead}
        />

        {/* Loading & Error States */}
        {loading ? (
          <div
            id="user-profile-loading"
            data-testid="user-profile-loading-spinner"
            className="flex flex-col items-center justify-center py-16 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 my-4"
          >
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-secondary font-medium text-body-md">Đang tải lịch sử đơn hàng từ Firestore...</p>
          </div>
        ) : error ? (
          <div
            id="user-profile-error"
            data-testid="user-profile-error-state"
            className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center my-4"
          >
            <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
            <p className="text-error font-medium mb-4">{error}</p>
            <button
              onClick={fetchUserData}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        ) : (
          /* 3. Order History Section */
          <OrderHistorySection
            orders={filteredOrders}
            activeTab={activeTab}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
            onOpenReview={handleOpenReview}
            onOpenTracking={handleOpenTracking}
            onOpenVietQr={handleOpenVietQr}
            onReorder={(order) => {
              showToast(`Đã thêm lại các sách từ đơn ${order.orderNumber} vào giỏ hàng!`);
            }}
            onCancelOrder={(order) => handleCancelOrder(order.id)}
          />
        )}
      </div>

      {/* 4. Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        initialData={profileData}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        order={selectedOrder}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={(rating: number, _comment: string) => {
          setIsReviewModalOpen(false);
          showToast(`Cảm ơn bạn đã đánh giá ${rating} sao cho ấn phẩm!`);
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        order={selectedOrder}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      <VietQrModal
        isOpen={isVietQrModalOpen}
        order={selectedOrder}
        onClose={() => setIsVietQrModalOpen(false)}
        onConfirmPaid={(order) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: 'paid' } : o))
          );
          setIsVietQrModalOpen(false);
          showToast('Xác thực thanh toán VietQR thành công!');
        }}
      />
    </div>
  );
};

export default UserProfile;

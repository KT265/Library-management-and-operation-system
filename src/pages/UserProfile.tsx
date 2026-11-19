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
          createAt: data.createAt || data.createdAt,
          createdAt: data.createAt || data.createdAt,
          statusOrder: String(data.statusOrder || data.status || 'PROCESSING').toUpperCase(),
          stateOrder: String(data.statusOrder || data.stateOrder || data.status || 'PROCESSING').toUpperCase(),
        };
      });
      setOrders(mappedOrders);

      // 2. Fetch patron reading stats from collection "Users"
      const userDoc = await getDoc(doc(db, 'Users', user.id));
      if (userDoc.exists()) {
        const uData = userDoc.data();
        const readCount = typeof uData.readBookCount === 'number' ? uData.readBookCount : 0;
        setReadingStats({
          completedOrders: mappedOrders.length,
          booksRead: readCount,
        });
      } else {
        setReadingStats({
          completedOrders: mappedOrders.length,
          booksRead: 0,
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
    name: user?.name || 'Độc giả',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    district: user?.district || '',
    detailedAddress: user?.detailedAddress || '',
    bio: '',
  };

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by tab status
    if (activeTab === 'pending') {
      result = result.filter(
        (o) => (o.stateOrder || o.statusOrder || '').toUpperCase() === 'PENDING'
      );
    } else if (activeTab === 'processing') {
      result = result.filter(
        (o) => (o.stateOrder || o.statusOrder || '').toUpperCase() === 'PROCESSING'
      );
    } else if (activeTab === 'delivered') {
      result = result.filter(
        (o) =>
          (o.stateOrder || o.statusOrder || '').toUpperCase() === 'DELIVERED' ||
          o.status === 'delivered'
      );
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

    // Chronological Sorting: Newest to Oldest using createAt timestamp before rendering
    const getOrderTime = (o: OrderDisplay): number => {
      if (o.createAt) {
        if (typeof o.createAt.toMillis === 'function') return o.createAt.toMillis();
        if (typeof o.createAt.toDate === 'function') return o.createAt.toDate().getTime();
        if (typeof o.createAt.seconds === 'number') return o.createAt.seconds * 1000;
        const parsed = new Date(o.createAt).getTime();
        if (!isNaN(parsed)) return parsed;
      }
      if (o.createdAt) {
        const parsed = new Date(o.createdAt).getTime();
        if (!isNaN(parsed)) return parsed;
      }
      return 0;
    };

    return [...result].sort((a, b) => {
      if (b.createAt?.toMillis && a.createAt?.toMillis) {
        return b.createAt.toMillis() - a.createAt.toMillis();
      }
      return getOrderTime(b) - getOrderTime(a);
    });
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
          />
        )}
      </div>

      {/* 4. Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        initialData={profileData}
        userId={user?.id}
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
    </div>
  );
};

export default UserProfile;

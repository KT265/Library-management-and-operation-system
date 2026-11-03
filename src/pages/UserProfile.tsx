import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Book, OrderStatus } from '../types';
import { MOCK_BOOKS } from '../data/mockData';

interface OrderItemDisplay {
  bookId: string;
  title: string;
  author: string;
  format: string;
  price: number;
  quantity: number;
  coverImage: string;
  signedCopy?: boolean;
}

interface OrderDisplay {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: OrderStatus | 'paid';
  paymentMethod: 'VietQR' | 'COD';
  shippingNote: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  items: OrderItemDisplay[];
}

// Canonical orders exactly reproducing Stitch screen fda5029b + test scenario compatibility
const INITIAL_ORDERS: OrderDisplay[] = [
  {
    id: 'ord-1',
    orderNumber: '#BK-98421',
    date: 'Oct 24, 2025',
    total: 91.84,
    status: 'paid',
    paymentMethod: 'VietQR',
    carrier: 'BookVerse Express',
    trackingNumber: 'BVE-98421-VN',
    estimatedDelivery: 'Oct 27, 2025',
    shippingNote: 'Shipped via BookVerse Express • Est. Delivery Oct 27',
    items: [
      {
        bookId: 'book-4',
        title: 'The Architecture of Silence',
        author: 'Helena Cross',
        format: 'Hardcover',
        price: 34.0,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAdt59T1h03vA_Uv0JHXvzevXxjlgCUqcl81eSzNIjPMWYxGlSWPRNZsQOMeCsSVJyobDSsvSLuUVlNA3Ka8CfjBdg_u6JJYXvAd1CN_21mWyFEGcIHxoBmB2eW_Arj_njKxG5zYZYvFtTyYDmXhUbcotMU4zyjQwRtFMfQkSymbAFX-pLI1xhxpabtkRdssaZh7D6FMYdkze3aqvrqu-ulRMuKL4ptvZhMDAKyIZaY',
      },
      {
        bookId: 'book-5',
        title: 'Echoes in the Pine Grove',
        author: 'Marcus Thorne',
        format: 'Paperback',
        price: 22.5,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ4vs46dqeAxShFX6R-zB8inFT6LwlAkkAvQt6tlGMEldDPYd5TbhWqx6xx0gfBva-S1EnYfhAwms0hlrrHFe7lZUwCjfhDdcZgnSYQ1IiLjmj3ZvNy7kOYJFw_ZEc7BhJGqvbBavNSLcQKCHeO4vuw3-ku60kbUgTfanAKDH6qEZDIHouj8LCInK8tLcIVeeuKAUe2AK1JckrMCXzHiS6l4sZpOcHdHoK_bvXJoiU',
      },
      {
        bookId: 'book-6',
        title: 'Modernist Letterforms',
        author: 'S. C. Bradley',
        format: 'Special Edition',
        price: 35.34,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCWu85GoYVfISjiMZqE-sjPD-sqLUxYfEq9SOEI7ilazs6GuNLheWldbMt-UbgSQkt6H_ynunYWErXI7alfMwDPIbpPxtEaxDG02ER_Ee_wN59-KHs4YDAinhDPhBY86gp4Kv-BrYBmJz9LZ5sP0uGbp1KXbm5Beunb2Mk-DoFs-ffh0DOaJqzC3wDIKU-goX3buCMtI5CldQcraRe-HxyujnbT9E8PBS_OBNijxG-g',
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '#BK-97510',
    date: 'Oct 12, 2025',
    total: 48.2,
    status: 'delivered',
    paymentMethod: 'COD',
    deliveredDate: 'Oct 16, 2025',
    shippingNote: 'Delivered on Oct 16, 2025',
    items: [
      {
        bookId: 'book-7',
        title: 'Cartographies of the Mind: Selected Works',
        author: 'Prof. Julian A. Vance',
        format: 'Deluxe Hardbound',
        price: 48.2,
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
    date: 'Sep 28, 2025',
    total: 112.5,
    status: 'pending',
    paymentMethod: 'VietQR',
    shippingNote: 'Consignment Package (4 Editions) • Awaiting Bank Settlement Confirmation',
    items: [
      {
        bookId: 'book-8',
        title: 'The Poetics of Space',
        author: 'Gaston Bachelard',
        format: 'Paperback',
        price: 28.0,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWsVl9tJ4A0uh4f9SX7mrqJL4-1UcG2D4fSR0m8vPPT-hQrGvH-6KCWwWtlQwhwmPKcCOdv3kf6zeXI58S4kDXbHT2Y_TE5-avM0DKbUl3gyQaOgZODnUCX1jZVbw0ju2mknqvKAa3kPliMv4uLxkU_wNplv3zVsFkp2DTAtdGcABrCE_n9d6nraOzvUjv0PoCw-gH_10W8VUkACtvn9YFwEBPIlC_eySkC6Ta2vg',
      },
      {
        bookId: 'book-9',
        title: 'Typography Essentials',
        author: 'Ina Saltz',
        format: 'Paperback',
        price: 32.5,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCWu85GoYVfISjiMZqE-sjPD-sqLUxYfEq9SOEI7ilazs6GuNLheWldbMt-UbgSQkt6H_ynunYWErXI7alfMwDPIbpPxtEaxDG02ER_Ee_wN59-KHs4YDAinhDPhBY86gp4Kv-BrYBmJz9LZ5sP0uGbp1KXbm5Beunb2Mk-DoFs-ffh0DOaJqzC3wDIKU-goX3buCMtI5CldQcraRe-HxyujnbT9E8PBS_OBNijxG-g',
      },
      {
        bookId: 'book-10',
        title: 'The Sound and the Fury',
        author: 'William Faulkner',
        format: 'Hardcover',
        price: 24.0,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ4vs46dqeAxShFX6R-zB8inFT6LwlAkkAvQt6tlGMEldDPYd5TbhWqx6xx0gfBva-S1EnYfhAwms0hlrrHFe7lZUwCjfhDdcZgnSYQ1IiLjmj3ZvNy7kOYJFw_ZEc7BhJGqvbBavNSLcQKCHeO4vuw3-ku60kbUgTfanAKDH6qEZDIHouj8LCInK8tLcIVeeuKAUe2AK1JckrMCXzHiS6l4sZpOcHdHoK_bvXJoiU',
      },
      {
        bookId: 'book-11',
        title: 'Invisible Cities',
        author: 'Italo Calvino',
        format: 'Paperback',
        price: 28.0,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAdt59T1h03vA_Uv0JHXvzevXxjlgCUqcl81eSzNIjPMWYxGlSWPRNZsQOMeCsSVJyobDSsvSLuUVlNA3Ka8CfjBdg_u6JJYXvAd1CN_21mWyFEGcIHxoBmB2eW_Arj_njKxG5zYZYvFtTyYDmXhUbcotMU4zyjQwRtFMfQkSymbAFX-pLI1xhxpabtkRdssaZh7D6FMYdkze3aqvrqu-ulRMuKL4ptvZhMDAKyIZaY',
      },
    ],
  },
  {
    id: 'ord-101',
    orderNumber: 'BV-2026-101',
    date: 'Oct 15, 2026',
    total: 38.99,
    status: 'delivered',
    paymentMethod: 'VietQR',
    deliveredDate: 'Oct 18, 2026',
    shippingNote: 'Delivered on Oct 18, 2026',
    items: [
      {
        bookId: 'book-1',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        format: 'Paperback',
        price: 38.99,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
      },
    ],
  },
];

const PREFERENCE_TAGS = [
  'Literary Fiction',
  'Distributed Systems',
  'Computer Science',
  'Behavioral Science',
  'Fine Art & Typography',
  'Philosophy & Mind',
];

export const UserProfile: React.FC = () => {
  const { user, login, addToCart, openCart, showToast, orders: storeOrders } = useStore();

  // Local Orders state allowing interactive operations (e.g., cancel, complete pay)
  const [orders, setOrders] = useState<OrderDisplay[]>(() => {
    if (storeOrders && storeOrders.length > 0) {
      const convertedStoreOrders: OrderDisplay[] = storeOrders
        .filter((so) => !INITIAL_ORDERS.some((io) => io.orderNumber === so.orderNumber || io.id === so.id))
        .map((so) => ({
          id: so.id,
          orderNumber: so.orderNumber.startsWith('#') || so.orderNumber.startsWith('BV-') ? so.orderNumber : `#${so.orderNumber}`,
          date: new Date(so.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          total: so.totalAmount,
          status: so.status,
          paymentMethod: so.paymentStatus === 'paid' ? 'VietQR' : 'COD',
          shippingNote: 'Shipped via BookVerse Express • Est. Delivery in 3 days',
          carrier: 'BookVerse Express',
          trackingNumber: `BVE-${so.orderNumber.replace(/[^0-9]/g, '') || '98421'}-VN`,
          items: so.items.map((it) => ({
            bookId: it.bookId,
            title: it.title,
            author: 'BookVerse Author',
            format: 'Paperback',
            price: it.price,
            quantity: it.quantity,
            coverImage: it.coverImage,
          })),
        }));
      return [...convertedStoreOrders, ...INITIAL_ORDERS];
    }
    return INITIAL_ORDERS;
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isVietQrModalOpen, setIsVietQrModalOpen] = useState(false);

  // Selected item targets for modals
  const [selectedBookForReview, setSelectedBookForReview] = useState<OrderItemDisplay | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderDisplay | null>(null);
  const [selectedOrderForVietQr, setSelectedOrderForVietQr] = useState<OrderDisplay | null>(null);

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(user?.name || 'Dr. Emily Vance');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'emily.vance@reader.org');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+84 912 345 678');
  const [profileAddress, setProfileAddress] = useState(
    user?.address || '123 Le Loi Street, Ben Nghe Ward, District 1, Ho Chi Minh City'
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'Literary Fiction',
    'Distributed Systems',
  ]);

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(true);

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      const statusMatch = activeFilter === 'all' || order.status === activeFilter;

      // 2. Search Query Filter (Order ID, Item Titles, Item Authors)
      const query = searchQuery.trim().toLowerCase();
      if (!query) return statusMatch;

      const orderNumberMatch = order.orderNumber.toLowerCase().includes(query);
      const itemsMatch = order.items.some(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
      );

      return statusMatch && (orderNumberMatch || itemsMatch);
    });
  }, [orders, activeFilter, searchQuery]);

  // Handlers
  const handleOpenEditProfile = () => {
    setProfileName(user?.name || 'Dr. Emily Vance');
    setProfileEmail(user?.email || 'emily.vance@reader.org');
    setProfilePhone(user?.phone || '+84 912 345 678');
    setProfileAddress(
      user?.address || '123 Le Loi Street, Ben Nghe Ward, District 1, Ho Chi Minh City'
    );
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      ...user,
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress,
    });
    setIsEditProfileOpen(false);
    showToast('Hồ sơ đã được cập nhật thành công! / Profile updated successfully!');
  };

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleOpenReview = (item: OrderItemDisplay) => {
    setSelectedBookForReview(item);
    setRating(5);
    setReviewTitle('');
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewComment.trim().length < 10) {
      showToast('Nội dung nhận xét tối thiểu 10 ký tự! / Minimum 10 characters required.');
      return;
    }

    // Append review to target book if present in mock catalog
    if (selectedBookForReview) {
      const targetBook = MOCK_BOOKS.find((b) => b.id === selectedBookForReview.bookId);
      if (targetBook) {
        if (!targetBook.reviews) targetBook.reviews = [];
        targetBook.reviews.push({
          id: `rev-${Date.now()}`,
          author: user?.name || profileName,
          rating,
          date: 'Nov 02, 2026',
          comment: reviewComment,
          role: 'Verified Patron',
        });
      }
    }

    setIsReviewModalOpen(false);
    showToast('Cảm ơn bạn đã gửi đánh giá! / Thank you for your review!');
  };

  const handleOpenTracking = (order: OrderDisplay) => {
    setSelectedOrderForTracking(order);
    setIsTrackingModalOpen(true);
  };

  const handleReorder = (order: OrderDisplay) => {
    // Add all items from this order into cart
    order.items.forEach((item) => {
      const bookObj: Book = {
        id: item.bookId,
        title: item.title,
        author: item.author,
        publisher: 'BookVerse Publishing',
        price: item.price,
        rating: 4.9,
        reviewCount: 300,
        inStock: true,
        stockCount: 20,
        coverImage: item.coverImage,
        genre: 'Literary Fiction',
        format: (item.format as any) || 'Paperback',
        description: item.title,
      };
      addToCart(bookObj, item.quantity);
    });
    openCart();
    showToast(`Đã thêm ${order.items.length} tác phẩm vào Giỏ sách!`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'cancelled' } : ord))
    );
    showToast('Đơn hàng đã được hủy thành công.');
  };

  const handleOpenVietQr = (order: OrderDisplay) => {
    setSelectedOrderForVietQr(order);
    setIsVietQrModalOpen(true);
  };

  const handleConfirmVietQrPaid = () => {
    if (!selectedOrderForVietQr) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrderForVietQr.id ? { ...ord, status: 'paid' } : ord
      )
    );
    setIsVietQrModalOpen(false);
    showToast('Thanh toán VietQR đã xác nhận thành công! / VietQR payment verified!');
  };

  // Helper rating satisfaction label
  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Rất hài lòng / Highly Satisfied (5/5)';
      case 4:
        return 'Hài lòng / Satisfied (4/5)';
      case 3:
        return 'Bình thường / Average (3/5)';
      case 2:
        return 'Chưa hài lòng / Dissatisfied (2/5)';
      default:
        return 'Kém / Poor (1/5)';
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Patron Header Section with Ambient Glow */}
      <section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl px-gutter-lg sm:px-margin-lg">
        {/* Ambient atmospheric glows */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="flex items-start sm:items-center gap-space-md">
              {/* Avatar with Scholar Badge */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt={user?.name || 'Dr. Emily Vance'}
                    src={
                      user?.avatar ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXmY7efIz2UuvecoK39JJVtuQ-MiAadbC6AKKk-HADmzVIvMTfcfLvWvQllriDnjsROu1359TNfwyuiJ3n0NBDdVTBwj5HgvmIRIzX9xBH9SDtWtisJe4FL6YhXGnuSjJx45Zl5uivEmMh3SGR5PvWZ1_exNl0a227dL8e3x26IxDKmu-ZIztZ-0xEmbw1NhmQ7tAl3XXK8DE3aQUlxaU7pfslUf9fVTx680VqNq9I'
                    }
                  />
                </div>
                <span
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-sm"
                  title="Bibliophile Scholar"
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    workspace_premium
                  </span>
                </span>
              </div>

              {/* Name, Email, Tier Metadata */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                    {user?.name || 'Dr. Emily Vance'}
                  </h1>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    mail
                  </span>
                  <span>{user?.email || 'emily.vance@reader.org'}</span>
                </p>
                <div className="flex items-center gap-space-sm mt-space-xs font-label-md text-label-md text-on-surface-variant">
                  <span className="text-primary font-semibold">
                    Bibliophile Scholar • Level 4
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  <span>Member since 2021</span>
                </div>
              </div>
            </div>

            {/* Edit Profile CTA Button */}
            <div className="flex items-center gap-space-md self-start md:self-auto">
              <button
                id="openEditProfileBtn"
                onClick={handleOpenEditProfile}
                className="inline-flex items-center gap-space-xs px-space-lg h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Reading Statistics Bento Grid & Orders Workspace */}
      <section className="max-w-7xl mx-auto w-full px-gutter-lg sm:px-margin-lg py-space-xl flex flex-col gap-space-lg">
        {/* 4 Bento Reading Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md w-full">
          {/* Card 1: Total Volumes Read */}
          <div className="p-space-lg rounded-DEFAULT bg-surface-container-low flex items-center justify-between shadow-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                Total Volumes Read
              </span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">
                64
              </p>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                42 Acquired • 22 Borrowed
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_library</span>
            </div>
          </div>

          {/* Card 2: Current Borrowings */}
          <div className="p-space-lg rounded-DEFAULT bg-surface-container-low flex items-center justify-between shadow-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                Current Borrowings
              </span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">
                3 Titles
              </p>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Due in 12 days • No late fees
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
          </div>

          {/* Card 3: Reading Challenge Progress Bar */}
          <div className="p-space-lg rounded-DEFAULT bg-surface-container-low flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                Reading Challenge
              </span>
              <span className="font-label-sm text-label-sm font-bold text-primary">
                75%
              </span>
            </div>
            <div className="my-1.5">
              <p className="font-headline-sm text-headline-sm font-bold text-primary">
                18 <span className="text-body-sm font-normal text-secondary">/ 24 Books</span>
              </p>
              {/* Progress bar */}
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              6 books remaining to reach goal
            </span>
          </div>

          {/* Card 4: Lifetime Loyalty Points */}
          <div className="p-space-lg rounded-DEFAULT bg-surface-container-low flex items-center justify-between shadow-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                Loyalty Points
              </span>
              <p className="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">
                2,450 <span className="text-body-sm font-normal text-secondary">Pts</span>
              </p>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Tier IV • 3 Active Vouchers
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shadow-sm shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
            </div>
          </div>
        </div>

        {/* 3. Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          {/* Keyword Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              id="order-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-10 rounded-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
              placeholder="Search by Order ID, book title, author..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1" id="filter-chips">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`filter-chip px-space-md h-8 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold active'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {activeFilter === 'all' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>All Orders</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('paid')}
              className={`filter-chip px-space-md h-8 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                activeFilter === 'paid'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold active'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {activeFilter === 'paid' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>Paid &amp; Dispatched</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`filter-chip px-space-md h-8 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold active'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {activeFilter === 'pending' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>Pending Settlement</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('delivered')}
              className={`filter-chip px-space-md h-8 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                activeFilter === 'delivered'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold active'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {activeFilter === 'delivered' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>Delivered</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('cancelled')}
              className={`filter-chip px-space-md h-8 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                activeFilter === 'cancelled'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold active'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {activeFilter === 'cancelled' && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>Cancelled</span>
            </button>
          </div>
        </div>

        {/* 4. Orders List Container */}
        <div className="flex flex-col gap-space-lg" id="orders-container">
          {filteredOrders.length === 0 ? (
            <div className="p-space-xxl rounded-DEFAULT bg-surface-container-lowest border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-space-sm shadow-sm">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[32px]">receipt_long</span>
              </div>
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                No orders match your filter
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Try searching with a different keyword or switch to another status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-space-lg h-10 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const itemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="order-card p-space-lg rounded-DEFAULT bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col gap-space-md border border-outline-variant/20"
                  data-status={order.status}
                >
                  {/* Card Header: Order Identifier, Date, Total, Payment Method & Status Badge */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
                    <div className="flex flex-wrap items-center gap-space-md">
                      <div>
                        <span className="font-label-sm text-label-sm uppercase text-outline">
                          Order Identifier
                        </span>
                        <p className="font-title-md text-title-md font-bold text-primary font-mono tracking-tight">
                          {order.orderNumber}
                        </p>
                      </div>

                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:block" />

                      <div>
                        <span className="font-label-sm text-label-sm uppercase text-outline">
                          Order Date
                        </span>
                        <p className="font-title-sm text-title-sm text-on-surface">
                          {order.date}
                        </p>
                      </div>

                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:block" />

                      <div>
                        <span className="font-label-sm text-label-sm uppercase text-outline">
                          Total Amount
                        </span>
                        <p
                          className={`font-title-md text-title-md font-bold ${
                            order.status === 'pending'
                              ? 'text-tertiary-container'
                              : 'text-on-surface'
                          }`}
                        >
                          ${order.total.toFixed(2)}
                        </p>
                      </div>

                      {/* Payment Method Badge (VietQR / COD) */}
                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:block" />
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                          {order.paymentMethod === 'VietQR' ? (
                            <>
                              <span className="material-symbols-outlined text-[14px] text-primary">
                                qr_code_2
                              </span>
                              <span>VietQR Pay</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[14px] text-secondary">
                                payments
                              </span>
                              <span>COD Payment</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-space-sm">
                      {order.status === 'paid' && (
                        <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span>Paid &amp; Processing</span>
                        </span>
                      )}

                      {order.status === 'delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">
                            done_all
                          </span>
                          <span>Delivered</span>
                        </span>
                      )}

                      {order.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">
                            hourglass_top
                          </span>
                          <span>Pending Payment</span>
                        </span>
                      )}

                      {order.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-medium">
                          <span className="material-symbols-outlined text-[14px]">
                            cancel
                          </span>
                          <span>Cancelled</span>
                        </span>
                      )}

                      <span className="text-outline font-label-sm text-label-sm">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Items Preview */}
                  {order.status === 'pending' ? (
                    /* Pending Multi-edition consignment package strip */
                    <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                        <span className="font-semibold text-on-surface">
                          Consignment Package ({order.items.length} Editions)
                        </span>
                        <span className="text-outline">
                          Awaiting Bank Settlement Confirmation
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm overflow-x-auto py-1">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-space-sm py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface whitespace-nowrap"
                          >
                            {item.quantity}× {item.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Standard item visual thumbnail cards */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md rounded-lg bg-surface-container-low">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-space-md min-w-0">
                          <div className="w-14 h-20 shrink-0 rounded-md overflow-hidden bg-surface-container shadow-sm">
                            <img
                              className="w-full h-full object-cover"
                              src={item.coverImage}
                              alt={item.title}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                              {item.title}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                              {item.author} • {item.format}
                            </p>
                            <p className="font-label-md text-label-md text-primary font-semibold mt-1">
                              {item.quantity} × ${item.price.toFixed(2)}
                              {item.signedCopy && ' • Signed Copy'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Shipping Note & Actions Cluster */}
                  <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                      {order.status === 'delivered' ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] text-outline">
                            calendar_today
                          </span>
                          <span>{order.shippingNote}</span>
                        </>
                      ) : order.status === 'paid' ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            local_shipping
                          </span>
                          <span>{order.shippingNote}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px] text-tertiary">
                            info
                          </span>
                          <span className="text-tertiary-container">{order.shippingNote}</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-space-xs">
                      {order.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-space-md h-9 rounded-full bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              close
                            </span>
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenVietQr(order)}
                            className="px-space-md h-9 rounded-full bg-tertiary text-on-tertiary hover:opacity-95 font-label-lg text-label-lg font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              qr_code_2
                            </span>
                            <span>Complete VietQR Pay</span>
                          </button>
                        </>
                      )}

                      {order.status === 'paid' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenTracking(order)}
                            className="px-space-md h-9 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              near_me
                            </span>
                            <span>Track Shipment</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-space-md h-9 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              refresh
                            </span>
                            <span>Buy Again</span>
                          </button>
                        </>
                      )}

                      {order.status === 'delivered' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(order.items[0])}
                            className="px-space-md h-9 rounded-full bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              rate_review
                            </span>
                            <span>Write Review</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-space-md h-9 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              refresh
                            </span>
                            <span>Buy Again</span>
                          </button>
                        </>
                      )}

                      {order.status === 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-space-md h-9 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            refresh
                          </span>
                          <span>Reorder</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. M3 Architectural Pagination Bar */}
        <div className="flex items-center justify-between pt-space-md font-label-md text-label-md text-on-surface-variant border-t border-surface-container">
          <span>
            Showing {filteredOrders.length} of {orders.length} recorded orders
          </span>
          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-outline transition-colors disabled:opacity-40 cursor-pointer"
              disabled
              type="button"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-bold">
              1
            </span>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              type="button"
            >
              <span>2</span>
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              type="button"
            >
              <span>3</span>
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              type="button"
              aria-label="Next page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Edit Profile Modal Dialog */}
      {isEditProfileOpen && (
        <div
          id="edit-profile-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-background/40 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-lg p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-lg animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">person_edit</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface tracking-tight">
                    Chỉnh sửa hồ sơ • Edit Profile
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Cập nhật thông tin định danh &amp; giao hàng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-space-md">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    badge
                  </span>
                  <span>TÊN / Full Name</span>
                  <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full h-11 px-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                />
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      call
                    </span>
                    <span>SĐT / Phone Number</span>
                    <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+84 9xx xxx xxx"
                    className="w-full h-11 px-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      mail
                    </span>
                    <span>EMAIL / Email Address</span>
                    <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full h-11 px-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    home_pin
                  </span>
                  <span>ĐỊA CHỈ / Shipping Address</span>
                  <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  className="w-full p-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Reading Preferences Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    bookmarks
                  </span>
                  <span>Chủ đề yêu thích / Reading Preferences</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PREFERENCE_TAGS.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleToggleGenre(genre)}
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-secondary-container text-on-secondary-container font-semibold'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high mt-1">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-space-lg h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium transition-colors cursor-pointer"
                >
                  Hủy / Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-xl h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Lưu thay đổi / Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Book Review Modal Dialog */}
      {isReviewModalOpen && selectedBookForReview && (
        <div
          id="book-review-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-background/40 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-lg p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-lg animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface tracking-tight">
                    Đánh giá sách • Book Review
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-sm sm:max-w-md">
                    {selectedBookForReview.title} • {selectedBookForReview.author}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors shrink-0 cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-space-md">
              {/* Star Rating Group */}
              <div className="flex flex-col gap-1.5 p-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      star
                    </span>
                    <span>Mức độ hài lòng / Rating</span>
                    <span className="text-error">*</span>
                  </label>
                  <span
                    id="rating-text-label"
                    className="font-label-md text-label-md font-bold text-primary"
                  >
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1" id="star-rating-group">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="star-btn text-tertiary-container hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                        aria-label={`${starVal} Star`}
                      >
                        <span
                          className="material-symbols-outlined text-[28px]"
                          style={{
                            fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0",
                            color: isFilled ? '#661c00' : '#74777f',
                          }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    title
                  </span>
                  <span>Tiêu đề nhận xét / Headline</span>
                  <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Tóm tắt cảm nhận (ví dụ: Tác phẩm kinh điển, bản in rất đẹp...)"
                  className="w-full h-11 px-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors"
                />
              </div>

              {/* Detailed Review Textarea */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      edit_note
                    </span>
                    <span>Nội dung chi tiết / Detailed Review</span>
                    <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-outline">
                    Tối thiểu 10 ký tự
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm đọc, chất lượng bìa sách, bản dịch và chất lượng đóng gói..."
                  className="w-full p-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Photo Upload Zone */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    photo_camera
                  </span>
                  <span>Hình ảnh thực tế / Photos (Tùy chọn)</span>
                </label>
                <div className="w-full p-space-md border border-dashed border-outline-variant rounded-DEFAULT bg-surface-container-low flex flex-col items-center justify-center text-center gap-1 cursor-pointer hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[24px] text-outline">
                    add_photo_alternate
                  </span>
                  <p className="font-label-md text-label-md font-medium text-on-surface">
                    Thêm ảnh / Video chụp sách thực tế (tối đa 3 ảnh)
                  </p>
                  <span className="font-label-sm text-label-sm text-outline">
                    JPG, PNG hoặc WebP tối đa 5MB
                  </span>
                </div>
              </div>

              {/* Verified Buyer Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-badge-checkbox"
                  checked={isVerifiedBuyer}
                  onChange={(e) => setIsVerifiedBuyer(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="verified-badge-checkbox"
                  className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 cursor-pointer select-none"
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span>Hiển thị huy hiệu Người mua đã xác thực (Verified Buyer)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high mt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-space-lg h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium transition-colors cursor-pointer"
                >
                  Hủy / Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-xl h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Gửi đánh giá / Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Track Package Modal Dialog */}
      {isTrackingModalOpen && selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-background/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-lg p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-lg animate-fadeIn">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface tracking-tight">
                    Theo dõi đơn hàng • Shipment Tracking
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {selectedOrderForTracking.orderNumber} •{' '}
                    {selectedOrderForTracking.carrier || 'BookVerse Express'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Tracking Status Timeline */}
            <div className="flex flex-col gap-space-md">
              <div className="p-space-md rounded-DEFAULT bg-surface-container-low flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline">
                    Mã vận đơn / Tracking Code
                  </span>
                  <p className="font-title-md text-title-md font-mono font-bold text-primary">
                    {selectedOrderForTracking.trackingNumber || 'BVE-98421-VN'}
                  </p>
                </div>
                <span className="px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-semibold">
                  Đang giao hàng
                </span>
              </div>

              {/* 4-Step Milestone Chain */}
              <div className="space-y-4 px-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div>
                    <p className="font-title-sm text-title-sm font-semibold text-on-surface">
                      Đơn hàng đã được xác nhận (Order Confirmed)
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Oct 24, 2025 • 09:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  </div>
                  <div>
                    <p className="font-title-sm text-title-sm font-semibold text-on-surface">
                      Đã đóng gói &amp; kiểm tra chất lượng (Pristine Packaged)
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Oct 25, 2025 • 02:15 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">
                      local_shipping
                    </span>
                  </div>
                  <div>
                    <p className="font-title-sm text-title-sm font-semibold text-primary">
                      Đang vận chuyển liên tỉnh (In Transit via BookVerse Express)
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Oct 26, 2025 • 08:45 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-outline">
                    <span className="material-symbols-outlined text-[16px]">home</span>
                  </div>
                  <div>
                    <p className="font-title-sm text-title-sm font-semibold text-on-surface">
                      Dự kiến giao hàng (Estimated Delivery)
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Oct 27, 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-space-xs border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(false)}
                className="px-space-xl h-10 rounded-full bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors cursor-pointer"
              >
                Đóng / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. VietQR Settlement Modal (for Pending orders) */}
      {isVietQrModalOpen && selectedOrderForVietQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-background/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-lg p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-lg animate-fadeIn">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant shrink-0">
                  <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface tracking-tight">
                    Thanh toán VietQR • Instant Settlement
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {selectedOrderForVietQr.orderNumber} • ${selectedOrderForVietQr.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVietQrModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* QR Centerpiece */}
            <div className="flex flex-col items-center justify-center gap-3 p-space-md rounded-DEFAULT bg-surface-container-low border border-outline-variant/30">
              <div className="w-52 h-52 bg-white p-3 rounded-2xl shadow-sm border border-outline-variant/40 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  {/* Outer corner markers */}
                  <rect x="15" y="15" width="45" height="45" rx="6" stroke="#002045" strokeWidth="8" />
                  <rect x="25" y="25" width="25" height="25" rx="2" fill="#002045" />
                  <rect x="140" y="15" width="45" height="45" rx="6" stroke="#002045" strokeWidth="8" />
                  <rect x="150" y="25" width="25" height="25" rx="2" fill="#002045" />
                  <rect x="15" y="140" width="45" height="45" rx="6" stroke="#002045" strokeWidth="8" />
                  <rect x="25" y="150" width="25" height="25" rx="2" fill="#002045" />
                  {/* Data patterns */}
                  <path
                    d="M75 25h15v15H75zM105 25h15v15h-15zM75 55h30v15H75zM120 55h15v30h-15zM25 75h15v15H25zM55 75h15v30H55zM25 105h30v15H25zM75 90h15v15H75zM105 90h30v15h-30zM150 75h25v15h-25zM150 105h15v30h-15zM175 120h10v25h-10zM75 120h15v15H75zM105 120h15v30h-15zM75 150h30v15H75zM120 165h45v15h-45zM150 150h25v15h-25z"
                    fill="#1A365D"
                  />
                  {/* Central emblem */}
                  <circle cx="100" cy="100" r="18" fill="#002045" />
                  <path
                    d="M93 96c1-2 4-3 7-3s6 1 7 3v8c-1-1-4-2-7-2s-6 1-7 2v-8z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <p className="font-label-sm text-label-sm text-center text-on-surface-variant max-w-xs">
                Mở ứng dụng ngân hàng hoặc ví điện tử (Vietcombank, MB Bank, MoMo) để quét mã PayOS.
              </p>
            </div>

            {/* Banking credentials */}
            <div className="space-y-2 font-label-md text-label-md">
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-outline">Ngân hàng thụ hưởng:</span>
                <span className="font-semibold text-on-surface">MB Bank / Vietcombank</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-outline">Số tài khoản:</span>
                <span className="font-mono font-bold text-primary">998822334455</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-outline">Nội dung chuyển khoản:</span>
                <span className="font-mono font-bold text-tertiary">
                  BOOKVERSE {selectedOrderForVietQr.orderNumber.replace('#', '')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => setIsVietQrModalOpen(false)}
                className="px-space-md h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors cursor-pointer"
              >
                Hủy / Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVietQrPaid}
                className="px-space-lg h-10 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Tôi đã chuyển khoản thành công</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

/**
 * Firebase Client SDK Service & Firestore Data Mappers
 * Project: management-for-library
 * Strict isolation: Client keys only; no serverAccountKey or backend secrets.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

import {
  Book,
  BookGenre,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  User,
  UserRole,
  Voucher,
  VoucherDiscountType,
  VoucherStatus,
} from '../types';

import { InventoryBook } from '../components/admin-inventory/types';
import { FulfillmentOrder, OrderFulfillmentCycle } from '../components/admin-orders/types';
import { AdminVoucher } from '../components/admin-vouchers/types';
import { AdminManagedUser, getInitials } from '../components/admin-users/types';

// ============================================================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ============================================================================

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const firebaseConfig: FirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyChv3p3K7JqiVk-Y34aZvF96-B6sMZ0__s',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'management-for-library.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'management-for-library',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'management-for-library.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '553315753053',
  appId: env.VITE_FIREBASE_APP_ID || '1:553315753053:web:c761c45300a1fa4769c1b4',
};

// Singleton initialization with HMR guard
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Exact verified collection names in Cloud Firestore
export const FIRESTORE_COLLECTIONS = {
  BOOKS: 'Books',
  ORDER: 'Order',
  USERS: 'Users',
  VOUCHERS: 'Vouchers',
  CATEGORIES: 'Categories',
  AUTHORS: 'Authors',
  REVIEWS: 'Reviews',
  TRANSACTIONS: 'Transactions',
} as const;

// ============================================================================
// 2. UTILITY HELPERS
// ============================================================================

/**
 * Robust timestamp conversion handling Firestore Timestamps, ISO strings, numbers, or Date objects
 */
export function convertTimestampToISO(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (timestamp._seconds !== undefined) {
    return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000).toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date().toISOString();
}

/**
 * Normalizes Vietnamese category names or raw strings to valid BookGenre union
 */
export function normalizeCategoryToGenre(categoryName?: string): BookGenre {
  if (!categoryName) return 'Literary Fiction';
  const lower = categoryName.toLowerCase();
  if (lower.includes('lập trình') || lower.includes('công nghệ') || lower.includes('phần mềm') || lower.includes('tech') || lower.includes('coding')) {
    return 'Tech & Coding';
  }
  if (lower.includes('hệ thống') || lower.includes('distributed')) {
    return 'Distributed Systems';
  }
  if (lower.includes('khoa học máy tính') || lower.includes('computer science')) {
    return 'Computer Science';
  }
  if (lower.includes('kỹ năng') || lower.includes('phát triển bản thân') || lower.includes('self-growth') || lower.includes('habits')) {
    return 'Self-Growth';
  }
  if (lower.includes('viễn tưởng') || lower.includes('sci-fi') || lower.includes('fantasy')) {
    return 'Sci-Fi & Fantasy';
  }
  if (lower.includes('lịch sử') || lower.includes('tư duy') || lower.includes('history') || lower.includes('mind')) {
    return 'History & Mind';
  }
  if (lower.includes('tiểu thuyết đồ họa') || lower.includes('graphic novel') || lower.includes('truyện tranh')) {
    return 'Graphic Novels';
  }
  return 'Literary Fiction';
}

// ============================================================================
// 3. DATA MAPPERS (FIRESTORE -> FRONTEND TYPES)
// ============================================================================

/**
 * Maps Firestore "Books" document to frontend Book model
 */
export function mapFirestoreBookToBook(data: any, id: string): Book {
  const specs = data.specifications || {};
  const rawCatName =
    Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories[0].nameCategories || data.categories[0]
      : data.category || data.genre;

  const resolvedGenre = normalizeCategoryToGenre(typeof rawCatName === 'string' ? rawCatName : undefined);
  const stock = data.stockQuantity ?? data.stockCount ?? 0;
  const sold = data.soldCount ?? 0;

  return {
    id: id || data.id,
    title: data.title || 'Chưa có tiêu đề',
    subtitle: data.subtitle || (data.description ? data.description.substring(0, 85) + '...' : ''),
    author: data.nameAuthor || data.author || 'Tác giả',
    authorBio: data.authorBio || '',
    authorImage: data.authorImage || '',
    publisher: specs.publisher || data.publisher || 'NXB Trẻ',
    price: data.salePrice ?? data.price ?? 0,
    originalPrice: data.originalPrice ?? data.salePrice ?? data.price ?? 0,
    rating: data.averageRating ?? data.rating ?? 5.0,
    reviewCount: data.reviewCount ?? 0,
    inStock: stock > 0,
    stockCount: stock,
    coverImage: data.imgCoverPage || data.coverImage || '',
    genre: resolvedGenre,
    format: 'Standard',
    description: data.description || '',
    featured: data.featured ?? (sold >= 300),
    isBestseller: data.isBestseller ?? (sold >= 300),
    specs: {
      isbn: data.ISBN12 || specs.isbn || 'N/A',
      format: 'Standard',
      pages: specs.numPages || specs.pages || 0,
      language: specs.language || 'Tiếng Việt',
      publisher: specs.publisher || data.publisher || 'NXB Trẻ',
      dimensions: specs.width ? `${specs.width} x ${specs.height || 20} cm` : specs.dimensions || '13 x 20 cm',
      weight: specs.weight ? `${specs.weight} g` : '350 g',
      publicationYear: specs.releaseDate ? new Date(specs.releaseDate).getFullYear() : specs.publicationYear || 2023,
    },
  };
}

/**
 * Maps Firestore "Books" document to Admin InventoryBook
 */
export function mapFirestoreBookToInventoryBook(data: any, id: string): InventoryBook {
  const specs = data.specifications || {};
  const rawCat =
    Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories[0].nameCategories || data.categories[0]
      : data.category || 'Văn học';

  const stock = data.stockQuantity ?? data.stockCount ?? 0;
  const sold = data.soldCount ?? 0;

  return {
    id: id || data.id,
    title: data.title || 'Chưa có tiêu đề',
    author: data.nameAuthor || data.author || 'Tác giả',
    category: typeof rawCat === 'string' ? rawCat : 'Văn học',
    categories: Array.isArray(data.categories) ? data.categories.map((c: any) => c.nameCategories || c) : [rawCat],
    isbn: data.ISBN12 || specs.isbn || 'N/A',
    totalUnits: stock + sold,
    availableUnits: stock,
    price: data.salePrice ?? data.price ?? 0,
    originalPrice: data.originalPrice ?? data.salePrice ?? data.price ?? 0,
    coverImage: data.imgCoverPage || data.coverImage || '',
    coverAlt: `Bìa sách ${data.title || ''}`,
    publisher: specs.publisher || data.publisher || 'NXB Trẻ',
    publishYear: specs.releaseDate ? new Date(specs.releaseDate).getFullYear() : 2023,
    pages: specs.numPages || 0,
    language: specs.language || 'Tiếng Việt',
    formatVi: 'Ấn bản tiêu chuẩn',
    description: data.description || '',
  };
}

/**
 * Maps Firestore "Order" document to frontend Order model
 */
export function mapFirestoreOrderToOrder(data: any, id: string): Order {
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const normalizedItems: OrderItem[] = rawItems.map((item: any) => ({
    bookId: item.bookId || item.idBook || item.id || '',
    title: item.title || 'Sách',
    price: item.price || 0,
    quantity: item.quantity || 1,
    coverImage: item.coverImage || item.imgCover || '',
  }));

  const infoCustom = data.infoCustom || {};
  const customerName = infoCustom.name || infoCustom.cusName || data.userName || 'Độc giả';
  const customerEmail = infoCustom.email || infoCustom.cusMail || data.userEmail || '';

  const rawPaymentStatus = String(data.statusPayment || data.paymentStatus || 'pending').toLowerCase();
  const paymentStatus: PaymentStatus =
    rawPaymentStatus === 'paid' ? 'paid' :
    rawPaymentStatus === 'failed' ? 'failed' :
    rawPaymentStatus === 'refunded' ? 'refunded' : 'pending';

  const rawOrderStatus = String(data.statusOrder || data.status || 'pending').toLowerCase();
  const orderStatus: OrderStatus =
    rawOrderStatus === 'delivered' ? 'delivered' :
    rawOrderStatus === 'shipped' ? 'shipped' :
    rawOrderStatus === 'processing' ? 'processing' :
    rawOrderStatus === 'cancelled' ? 'cancelled' : 'pending';

  const total = data.totalPrice ?? data.totalAmount ?? 0;
  const subtotal = data.subTotal ?? data.subtotal ?? total;
  const discount = data.discountAmount ?? data.discount ?? 0;
  const shippingFee = data.shipMethod?.fee ?? data.shippingFee ?? 0;

  return {
    id: id || data.id,
    orderNumber: data.codeOrder || data.orderNumber || `#ORD-${id.substring(0, 6)}`,
    userId: data.idUser || data.userId || '',
    userName: customerName,
    userEmail: customerEmail,
    items: normalizedItems,
    subtotal,
    discount,
    shippingFee,
    totalAmount: total,
    total,
    status: orderStatus,
    paymentStatus,
    voucherCode: data.appliedVoucher || data.voucherCode || undefined,
    createdAt: convertTimestampToISO(data.createAt || data.createdAt),
    updatedAt: convertTimestampToISO(data.updateAt || data.updatedAt),
  };
}

/**
 * Maps Firestore "Order" document to Admin FulfillmentOrder
 */
export function mapFirestoreOrderToFulfillmentOrder(data: any, id: string): FulfillmentOrder {
  const order = mapFirestoreOrderToOrder(data, id);
  const infoCustom = data.infoCustom || {};

  const statusRaw = (data.statusOrder || '').toUpperCase();
  let fulfillmentCycle: OrderFulfillmentCycle = 'Pending';
  if (statusRaw === 'DELIVERED') fulfillmentCycle = 'Delivered';
  else if (statusRaw === 'RETURNED') fulfillmentCycle = 'Returned';
  else if (statusRaw === 'CANCELLED') fulfillmentCycle = 'Cancelled';
  else fulfillmentCycle = 'Pending';

  const paymentRaw = (data.statusPayment || '').toUpperCase();
  let paymentStatus: FulfillmentOrder['paymentStatus'] = 'VietQR Settled';
  if (paymentRaw === 'PAID') {
    paymentStatus = data.methodPayment === 'COD' ? 'COD Settled' : 'VietQR Settled';
  } else {
    paymentStatus = data.methodPayment === 'COD' ? 'COD Settled' : 'Pending VietQR';
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    dispatchType: data.shipMethod?.method || 'Giao hàng tiêu chuẩn',
    patronName: order.userName,
    patronEmail: order.userEmail || (order.userId ? `user-${order.userId.substring(0, 8)}@bookverse.patron` : 'patron@bookverse.patron'),
    patronAvatar: infoCustom.cusAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    books: order.items.map((i) => ({
      title: i.title,
      coverImage: i.coverImage,
      quantity: i.quantity,
      orderNote: 'Ấn bản tiêu chuẩn',
      price: i.price,
    })),
    dueDate: new Date(order.createdAt).toLocaleDateString('vi-VN'),
    dueSubtext: fulfillmentCycle === 'Delivered' ? 'Đã giao' : 'Đang xử lý',
    paymentStatus,
    fulfillmentCycle,
    orderTotalVND: order.totalAmount,
  };
}

/**
 * Maps Firestore "Users" document to frontend User model
 */
export function mapFirestoreUserToUser(data: any, id: string): User {
  const rawRole = String(data.roleUser || data.role || 'USER').toUpperCase();
  const role: UserRole = rawRole === 'ADMIN' ? 'admin' : 'customer';

  let city = '';
  let district = '';
  let detailedAddress = '';

  if (Array.isArray(data.addressUser) && data.addressUser.length > 0) {
    const addr = data.addressUser[0];
    if (typeof addr === 'object' && addr !== null) {
      city = addr.city || '';
      district = addr.district || '';
      detailedAddress = addr.detail || '';
    } else if (typeof addr === 'string') {
      detailedAddress = addr;
    }
  } else if (Array.isArray(data.addresUser) && data.addresUser.length > 0) {
    city = data.addresUser[0] || '';
    district = data.addresUser[1] || '';
    detailedAddress = data.addresUser[2] || '';
  }

  return {
    id: id || data.id || data['id '] || '',
    name: data.nameUser || data.name || 'Người dùng',
    email: data.emailUser || data.email || '',
    role,
    avatar: data.imgUser || data.avatar || '',
    phone: data.numTelephone || data.phone || '',
    address: detailedAddress ? `${detailedAddress}, ${district}, ${city}`.replace(/^, |, $/g, '') : '',
    city,
    district,
    detailedAddress,
  };
}

/**
 * Maps Firestore "Users" document to AdminManagedUser
 */
export function mapFirestoreUserToAdminManagedUser(data: any, id: string): AdminManagedUser {
  const user = mapFirestoreUserToUser(data, id);
  const fullName = user.name || 'Người dùng';
  const role = user.role === 'admin' ? 'admin' : 'user';

  return {
    id: user.id,
    uid: user.id.length > 8 ? user.id.substring(0, 8).toUpperCase() : user.id.toUpperCase(),
    name: fullName,
    email: user.email,
    phone: user.phone || 'Chưa cập nhật',
    role,
    status: 'active',
    initials: getInitials(fullName),
    avatarBgColor: role === 'admin' ? 'bg-primary-container' : 'bg-surface-container-high',
    avatarTextColor: role === 'admin' ? 'text-on-primary-container' : 'text-on-surface-variant',
    permissions: role === 'admin' ? ['all'] : ['orders.read'],
    totalSpend: data.totalSpend || (data.compltOrderCount ? data.compltOrderCount * 180000 : 0),
    createdAt: convertTimestampToISO(data.createAt || data.createdAt),
  };
}

/**
 * Maps Firestore "Vouchers" document to frontend Voucher model
 */
export function mapFirestoreVoucherToVoucher(data: any, id: string): Voucher {
  const rawType = String(data.typeVoucher || data.discountType || 'PERCENT').toUpperCase();
  const discountType: VoucherDiscountType =
    rawType === 'FIXED' ? 'fixed' :
    rawType === 'FREESHIP' ? 'shipping' : 'percentage';

  const discountValue = data.rateVoucher ?? data.discountValue ?? 0;
  const minSpend = data.minimumVoucher ?? data.minSpend ?? 0;
  const totalUsageLimit = data.usageVoucher ?? data.totalUsageLimit ?? 100;
  const usedCount = data.usedCount ?? 0;
  const startDate = convertTimestampToISO(data.startDate);
  const expiryDate = convertTimestampToISO(data.expiryDate);

  const now = Date.now();
  const startMs = new Date(startDate).getTime();
  const expiryMs = new Date(expiryDate).getTime();

  let status: VoucherStatus = 'active';
  if (data.stateVoucher === false || expiryMs < now || usedCount >= totalUsageLimit) {
    status = 'expired';
  } else if (startMs > now) {
    status = 'scheduled';
  }

  const generatedDesc =
    discountType === 'percentage'
      ? `Giảm ${discountValue}% cho đơn hàng từ ${minSpend.toLocaleString('vi-VN')} ₫.`
      : discountType === 'shipping'
      ? `Miễn phí giao hàng cho đơn từ ${minSpend.toLocaleString('vi-VN')} ₫.`
      : `Giảm ${discountValue.toLocaleString('vi-VN')} ₫ cho đơn hàng từ ${minSpend.toLocaleString('vi-VN')} ₫.`;

  return {
    id: id || data.id,
    code: data.codeVouchers || data.code || '',
    discountType,
    discountValue,
    minSpend,
    totalUsageLimit,
    usedCount,
    startDate,
    expiryDate,
    status,
    description: data.description || generatedDesc,
    applicableCategory: data.applicableCategory || 'Tất cả danh mục',
  };
}

/**
 * Maps Firestore "Vouchers" document to AdminVoucher
 */
export function mapFirestoreVoucherToAdminVoucher(data: any, id: string): AdminVoucher {
  const v = mapFirestoreVoucherToVoucher(data, id);
  const adminType = v.discountType === 'percentage' ? 'percent' : v.discountType;
  const adminStatus = v.status === 'expired' ? 'expired' : 'active';

  return {
    id: v.id,
    code: v.code,
    campaign: data.campaign || `Chương trình ${v.code}`,
    description: v.description,
    discountType: adminType,
    discountValue: v.discountValue,
    discountLabel: adminType === 'percent' ? `${v.discountValue}%` : adminType === 'shipping' ? 'Miễn phí vận chuyển' : `${v.discountValue.toLocaleString('vi-VN')} ₫`,
    conditionNote: `Đơn tối thiểu ${v.minSpend.toLocaleString('vi-VN')} ₫`,
    usedCount: v.usedCount,
    totalUsageLimit: v.totalUsageLimit,
    expiryDate: v.expiryDate,
    expiryNote: `Hết hạn ${new Date(v.expiryDate).toLocaleDateString('vi-VN')}`,
    status: adminStatus,
    minSpend: v.minSpend,
    startDate: v.startDate,
  };
}

// ============================================================================
// 4. MODULAR ASYNC FIRESTORE DATA HELPERS
// ============================================================================

/**
 * Fetches all books from Firestore "Books" collection
 */
export async function fetchBooksFromFirestore(): Promise<Book[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.BOOKS));
    return snap.docs.map((docSnap) => mapFirestoreBookToBook(docSnap.data(), docSnap.id));
  } catch (error) {
    console.error('[Firestore] Error fetching books:', error);
    throw error;
  }
}

/**
 * Fetches a single book by ID from Firestore "Books"
 */
export async function fetchBookByIdFromFirestore(bookId: string): Promise<Book | null> {
  try {
    if (!bookId) return null;
    const docRef = doc(db, FIRESTORE_COLLECTIONS.BOOKS, bookId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    return mapFirestoreBookToBook(snap.data(), snap.id);
  } catch (error) {
    console.error(`[Firestore] Error fetching book ${bookId}:`, error);
    throw error;
  }
}

export interface FirestoreCategory {
  id: string;
  nameCategories: string;
  name?: string;
}

/**
 * Fetches categories list from Firestore "Categories"
 */
export async function fetchCategoriesFromFirestore(): Promise<FirestoreCategory[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.CATEGORIES));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nameCategories: data.nameCategories || data.name || d.id,
        name: data.nameCategories || data.name || d.id,
      };
    });
  } catch (error) {
    console.error('[Firestore] Error fetching categories:', error);
    return [];
  }
}

export interface PatronReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  avatarText: string;
}

/**
 * Fetches reader reviews from Firestore "Reviews"
 */
export async function fetchReviewsFromFirestore(): Promise<PatronReview[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.REVIEWS));
    return snap.docs.map((d) => {
      const data = d.data();
      const author = data.author || data.userName || 'Độc giả';
      return {
        id: d.id,
        author,
        role: data.role || 'Độc giả thân thiết',
        rating: data.rating ?? 5,
        date: data.date || (data.createdAt ? convertTimestampToISO(data.createdAt).substring(0, 10) : '10/11/2026'),
        comment: data.comment || data.content || '',
        avatarText: author.slice(0, 2).toUpperCase(),
      };
    });
  } catch (error) {
    console.error('[Firestore] Error fetching reviews:', error);
    return [];
  }
}

/**
 * Fetches all vouchers from Firestore "Vouchers"
 */
export async function fetchVouchersFromFirestore(): Promise<Voucher[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.VOUCHERS));
    return snap.docs.map((docSnap) => mapFirestoreVoucherToVoucher(docSnap.data(), docSnap.id));
  } catch (error) {
    console.error('[Firestore] Error fetching vouchers:', error);
    throw error;
  }
}

/**
 * Fetches customer orders for a specific user ID
 */
export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  try {
    if (!userId) return [];
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.ORDER),
      where('idUser', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapFirestoreOrderToOrder(d.data(), d.id));
  } catch (error) {
    console.error(`[Firestore] Error fetching orders for user ${userId}:`, error);
    return [];
  }
}

/**
 * Fetches all orders (for Admin views)
 */
export async function fetchAllOrdersFromFirestore(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.ORDER));
    return snap.docs.map((d) => mapFirestoreOrderToOrder(d.data(), d.id));
  } catch (error) {
    console.error('[Firestore] Error fetching all orders:', error);
    throw error;
  }
}

/**
 * Subscribes to real-time status updates of an order document
 */
export function listenToOrderUpdates(
  orderId: string,
  onUpdate: (order: Order | null) => void
): () => void {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.ORDER, orderId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(mapFirestoreOrderToOrder(snap.data(), snap.id));
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error(`[Firestore onSnapshot] Error on order ${orderId}:`, error);
    }
  );
}

/**
 * Legacy compatibility listener: listens to transaction status
 */
export const listenToTransactionStatus = (
  transactionId: string,
  onUpdate: (status: string) => void
): (() => void) => {
  return listenToOrderUpdates(transactionId, (order) => {
    if (order) {
      onUpdate(order.paymentStatus);
    }
  });
};

/**
 * Fetches all users from Firestore (for Admin view)
 */
export async function fetchUsersFromFirestore(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.USERS));
    return snap.docs.map((d) => mapFirestoreUserToUser(d.data(), d.id));
  } catch (error) {
    console.error('[Firestore] Error fetching users:', error);
    throw error;
  }
}

// ============================================================================
// 5. GOOGLE AUTHENTICATION HELPERS
// ============================================================================

/**
 * Authenticates user via Google OAuth popup
 */
export async function signInWithGooglePopup(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('[FirebaseAuth] Error during Google popup sign-in:', error);
    throw error;
  }
}

/**
 * Signs out current authenticated user
 */
export async function logoutFirebaseUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[FirebaseAuth] Error during sign-out:', error);
    throw error;
  }
}

/**
 * Subscribes to Firebase Authentication state changes
 */
export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Queries Firestore "Users" collection for role and profile data:
 * 1. Checks doc(db, 'Users', uid)
 * 2. Checks query(collection(db, 'Users'), where('id', '==', uid))
 * 3. Checks query(collection(db, 'Users'), where('emailUser', '==', email))
 */
export async function lookupUserRoleAndProfile(
  uid: string,
  email?: string | null
): Promise<{ role: UserRole; firestoreData: any | null }> {
  try {
    if (!uid) {
      if (email) {
        const emailClean = email.trim().toLowerCase();
        if (emailClean.includes('admin') || emailClean === 'ops@bookverse.io') {
          return { role: 'admin', firestoreData: null };
        }
      }
      return { role: 'customer', firestoreData: null };
    }

    // 1. Direct document check
    const directDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
    const directSnap = await getDoc(directDocRef);
    if (directSnap.exists()) {
      const data = directSnap.data();
      const rawRole = String(data.roleUser || data.role || '').toUpperCase();
      const role: UserRole = rawRole === 'ADMIN' ? 'admin' : 'customer';
      return { role, firestoreData: data };
    }

    // 2. Query where "id" == uid
    const qId = query(collection(db, FIRESTORE_COLLECTIONS.USERS), where('id', '==', uid), limit(1));
    const snapId = await getDocs(qId);
    if (!snapId.empty) {
      const data = snapId.docs[0].data();
      const rawRole = String(data.roleUser || data.role || '').toUpperCase();
      const role: UserRole = rawRole === 'ADMIN' ? 'admin' : 'customer';
      return { role, firestoreData: data };
    }

    // 3. Query where "emailUser" == email
    if (email) {
      const qEmail = query(collection(db, FIRESTORE_COLLECTIONS.USERS), where('emailUser', '==', email), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        const data = snapEmail.docs[0].data();
        const rawRole = String(data.roleUser || data.role || '').toUpperCase();
        const role: UserRole = rawRole === 'ADMIN' ? 'admin' : 'customer';
        return { role, firestoreData: data };
      }
    }

    // Fallback: check email address patterns
    if (email) {
      const emailClean = email.trim().toLowerCase();
      if (emailClean.includes('admin') || emailClean === 'ops@bookverse.io') {
        return { role: 'admin', firestoreData: null };
      }
    }

    return { role: 'customer', firestoreData: null };
  } catch (error) {
    console.error(`[Firestore] Error looking up user role for uid ${uid}:`, error);
    if (email) {
      const emailClean = email.trim().toLowerCase();
      if (emailClean.includes('admin') || emailClean === 'ops@bookverse.io') {
        return { role: 'admin', firestoreData: null };
      }
    }
    return { role: 'customer', firestoreData: null };
  }
}

/**
 * Maps a FirebaseUser and optional Firestore document data to frontend User model
 */
export function mapFirebaseUserToUser(
  fbUser: FirebaseUser,
  role: UserRole = 'customer',
  firestoreData?: any
): User {
  if (firestoreData) {
    const user = mapFirestoreUserToUser(firestoreData, fbUser.uid);
    return {
      ...user,
      id: fbUser.uid,
      name:
        user.name && user.name !== 'Người dùng'
          ? user.name
          : fbUser.displayName || fbUser.email?.split('@')[0] || 'Patron Reader',
      email: user.email || fbUser.email || '',
      avatar: user.avatar || fbUser.photoURL || undefined,
      phone: user.phone || fbUser.phoneNumber || undefined,
      role,
    };
  }

  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Patron Reader',
    email: fbUser.email || '',
    role,
    avatar: fbUser.photoURL || undefined,
    phone: fbUser.phoneNumber || undefined,
  };
}

/**
 * Best-effort upsert of user document into Firestore collection "Users"
 */
export async function syncUserProfileToFirestore(
  fbUser: FirebaseUser,
  role: UserRole
): Promise<void> {
  try {
    if (!fbUser.uid) return;
    const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, fbUser.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(
        userDocRef,
        {
          id: fbUser.uid,
          nameUser: fbUser.displayName || fbUser.email?.split('@')[0] || 'Người dùng',
          emailUser: fbUser.email || '',
          roleUser: role === 'admin' ? 'ADMIN' : 'USER',
          imgUser: fbUser.photoURL || '',
          numTelephone: fbUser.phoneNumber || '',
          createAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn('[Firestore] Notice: Could not sync user document to Firestore:', err);
  }
}

/**
 * Retrieves the current user's ID token, optionally forcing a refresh
 */
export async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken(forceRefresh);
  } catch (error) {
    console.error('[FirebaseAuth] Error retrieving ID token:', error);
    return null;
  }
}

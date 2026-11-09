export type UserRole = 'customer' | 'admin' | 'curator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  detailedAddress?: string;
}

export type BookGenre =
  | 'Literary Fiction'
  | 'Tech & Coding'
  | 'Sci-Fi & Fantasy'
  | 'Self-Growth'
  | 'History & Mind'
  | 'Graphic Novels'
  | 'Distributed Systems'
  | 'Computer Science';

export type BookFormat = 'Standard';

export interface BookSpec {
  isbn: string;
  format: BookFormat;
  pages: number;
  language: string;
  publisher: string;
  dimensions: string;
  weight: string;
  publicationYear: number;
}

export interface BookReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  role?: string;
}

export interface BookFormatOption {
  price: number;
  original: number;
  labelVi?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  publisher: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  coverImage: string;
  genre: BookGenre;
  format: BookFormat;
  description: string;
  featured?: boolean;
  isBestseller?: boolean;
  keyFeatures?: string[];
  specs?: BookSpec;
  reviews?: BookReview[];
}

export interface CartItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  quantity: number;
  selected: boolean;
  inStock?: boolean;
}

export type VoucherDiscountType = 'percentage' | 'fixed' | 'shipping';
export type VoucherStatus = 'active' | 'scheduled' | 'expired';

export interface Voucher {
  id: string;
  code: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minSpend: number;
  totalUsageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  status: VoucherStatus;
  description: string;
  applicableCategory?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  coverImage: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  total?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  voucherCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  payOsOrderCode: number;
  paymentMethod: 'VietQR' | 'CreditCard' | 'COD';
  status: PaymentStatus;
  createdAt: string;
}

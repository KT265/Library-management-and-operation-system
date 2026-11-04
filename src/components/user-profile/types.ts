import { OrderStatus } from '../../types';

export interface OrderItemDisplay {
  bookId: string;
  title: string;
  author: string;
  format: string;
  price: number;
  quantity: number;
  coverImage: string;
  signedCopy?: boolean;
}

export interface OrderDisplay {
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

export interface PatronProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

export type OrderFilterTab = 'all' | 'processing' | 'pending' | 'delivered' | 'cancelled';

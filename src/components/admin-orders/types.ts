export interface OrderBookItem {
  title: string;
  coverImage: string;
  quantity: number;
  orderNote: string;
  price?: number;
}

export type OrderPaymentStatus = 'VietQR Settled' | 'Pending VietQR' | 'COD Settled';
export type OrderFulfillmentCycle = 'Delivered' | 'Returned' | 'Pending' | 'Processing' | 'Cancelled';

export interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  dispatchType?: string;
  patronName: string;
  patronEmail: string;
  patronAvatar: string;
  deliveryAddress?: string;
  books: OrderBookItem[];
  dueDate: string;
  dueSubtext: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentCycle: OrderFulfillmentCycle;
  statusOrder?: string;
  stateOrder?: string;
  orderTotalVND: number;
  totalPrice?: number;
  createAt?: any;
  createdAt?: string;
  fineAmountVND?: number;
  isOverdue?: boolean;
  trackingCode?: string;
}

export interface OrdersFilterState {
  searchTerm: string;
  statusChip: 'All' | 'Pending' | 'Processing' | 'Delivered' | 'Returned' | 'Cancelled';
  paymentFilter: 'all' | 'vietqr' | 'cod';
  fromDate: string;
  toDate: string;
}

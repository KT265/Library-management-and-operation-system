export interface OrderBookItem {
  title: string;
  coverImage: string;
  quantity: number;
  orderNote: string;
  price?: number;
}

export type OrderPaymentStatus = 'VietQR Settled' | 'Pending VietQR' | 'COD Settled';
export type OrderFulfillmentCycle = 'Delivered' | 'Returned' | 'Pending' | 'Cancelled';

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
  orderTotalVND: number;
  fineAmountVND?: number;
  isOverdue?: boolean;
  trackingCode?: string;
}

export interface OrdersFilterState {
  searchTerm: string;
  statusChip: 'All' | 'Pending' | 'Delivered' | 'Returned' | 'Cancelled';
  paymentFilter: 'all' | 'vietqr' | 'cod';
  fromDate: string;
  toDate: string;
}

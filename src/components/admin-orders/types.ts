export interface OrderBookItem {
  title: string;
  coverImage: string;
  quantity: number;
  loanNote: string;
  price?: number;
}

export type OrderPaymentStatus = 'Paid via PayOS' | 'Pending VietQR' | 'COD Settled';
export type OrderFulfillmentCycle = 'Borrowing' | 'Returned' | 'Pending' | 'Overdue';

export interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  dispatchType: string;
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
  statusChip: 'All' | 'Pending' | 'Borrowing' | 'Returned' | 'Overdue';
  paymentFilter: 'all' | 'payos' | 'vietqr' | 'cod';
  fromDate: string;
  toDate: string;
}

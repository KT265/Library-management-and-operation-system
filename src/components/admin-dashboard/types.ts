export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  itemSummary: string;
  amount: number;
  badgeLabel: string;
  badgeClasses: string;
  date: string;
  gateway: string;
  reference: string;
}

export interface StockAlertItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copiesLeft: number;
  coverImage: string;
  coverAlt: string;
  dotColor: string;
  alertText: string;
  alertClasses: string;
}

export interface DashboardMetricCard {
  id: string;
  title: string;
  value: string;
  unit?: string;
  changeText: string;
  changePositive: boolean;
  iconName: string;
  badgeBg: string;
  badgeText: string;
}

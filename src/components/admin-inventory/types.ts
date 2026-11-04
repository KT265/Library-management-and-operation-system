export interface InventoryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalUnits: number;
  availableUnits: number;
  price: number; // Price in VND
  coverImage: string;
  coverAlt: string;
  publisher?: string;
  publishYear?: number;
  formatVi?: string;
  description?: string;
}

export type StockFilterType = 'all' | 'healthy' | 'low' | 'out';
export type SortOptionType = 'default' | 'stock-desc' | 'stock-asc' | 'price-asc' | 'price-desc';

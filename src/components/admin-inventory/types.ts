export interface InventoryBook {
  id: string;
  title: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  category: string;
  categories?: string[];
  isbn: string;
  totalUnits: number;
  availableUnits: number;
  price: number; // Giá bán in VND
  originalPrice?: number; // Giá gốc in VND
  coverImage: string;
  coverAlt: string;
  additionalImages?: string[];
  publisher?: string;
  publishYear?: number;
  pages?: number;
  language?: string;
  dimensions?: {
    width?: number;
    length?: number;
    height?: number;
  } | string;
  formatVi?: string;
  description?: string;
}

export type StockFilterType = 'all' | 'healthy' | 'low' | 'out';
export type SortOptionType = 'default' | 'stock-desc' | 'stock-asc' | 'price-asc' | 'price-desc';

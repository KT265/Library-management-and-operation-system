import { create } from 'zustand';
import { Book, CartItem, User, UserRole, Order } from '../types';

interface StoreState {
  // Authentication State
  user: User | null;
  isAuthenticated: boolean;
  login: (userData?: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Shopping Cart State
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Cart Actions
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  toggleItemSelection: (cartItemId: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  seedDemoItems: (count: number) => void; // Helper to test max 10 items internal scroll

  // Computed Cart Helpers
  getTotalCount: () => number;
  getSelectedCount: () => number;
  getSubtotal: () => number;
  getSelectedSubtotal: () => number;
  hasMoreThanTenItems: () => boolean;

  // Global Search and Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeGenre: string;
  setActiveGenre: (genre: string) => void;

  // Global Toast Alert State
  toastMessage: string;
  isToastOpen: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;

  // Orders State
  orders: Order[];
  addOrder: (order: Order) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Minh Nguyen',
  email: 'minh.nguyen@example.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
};

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    bookId: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 38.99,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
    quantity: 1,
    selected: true,
    inStock: true,
  },
  {
    id: 'cart-2',
    bookId: 'book-2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    price: 16.80,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91',
    quantity: 1,
    selected: true,
    inStock: true,
  },
  {
    id: 'cart-3',
    bookId: 'book-3',
    title: 'Atomic Habits: Tiny Changes',
    author: 'James Clear',
    price: 21.00,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvQXFI2eOxiw-mX5BtGITzJqbrTJRfdtnITBPipyoBiaNzug3GmDkPW_SqqkMir_LUc2CXLuiGFtzMkyBZq9OHvRZxIPcG6w5fvU3GELlXnOE594wVUJ0yYMtr8-J1U-8hMhtqYmOSKmUJjeCETCp9Yul7Hbj_hUwO-UtdogSUQb6NJ6q9-ITwWwwwCr-EEySb8EgXEPQtAEEQos9_ydaRQrgt2j7tb3EHhO_Vj8C',
    quantity: 1,
    selected: true,
    inStock: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'BK-98421',
    userId: 'usr-1',
    userName: 'Minh Nguyen',
    userEmail: 'minh.nguyen@example.com',
    items: [
      {
        bookId: 'book-4',
        title: 'The Architecture of Silence',
        price: 34.0,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAdt59T1h03vA_Uv0JHXvzevXxjlgCUqcl81eSzNIjPMWYxGlSWPRNZsQOMeCsSVJyobDSsvSLuUVlNA3Ka8CfjBdg_u6JJYXvAd1CN_21mWyFEGcIHxoBmB2eW_Arj_njKxG5zYZYvFtTyYDmXhUbcotMU4zyjQwRtFMfQkSymbAFX-pLI1xhxpabtkRdssaZh7D6FMYdkze3aqvrqu-ulRMuKL4ptvZhMDAKyIZaY',
      },
    ],
    subtotal: 91.84,
    discount: 10.0,
    shippingFee: 0,
    totalAmount: 91.84,
    status: 'processing',
    paymentStatus: 'paid',
    voucherCode: 'BIBLIO10',
    createdAt: '2025-10-24T10:30:00Z',
    updatedAt: '2025-10-24T10:30:00Z',
  },
  {
    id: 'ord-101',
    orderNumber: 'BV-2026-101',
    userId: 'usr-1',
    userName: 'Minh Nguyen',
    userEmail: 'minh.nguyen@example.com',
    items: [
      {
        bookId: 'book-1',
        title: 'Designing Data-Intensive Applications',
        price: 38.99,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
      },
    ],
    subtotal: 38.99,
    discount: 0,
    shippingFee: 0,
    totalAmount: 38.99,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'BV-2026-102',
    userId: 'usr-1',
    userName: 'Minh Nguyen',
    userEmail: 'minh.nguyen@example.com',
    items: [
      {
        bookId: 'book-2',
        title: 'Klara and the Sun',
        price: 16.8,
        quantity: 1,
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91',
      },
    ],
    subtotal: 16.8,
    discount: 0,
    shippingFee: 0,
    totalAmount: 16.8,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-11-01T12:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z',
  },
];

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<StoreState>((set, get) => ({
  // Authentication
  user: DEFAULT_USER,
  isAuthenticated: true,
  login: (userData) => {
    set({
      user: {
        ...DEFAULT_USER,
        ...userData,
      },
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({
      user: {
        ...currentUser,
        role,
        name: role === 'admin' ? 'Curator Admin' : 'Minh Nguyen',
        email: role === 'admin' ? 'ops@bookverse.io' : 'minh.nguyen@example.com',
      },
    });
  },

  // Cart
  cartItems: INITIAL_CART_ITEMS,
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (book: Book, quantity = 1) => {
    const { cartItems } = get();
    const existingIndex = cartItems.findIndex((item) => item.bookId === book.id);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      set({ cartItems: updated, isCartOpen: true });
      get().showToast(`Added "${book.title}" to Bag`);
      return;
    }

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      quantity,
      selected: true,
      inStock: book.inStock,
    };

    set({ cartItems: [newItem, ...cartItems], isCartOpen: true });
    get().showToast(`Added "${book.title}" to Bag`);
  },

  removeFromCart: (cartItemId: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId: string, delta: number) => {
    set((state) => ({
      cartItems: state.cartItems
        .map((item) => {
          if (item.id !== cartItemId) return item;
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        })
        .filter((item): item is CartItem => item !== null),
    }));
  },

  toggleItemSelection: (cartItemId: string) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === cartItemId ? { ...item, selected: !item.selected } : item
      ),
    }));
  },

  selectAllItems: (selected: boolean) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) => ({ ...item, selected })),
    }));
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  seedDemoItems: (count: number) => {
    const demoItems: CartItem[] = Array.from({ length: count }, (_, i) => ({
      id: `cart-demo-${i + 1}`,
      bookId: `demo-book-${i + 1}`,
      title: `Curated Volume ${i + 1}: Modern Treatise`,
      author: `Author ${i + 1}`,
      price: +(19.99 + (i % 5) * 5.5).toFixed(2),
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
      quantity: 1,
      selected: true,
      inStock: true,
    }));
    set({ cartItems: demoItems, isCartOpen: true });
  },

  getTotalCount: () => {
    return get().cartItems.reduce((acc, item) => acc + item.quantity, 0);
  },

  getSelectedCount: () => {
    return get().cartItems.filter((item) => item.selected).reduce((acc, item) => acc + item.quantity, 0);
  },

  getSubtotal: () => {
    const total = get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Math.round(total * 100) / 100;
  },

  getSelectedSubtotal: () => {
    const total = get()
      .cartItems.filter((item) => item.selected)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Math.round(total * 100) / 100;
  },

  hasMoreThanTenItems: () => {
    return get().cartItems.length > 10;
  },

  // Global Search and Filter
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  activeGenre: 'All',
  setActiveGenre: (genre: string) => set({ activeGenre: genre }),

  // Global Toast Alert State
  toastMessage: '',
  isToastOpen: false,
  showToast: (message: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: message, isToastOpen: true });
    toastTimer = setTimeout(() => {
      set({ isToastOpen: false });
    }, 2600);
  },
  hideToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ isToastOpen: false });
  },

  // Orders
  orders: INITIAL_ORDERS,
  addOrder: (order: Order) => set((state) => ({ orders: [order, ...state.orders] })),
}));


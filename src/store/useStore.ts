import { create } from 'zustand';
import { Book, CartItem, User, UserRole, Order } from '../types';

interface StoreState {
  // Authentication State
  user: User | null;
  isAuthenticated: boolean;
  idToken: string | null;
  isAuthLoading: boolean;

  login: (userData?: Partial<User>, idToken?: string | null) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  setIdToken: (idToken: string | null) => void;
  setAuth: (user: User | null, idToken?: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  simulateLogin: (userData?: Partial<User>, idToken?: string | null) => void;

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
  setOrders: (orders: Order[]) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<StoreState>((set, get) => ({
  // Authentication: clean default null/unauthenticated state
  user: null,
  isAuthenticated: false,
  idToken: null,
  isAuthLoading: false,

  login: (userData, idToken = null) => {
    if (!userData) {
      set({ user: null, isAuthenticated: false, idToken: null });
      return;
    }
    const newUser: User = {
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name || 'Patron',
      email: userData.email || '',
      role: userData.role || 'customer',
      avatar: userData.avatar,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      district: userData.district,
      detailedAddress: userData.detailedAddress,
      ...userData,
    };
    set({ user: newUser, isAuthenticated: true, idToken: idToken || null });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, idToken: user ? get().idToken : null });
  },

  setIdToken: (idToken) => {
    set({ idToken });
  },

  setAuth: (user, idToken = null) => {
    set({ user, isAuthenticated: !!user, idToken: idToken || null });
  },

  setAuthLoading: (loading: boolean) => {
    set({ isAuthLoading: loading });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, idToken: null });
  },

  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({
      user: {
        ...currentUser,
        role,
        name: role === 'admin' ? 'Quản trị viên' : 'Minh Nguyen',
        email: role === 'admin' ? 'ops@bookverse.io' : 'minh.nguyen@example.com',
      },
    });
  },

  simulateLogin: (userData = {}, idToken = null) => {
    const role: UserRole = userData.role || 'customer';
    const defaultToken = role === 'admin' ? 'token-admin-user01' : 'token-user-user02';
    const defaultId = role === 'admin' ? 'user_01' : 'user_02';
    const defaultName = role === 'admin' ? 'Trần Quản Trị' : 'Lê Minh Hoàng';
    const defaultEmail = role === 'admin' ? 'admin.bookstore@gmail.com' : 'leminhhoang99@gmail.com';
    const defaultAvatar =
      role === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160';

    const simUser: User = {
      id: userData.id || defaultId,
      name: userData.name || defaultName,
      email: userData.email || defaultEmail,
      role,
      avatar: userData.avatar || defaultAvatar,
      phone: userData.phone || '0901234567',
      address: userData.address || 'Quận 1, TP. Hồ Chí Minh',
      city: userData.city || 'TP. Hồ Chí Minh',
      district: userData.district || 'Quận 1',
      _isSimulated: true,
      ...userData,
    };

    set({
      user: simUser,
      isAuthenticated: true,
      idToken: idToken || defaultToken,
      isAuthLoading: false,
    });
  },

  // Cart: clean empty array
  cartItems: [],
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
      get().showToast(`Đã thêm "${book.title}" vào giỏ hàng`);
      return;
    }

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    get().showToast(`Đã thêm "${book.title}" vào giỏ hàng`);
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
      title: `Tác phẩm tinh tuyển ${i + 1}: Chuyên khảo hiện đại`,
      author: `Tác giả ${i + 1}`,
      price: 150000 + (i % 5) * 50000,
      coverImage:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
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
    return get()
      .cartItems.filter((item) => item.selected)
      .reduce((acc, item) => acc + item.quantity, 0);
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

  // Orders: clean empty array
  orders: [],
  addOrder: (order: Order) => set((state) => ({ orders: [order, ...state.orders] })),
  setOrders: (orders: Order[]) => set({ orders }),
}));

// Global hooks for testing & headless environments (DEV only)
if (import.meta.env?.DEV && typeof window !== 'undefined') {
  (window as any).__BOOKVERSE_SIMULATE_LOGIN__ = (opts?: any) =>
    useStore.getState().simulateLogin(opts);
  (window as any).__BOOKVERSE_STORE__ = useStore;
}

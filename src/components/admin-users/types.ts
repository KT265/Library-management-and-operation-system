export type UserRole = 'admin' | 'user';

export type UserStatus = 'active' | 'locked';

export interface SystemPermission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'catalog' | 'orders' | 'marketing';
}

/**
 * Computes user avatar initials matching Stitch Screen 5e5cbd2c specification:
 * For multi-word Vietnamese names, uses first letter of first word + first letter of last word
 * (e.g., 'Nguyễn Văn Minh' -> 'NM', 'Lê Thu Thảo' -> 'LT', 'Trần Quang Huy' -> 'TH', 'Phạm Hoàng Nam' -> 'PN', 'Đặng Quốc Tuấn' -> 'ĐT').
 * For single-word names, uses first two letters (e.g. 'Admin' -> 'AD').
 * Fallback is 'ND' (Người Dùng).
 */
export const getInitials = (fullName: string): string => {
  const trimmed = (fullName || '').trim();
  if (!trimmed) return 'ND';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return words[0].slice(0, 2).toUpperCase();
};

/**
 * Normalizes Vietnamese string removing diacritics for robust search matching
 * (e.g., 'Lê Thu Thảo' -> 'le thu thao', 'Đặng' -> 'dang').
 * Collapses irregular whitespace for consistent multi-token searches.
 */
export const normalizeVietnamese = (str: string): string => {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
};

export interface AdminManagedUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  initials: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
  permissions: string[];
  totalSpend: number; // For VND formatting demonstration (e.g. 150.000 ₫)
  createdAt: string;
}

export interface UsersFilterOptions {
  search: string;
  role: 'all' | 'admin' | 'user';
  status: 'all' | 'active' | 'locked';
}

export const SYSTEM_PERMISSIONS: SystemPermission[] = [
  {
    id: 'perm_catalog',
    name: 'Quản trị kho sách & ấn phẩm',
    description: 'Thêm, sửa, cập nhật tồn kho và phân loại danh mục sách',
    category: 'catalog',
  },
  {
    id: 'perm_orders',
    name: 'Xử lý luân chuyển & đơn hàng',
    description: 'Duyệt đơn, đóng gói, bàn giao vận chuyển và xử lý hoàn trả',
    category: 'orders',
  },
  {
    id: 'perm_vouchers',
    name: 'Phát hành & quản lý mã ưu đãi',
    description: 'Tạo mã voucher, thiết lập ngân sách và tỷ lệ chiết khấu',
    category: 'marketing',
  },
  {
    id: 'perm_users',
    name: 'Phân quyền & chỉ định vai trò',
    description: 'Cấp quyền quản trị viên, phân chia tác vụ và khóa tài khoản',
    category: 'system',
  },
  {
    id: 'perm_audit',
    name: 'Truy xuất báo cáo & nhật ký bảo mật',
    description: 'Theo dõi log truy cập, lịch sử thay đổi quyền và giao dịch',
    category: 'system',
  },
  {
    id: 'perm_shop',
    name: 'Quyền thành viên & mua sắm',
    description: 'Mua sách trực tuyến, thanh toán PayOS/VietQR và viết đánh giá',
    category: 'marketing',
  },
];

export const DEFAULT_ADMIN_PERMISSIONS: string[] = [
  'perm_catalog',
  'perm_orders',
  'perm_vouchers',
  'perm_users',
  'perm_audit',
  'perm_shop',
];

export const DEFAULT_USER_PERMISSIONS: string[] = [
  'perm_shop',
];

export const INITIAL_MANAGED_USERS: AdminManagedUser[] = [
  {
    id: 'usr-adm-001',
    uid: 'BV-ADM-001',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@bookverse.io',
    phone: '0912 849 201',
    role: 'admin',
    status: 'active',
    initials: 'NM',
    avatarBgColor: 'bg-primary-container',
    avatarTextColor: 'text-on-primary-container',
    permissions: [...DEFAULT_ADMIN_PERMISSIONS],
    totalSpend: 15200000,
    createdAt: '12/01/2026',
  },
  {
    id: 'usr-adm-002',
    uid: 'BV-ADM-002',
    name: 'Lê Thu Thảo',
    email: 'thao.le@bookverse.io',
    phone: '0983 456 789',
    role: 'admin',
    status: 'active',
    initials: 'LT',
    avatarBgColor: 'bg-primary',
    avatarTextColor: 'text-on-primary',
    permissions: [...DEFAULT_ADMIN_PERMISSIONS],
    totalSpend: 9850000,
    createdAt: '18/02/2026',
  },
  {
    id: 'usr-ord-1892',
    uid: 'BV-USR-1892',
    name: 'Trần Quang Huy',
    email: 'quanghuy.t@gmail.com',
    phone: '0905 112 233',
    role: 'user',
    status: 'active',
    initials: 'TH',
    avatarBgColor: 'bg-surface-container-high',
    avatarTextColor: 'text-secondary',
    permissions: [...DEFAULT_USER_PERMISSIONS],
    totalSpend: 150000, // Showcase 150.000 ₫
    createdAt: '03/05/2026',
  },
  {
    id: 'usr-ord-2204',
    uid: 'BV-USR-2204',
    name: 'Phạm Hoàng Nam',
    email: 'nam.phamhoang@outlook.com',
    phone: '0938 776 554',
    role: 'user',
    status: 'active',
    initials: 'PN',
    avatarBgColor: 'bg-surface-container-high',
    avatarTextColor: 'text-secondary',
    permissions: [...DEFAULT_USER_PERMISSIONS],
    totalSpend: 620000,
    createdAt: '14/06/2026',
  },
  {
    id: 'usr-ord-0941',
    uid: 'BV-USR-0941',
    name: 'Vũ Thị Mai',
    email: 'mai.vuthi@yahoo.com',
    phone: '0977 889 900',
    role: 'user',
    status: 'locked',
    initials: 'VM',
    avatarBgColor: 'bg-surface-container-high',
    avatarTextColor: 'text-secondary',
    permissions: [],
    totalSpend: 450000,
    createdAt: '22/07/2026',
  },
  {
    id: 'usr-ord-2510',
    uid: 'BV-USR-2510',
    name: 'Đặng Quốc Tuấn',
    email: 'tuan.dang@techcorp.vn',
    phone: '0942 331 122',
    role: 'user',
    status: 'active',
    initials: 'ĐT',
    avatarBgColor: 'bg-surface-container-high',
    avatarTextColor: 'text-secondary',
    permissions: [...DEFAULT_USER_PERMISSIONS],
    totalSpend: 890000,
    createdAt: '09/08/2026',
  },
  {
    id: 'usr-adm-005',
    uid: 'BV-ADM-005',
    name: 'Hoàng Bích Ngọc',
    email: 'ngoc.hoang@bookverse.io',
    phone: '0968 554 433',
    role: 'admin',
    status: 'active',
    initials: 'HN',
    avatarBgColor: 'bg-primary-container',
    avatarTextColor: 'text-on-primary-container',
    permissions: [...DEFAULT_ADMIN_PERMISSIONS],
    totalSpend: 11400000,
    createdAt: '29/09/2026',
  },
];

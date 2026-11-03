import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
  dataPath: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard Overview',
    path: '/admin',
    icon: 'dashboard',
    exact: true,
    dataPath: 'admin-dashboard-overview',
  },
  {
    label: 'Book Inventory',
    path: '/admin/inventory',
    icon: 'inventory_2',
    dataPath: 'admin-book-inventory',
  },
  {
    label: 'Order Fulfillment',
    path: '/admin/orders',
    icon: 'local_shipping',
    dataPath: 'admin-order-fulfillment',
  },
  {
    label: 'Voucher Management',
    path: '/admin/vouchers',
    icon: 'local_offer',
    dataPath: 'admin-voucher-management',
  },
];

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, switchRole } = useStore();

  const handleSwitchToStorefront = () => {
    switchRole('customer');
    navigate('/');
  };

  const handleSwitchToAdmin = () => {
    switchRole('admin');
    navigate('/admin');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none"
      aria-label="Admin Navigation Sidebar"
    >
      <div className="space-y-space-lg">
        {/* Brand Lockup */}
        <div className="px-space-lg flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-space-sm text-primary group"
            data-path="admin-dashboard-overview"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div>
              <span className="font-title-lg text-title-lg font-bold text-primary block leading-tight">
                BookVerse
              </span>
              <span className="font-label-sm text-label-sm text-secondary block">
                Management Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Mode Switcher: Storefront <-> Admin */}
        <div className="px-space-md">
          <div className="p-1.5 rounded-full bg-surface-container flex items-center gap-1">
            <button
              type="button"
              onClick={handleSwitchToStorefront}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all cursor-pointer"
              data-path="storefront-home"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Storefront</span>
            </button>
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-all cursor-pointer"
              data-path="admin-dashboard-overview"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Navigation Section Heading */}
        <div className="px-space-lg">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline">
            Core Management
          </span>
        </div>

        {/* Navigation Menu */}
        <nav
          className="px-space-md space-y-1.5"
          data-active-classes="bg-secondary-container text-on-secondary-container font-semibold shadow-sm"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                data-path={item.dataPath}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-space-sm px-space-md py-3 rounded-full font-label-lg text-label-lg transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Curator Admin Profile Card */}
      <div className="px-space-md space-y-space-md">
        <div className="flex items-center gap-space-sm px-space-sm pt-space-xs border-t border-surface-container-highest/60">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="truncate min-w-0">
            <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
              {user?.name || 'Curator Admin'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {user?.email || 'ops@bookverse.io'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

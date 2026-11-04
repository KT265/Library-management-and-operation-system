import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ProfileDropdown } from './ProfileDropdown';

export const StorefrontHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    getTotalCount,
    openCart,
  } = useStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRootRef = useRef<HTMLDivElement>(null);
  const totalCount = getTotalCount();

  // Handle clicking outside profile dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRootRef.current && !profileRootRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/catalog');
    }
  };

  return (
    <header
      id="sf-header-root"
      data-testid="sf-header-root"
      className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="h-20 w-full px-gutter-lg flex items-center justify-between gap-space-md max-w-7xl mx-auto">
        {/* Left: Brand Lockup & Nav Links */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Link
            to="/"
            id="sf-header-brand-link"
            data-testid="sf-header-brand-link"
            className="flex items-center gap-space-sm text-primary group"
            data-path="home"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">
              BookVerse
            </span>
          </Link>

          <nav
            id="sf-header-nav"
            data-testid="sf-header-nav"
            className="hidden lg:flex items-center gap-space-xs p-1 rounded-full bg-surface-container-low"
            data-active-classes="bg-secondary-container text-on-secondary-container font-semibold"
          >
            <NavLink
              to="/"
              id="sf-header-nav-link-home"
              data-testid="sf-header-nav-link-home"
              className={({ isActive }) =>
                `px-space-md py-space-xs rounded-full transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
              data-path="home"
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/catalog"
              id="sf-header-nav-link-catalog"
              data-testid="sf-header-nav-link-catalog"
              className={({ isActive }) =>
                `px-space-md py-space-xs rounded-full transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
              data-path="catalog"
            >
              Danh mục sách
            </NavLink>
          </nav>
        </div>

        {/* Center: Global Search Input */}
        <div
          id="sf-header-search-container"
          data-testid="sf-header-search-container"
          className="hidden md:flex flex-1 max-w-xl items-center"
        >
          <div className="relative w-full flex items-center bg-surface-container-lowest rounded-full px-space-md py-space-xs shadow-[0_1px_3px_0px_rgba(26,54,93,0.04)] border border-surface-container-high focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="material-symbols-outlined text-outline mr-space-sm text-[20px]">
              search
            </span>
            <input
              id="sf-header-search-input"
              data-testid="sf-header-search-input"
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
              placeholder="Tìm kiếm tựa sách, tác giả, ISBN..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        {/* Right: Mode Switcher & Reading Bag & User Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Mode Switcher Pill */}
          <div
            id="sf-header-mode-switcher"
            data-testid="sf-header-mode-switcher"
            className="flex items-center p-1 rounded-full bg-surface-container-high"
          >
            <Link
              to="/"
              id="sf-header-mode-btn-storefront"
              data-testid="sf-header-mode-btn-storefront"
              className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-all"
              data-path="home"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span className="hidden sm:inline">Cửa hàng</span>
            </Link>
            <Link
              to="/admin"
              id="sf-header-mode-btn-admin"
              data-testid="sf-header-mode-btn-admin"
              className="flex items-center gap-1.5 px-space-sm py-1 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all"
              data-path="dashboard-overview"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span className="hidden sm:inline">Quản trị</span>
            </Link>
          </div>

          {/* Quick Header Cart Trigger */}
          <button
            id="sf-header-cart-btn"
            data-testid="sf-header-cart-btn"
            onClick={openCart}
            aria-label="Mở giỏ hàng"
            className="relative w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {totalCount > 0 && (
              <span
                id="sf-header-cart-badge"
                data-testid="sf-header-cart-badge"
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] font-bold flex items-center justify-center shadow-sm"
              >
                {totalCount}
              </span>
            )}
          </button>

          {/* Patron Profile Menu */}
          <div
            className="relative"
            id="profileDropdownRoot"
            data-testid="sf-header-profile-root"
            ref={profileRootRef}
          >
            <button
              aria-expanded={isProfileOpen}
              aria-label="Tài khoản cá nhân"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-95 transition-all focus:outline-none cursor-pointer ring-2 ring-secondary-container"
              id="profileMenuBtn"
              data-testid="sf-header-profile-btn"
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StorefrontHeader;

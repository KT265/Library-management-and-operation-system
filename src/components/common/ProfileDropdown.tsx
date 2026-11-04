import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useStore();

  const handleSignOut = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <div
      id="profileDropdownMenu"
      data-testid="sf-profile-dropdown-menu"
      className={`origin-top-right absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-xl py-2 z-50 transform transition-all duration-200 ease-out ${
        isOpen
          ? 'opacity-100 scale-100 pointer-events-auto block'
          : 'opacity-0 scale-95 pointer-events-none hidden'
      }`}
    >
      {/* User Header */}
      <div
        id="profileDropdownUserHeader"
        data-testid="sf-profile-dropdown-user-header"
        className="px-space-md py-2 border-b border-surface-container-high"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-label-sm shrink-0">
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-title-sm text-title-sm text-primary font-bold truncate leading-tight">
              {user?.name || 'Minh Nguyen'}
            </p>
            <p className="font-body-sm text-body-sm text-secondary truncate">
              {user?.email || 'minh.nguyen@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Links */}
      <div className="py-1">
        <Link
          to="/profile"
          id="profileDropdownLinkProfile"
          data-testid="sf-profile-dropdown-link-profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-space-md py-2 font-label-md text-label-md text-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
          data-path="customer-profile-orders"
        >
          <span className="material-symbols-outlined text-[18px] text-tertiary-container">
            manage_accounts
          </span>
          <span>Thông tin cá nhân</span>
        </Link>
        <Link
          to="/profile"
          id="profileDropdownLinkOrders"
          data-testid="sf-profile-dropdown-link-orders"
          onClick={onClose}
          className="flex items-center gap-2.5 px-space-md py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          data-path="customer-profile-orders"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Lịch sử đơn hàng</span>
        </Link>
      </div>

      {/* Sign Out / Sign In Action */}
      <div className="pt-1 border-t border-surface-container-high">
        {isAuthenticated ? (
          <button
            id="profileDropdownBtnSignOut"
            data-testid="sf-profile-dropdown-btn-signout"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-space-md py-2 font-label-md text-label-md text-error hover:bg-error-container/40 transition-colors text-left cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Đăng xuất</span>
          </button>
        ) : (
          <Link
            to="/login"
            id="profileDropdownLinkSignIn"
            data-testid="sf-profile-dropdown-link-signin"
            onClick={onClose}
            className="flex items-center gap-2.5 px-space-md py-2 font-label-md text-label-md text-primary hover:bg-secondary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Đăng nhập / Đăng ký</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { auth, logoutFirebaseUser } from '../../services/firebase';
import { signOut } from 'firebase/auth';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useStore();
  const [avatarError, setAvatarError] = useState(false);

  // Reset avatar error when user avatar changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  const handleSignOut = async () => {
    try {
      await logoutFirebaseUser();
    } catch (error) {
      console.error('[ProfileDropdown] Sign-out error:', error);
      try {
        await signOut(auth);
      } catch (innerError) {
        console.error('[ProfileDropdown] Direct signOut fallback error:', innerError);
      }
    } finally {
      logout();
      onClose();
      navigate('/login');
    }
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
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-label-sm shrink-0 overflow-hidden ring-1 ring-secondary-container">
            {isAuthenticated && user?.avatar && !avatarError ? (
              <img
                id="profileDropdownUserAvatar"
                data-testid="sf-profile-dropdown-user-avatar"
                src={user.avatar}
                alt={user?.name || 'User Avatar'}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="material-symbols-outlined text-[16px]">person</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-title-sm text-title-sm text-primary font-bold truncate leading-tight">
              {user?.name || (isAuthenticated ? 'Bạn đọc' : 'Khách')}
            </p>
            <p className="font-body-sm text-body-sm text-secondary truncate">
              {user?.email || (isAuthenticated ? '' : 'Chưa đăng nhập')}
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
          <span className="sr-only">Edit Profile</span>
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
          <span className="sr-only">Order History</span>
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
            <span className="sr-only">Sign Out</span>
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

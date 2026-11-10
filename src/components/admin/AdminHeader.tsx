import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <header
      id="admin-header-root"
      data-testid="admin-header-root"
      className="fixed top-0 left-72 right-0 h-20 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-lg"
    >
      {/* Quick Search */}
      <div
        id="admin-header-search-container"
        data-testid="admin-header-search-container"
        className="flex items-center gap-space-md flex-1 max-w-lg"
      >
        <div className="relative w-full max-w-md flex items-center bg-surface-container-lowest rounded-full px-space-md py-2 shadow-sm border border-surface-container-highest/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="admin-header-search-input"
            data-testid="admin-header-search-input"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm mã ưu đãi, ISBN, mã đơn hàng..."
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
          />
          {searchValue && (
            <button
              id="admin-header-btn-clear-search"
              data-testid="admin-header-btn-clear-search"
              type="button"
              onClick={handleClear}
              className="text-outline hover:text-on-surface p-1 rounded-full transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Icons & Admin Profile Indicator */}
      <div className="flex items-center gap-space-md">
        {/* Notifications Icon with Indicator */}
        <button
          id="admin-header-btn-notifications"
          data-testid="admin-header-btn-notifications"
          type="button"
          className="relative w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
          title="Thông báo"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-tertiary"></span>
        </button>

        {/* View Storefront Quick Button */}
        <button
          id="admin-header-btn-storefront"
          data-testid="admin-header-btn-storefront"
          type="button"
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
          title="Xem giao diện độc giả"
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
        </button>

        {/* Curator Admin Avatar Badge */}
        <div
          id="admin-header-avatar-badge"
          data-testid="admin-header-avatar-badge"
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm"
          title="Đã đăng nhập: Quản trị viên"
        >
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

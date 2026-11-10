import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const systemLogo = new URL('../../Public/Logo.png', import.meta.url).href;

export const StorefrontFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      id="sf-footer-root"
      data-testid="sf-footer-root"
      className="w-full bg-surface-container-low mt-space-xxl"
    >
      {/* 4-Column Main Grid */}
      <div className="w-full px-gutter-lg py-space-xxl grid grid-cols-1 md:grid-cols-4 gap-space-xl max-w-7xl mx-auto">
        {/* Col 1: Brand & Description */}
        <div
          id="sf-footer-col-brand"
          data-testid="sf-footer-col-brand"
          className="space-y-space-sm md:col-span-1"
        >
          <div className="flex items-center gap-space-sm text-primary">
            <div
              className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm overflow-hidden"
              data-icon="menu_book"
            >
              <img
                src={systemLogo}
                alt="BookVerse Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-title-lg text-title-lg font-bold">BookVerse</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Không gian nhà sách số tinh hoa và quản lý ấn phẩm dành cho độc giả và nhà xuất bản độc lập.
          </p>
          <div className="flex items-center gap-space-sm pt-space-xs">
            <span
              id="sf-footer-chip-vietqr"
              data-testid="sf-footer-chip-vietqr"
              className="inline-flex items-center px-space-sm py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant shadow-xs"
            >
              <span className="material-symbols-outlined text-[14px] mr-1">qr_code_2</span>
              Hỗ trợ thanh toán VietQR
            </span>
          </div>
        </div>

        {/* Col 2: Discover */}
        <div
          id="sf-footer-col-discover"
          data-testid="sf-footer-col-discover"
          className="space-y-space-sm"
        >
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Khám phá
          </h3>
          <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Văn học tinh hoa
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Thiết kế &amp; Nghệ thuật
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Tuyển tập nổi bật
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Tác phẩm đạt giải
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Reader Services */}
        <div
          id="sf-footer-col-services"
          data-testid="sf-footer-col-services"
          className="space-y-space-sm"
        >
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Dịch vụ độc giả
          </h3>
          <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link to="/checkout" className="hover:text-on-surface transition-colors">
                Giỏ hàng &amp; Thanh toán
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-on-surface transition-colors">
                Lịch sử &amp; Theo dõi đơn
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-on-surface transition-colors">
                Đặc quyền thành viên
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-on-surface transition-colors">
                Hệ thống thư quán
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Operations */}
        <div
          id="sf-footer-col-operations"
          data-testid="sf-footer-col-operations"
          className="space-y-space-sm"
        >
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Vận hành hệ thống
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Quản trị danh mục, kiểm soát giao dịch và bổ sung kho ấn phẩm nhanh chóng.
          </p>
          <button
            id="sf-footer-btn-admin"
            data-testid="sf-footer-btn-admin"
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer shadow-sm"
            data-path="dashboard-overview"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
            Vào cổng quản trị
          </button>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div
        id="sf-footer-subfooter"
        data-testid="sf-footer-subfooter"
        className="w-full px-gutter-lg py-space-md bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-md text-label-md text-on-surface-variant max-w-7xl mx-auto"
      >
        <span>© 2025 BookVerse. Bản quyền đã được bảo hộ.</span>
        <div className="flex items-center gap-space-lg">
          <Link
            to="#"
            id="sf-footer-link-privacy"
            data-testid="sf-footer-link-privacy"
            className="hover:text-on-surface transition-colors"
          >
            Chính sách bảo mật
          </Link>
          <Link
            to="#"
            id="sf-footer-link-terms"
            data-testid="sf-footer-link-terms"
            className="hover:text-on-surface transition-colors"
          >
            Điều khoản dịch vụ
          </Link>
          <Link
            to="#"
            id="sf-footer-link-vietqr"
            data-testid="sf-footer-link-vietqr"
            className="hover:text-on-surface transition-colors"
          >
            Quy định thanh toán VietQR
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;

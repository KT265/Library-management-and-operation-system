import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const StorefrontFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-surface-container-low mt-space-xxl">
      {/* 4-Column Main Grid */}
      <div className="w-full px-gutter-lg py-space-xxl grid grid-cols-1 md:grid-cols-4 gap-space-xl max-w-7xl mx-auto">
        {/* Col 1: Brand & Description */}
        <div className="space-y-space-sm md:col-span-1">
          <div className="flex items-center gap-space-sm text-primary">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <span className="font-title-lg text-title-lg font-bold">BookVerse</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A refined digital bookstore &amp; inventory sanctuary for avid readers and independent publishers.
          </p>
          <div className="flex items-center gap-space-sm pt-space-xs">
            <span className="inline-flex items-center px-space-sm py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant shadow-xs">
              <span className="material-symbols-outlined text-[14px] mr-1">qr_code_2</span>
              VietQR Enabled
            </span>
          </div>
        </div>

        {/* Col 2: Discover */}
        <div className="space-y-space-sm">
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Discover
          </h3>
          <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Literary Fiction
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Design &amp; Arts
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Editor's Choice
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Award Winners
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Reader Services */}
        <div className="space-y-space-sm">
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Reader Services
          </h3>
          <ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link to="/checkout" className="hover:text-on-surface transition-colors">
                Shopping Bag &amp; Checkout
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-on-surface transition-colors">
                Order History &amp; Tracking
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-on-surface transition-colors">
                Membership Rewards
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-on-surface transition-colors">
                Store Locator
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Operations */}
        <div className="space-y-space-sm">
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider">
            Operations
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage catalog, monitor transactions, and restock rare editions seamlessly.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors cursor-pointer shadow-sm"
            data-path="dashboard-overview"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
            Open Management Portal
          </button>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="w-full px-gutter-lg py-space-md bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-md text-label-md text-on-surface-variant max-w-7xl mx-auto">
        <span>© 2025 BookVerse Publishing &amp; Booksellers Inc. All rights reserved.</span>
        <div className="flex items-center gap-space-lg">
          <Link to="#" className="hover:text-on-surface transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-on-surface transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-on-surface transition-colors">
            VietQR Merchant Agreement
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;

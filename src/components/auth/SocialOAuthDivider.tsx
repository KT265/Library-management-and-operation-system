import React from 'react';
import { Link } from 'react-router-dom';

export interface SocialOAuthDividerProps {
  onGoogleAuth: () => void;
  dividerText?: string;
  googleButtonText?: string;
}

export const SocialOAuthDivider: React.FC<SocialOAuthDividerProps> = ({
  onGoogleAuth,
  dividerText = 'hoặc tiếp tục với',
  googleButtonText = 'Tiếp tục với Google',
}) => {
  return (
    <div
      id="auth-social-oauth-section"
      data-testid="auth-social-oauth"
      className="flex flex-col mt-space-md"
    >
      {/* Divider */}
      <div className="relative my-space-md flex items-center justify-center">
        <div className="w-full h-[1px] bg-surface-container-high" />
        <span className="absolute px-3 bg-surface-container-lowest font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {dividerText}
        </span>
      </div>

      {/* Google OAuth Provider Button */}
      <button
        id="googleAuthBtn"
        data-testid="auth-social-oauth-btn-google"
        type="button"
        onClick={onGoogleAuth}
        className="w-full h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full font-label-lg text-label-lg flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            fill="#EA4335"
          />
        </svg>
        <span>{googleButtonText}</span>
      </button>

      {/* Guest Exploration Prompt */}
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-space-md">
        Bạn muốn tham quan danh mục sách?{' '}
        <Link
          to="/"
          data-path="storefront-home"
          data-testid="auth-social-oauth-link-guest"
          className="text-primary font-semibold hover:underline"
        >
          Khám phá với tư cách Khách
        </Link>
      </p>
    </div>
  );
};

export default SocialOAuthDivider;

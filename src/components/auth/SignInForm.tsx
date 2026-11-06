import React from 'react';

export interface SignInFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: (e: React.MouseEvent) => void;
  isVisible: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  onSubmit,
  onForgotPassword,
  isVisible,
}) => {
  return (
    <div
      id="view-signin"
      data-testid="auth-signin-form-view"
      className={`flex flex-col transition-opacity duration-200 ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <form
        id="signin-form"
        data-testid="auth-signin-form"
        className="flex flex-col space-y-space-md"
        onSubmit={onSubmit}
      >
        {/* Email Input */}
        <div className="flex flex-col space-y-1.5">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="signin-email"
          >
            Địa chỉ Email
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              mail
            </span>
            <input
              id="signin-email"
              data-testid="auth-signin-form-input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="docgia@bookverse.vn"
              className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col space-y-1.5">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="signin-password"
          >
            Mật khẩu
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              lock
            </span>
            <input
              id="signin-password"
              data-testid="auth-signin-form-input-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-12 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              data-testid="auth-signin-form-btn-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              id="rememberMeCheckbox"
              data-testid="auth-signin-form-checkbox-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-primary bg-surface-container-low accent-primary focus:ring-0 cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <a
            id="forgotPasswordLink"
            data-testid="auth-signin-form-link-forgot"
            href="#forgot-password"
            onClick={onForgotPassword}
            className="font-label-md text-label-md text-on-tertiary-container hover:text-tertiary font-semibold transition-colors cursor-pointer"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button */}
        <button
          id="authSubmitBtn"
          data-testid="auth-signin-form-btn-submit"
          type="submit"
          className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>Đăng nhập vào BookVerse</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>
    </div>
  );
};

export default SignInForm;

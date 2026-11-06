import React from 'react';

export interface RegisterFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isVisible: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  agreeTerms,
  setAgreeTerms,
  onSubmit,
  isVisible,
}) => {
  return (
    <div
      id="view-register"
      data-testid="auth-register-form-view"
      className={`flex flex-col transition-opacity duration-200 ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <form
        id="register-form"
        data-testid="auth-register-form"
        className="flex flex-col space-y-space-sm"
        onSubmit={onSubmit}
      >
        {/* Full Name */}
        <div className="flex flex-col space-y-1">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="reg-name"
          >
            Họ và tên độc giả
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              person
            </span>
            <input
              id="reg-name"
              data-testid="auth-register-form-input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn An"
              className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="reg-email"
          >
            Địa chỉ Email
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              mail
            </span>
            <input
              id="reg-email"
              data-testid="auth-register-form-input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="an.nguyen@example.com"
              className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-1">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="reg-password"
          >
            Mật khẩu mới
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              lock
            </span>
            <input
              id="reg-password"
              data-testid="auth-register-form-input-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              className="w-full h-11 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              data-testid="auth-register-form-btn-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col space-y-1">
          <label
            className="font-label-md text-label-md text-on-surface-variant font-semibold"
            htmlFor="reg-confirm-password"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
              lock_reset
            </span>
            <input
              id="reg-confirm-password"
              data-testid="auth-register-form-input-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full h-11 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              data-testid="auth-register-form-btn-toggle-confirm-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              id="agreeTermsCheckbox"
              data-testid="auth-register-form-checkbox-terms"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-primary bg-surface-container-low accent-primary focus:ring-0 cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
              Tôi đồng ý với{' '}
              <a
                className="text-primary font-semibold hover:underline"
                href="#terms"
                onClick={(e) => e.preventDefault()}
              >
                Điều khoản dịch vụ
              </a>
              ,{' '}
              <a
                className="text-primary font-semibold hover:underline"
                href="#privacy"
                onClick={(e) => e.preventDefault()}
              >
                Chính sách bảo mật
              </a>{' '}
              và Quy chuẩn độc giả BookVerse.
            </span>
          </label>
        </div>

        {/* Submit Registration */}
        <div className="pt-2">
          <button
            id="regSubmitBtn"
            data-testid="auth-register-form-btn-submit"
            type="submit"
            className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Hoàn tất đăng ký tài khoản</span>
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

import React from 'react';

export interface AuthSegmentedToggleProps {
  mode: 'signin' | 'register';
  onModeChange: (mode: 'signin' | 'register') => void;
}

export const AuthSegmentedToggle: React.FC<AuthSegmentedToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div
      id="auth-segmented-toggle"
      data-testid="auth-segmented-toggle"
      className="relative flex p-1 bg-surface-container-low rounded-full mb-space-lg select-none"
    >
      <div
        id="tab-slider"
        data-testid="auth-segmented-toggle-slider"
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none ${
          mode === 'signin' ? 'translate-x-0' : 'translate-x-full'
        }`}
      />
      <button
        id="tab-btn-signin"
        data-testid="auth-segmented-toggle-btn-signin"
        type="button"
        onClick={() => onModeChange('signin')}
        className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors cursor-pointer ${
          mode === 'signin'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant font-medium hover:text-on-surface'
        }`}
      >
        Đăng nhập
      </button>
      <button
        id="tab-btn-register"
        data-testid="auth-segmented-toggle-btn-register"
        type="button"
        onClick={() => onModeChange('register')}
        className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors cursor-pointer ${
          mode === 'register'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant font-medium hover:text-on-surface'
        }`}
      >
        Đăng ký
      </button>
    </div>
  );
};

export default AuthSegmentedToggle;

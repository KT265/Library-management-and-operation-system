import React from 'react';

interface UsersToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const UsersToast: React.FC<UsersToastProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      id="toastNotification"
      data-testid="admin-users-toast"
      className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-space-md py-3 rounded-full shadow-lg flex items-center gap-2.5 font-label-md text-label-md transition-all toast-slide-enter cursor-pointer"
      onClick={onClose}
      role="alert"
    >
      <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
        check_circle
      </span>
      <span id="toastMessage" data-testid="admin-users-toast-message">
        {message}
      </span>
      <button
        type="button"
        id="btn-close-toast"
        data-testid="admin-users-btn-close-toast"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="ml-1 text-on-primary/70 hover:text-on-primary cursor-pointer"
        title="Đóng thông báo"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

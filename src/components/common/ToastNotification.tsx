import React from 'react';
import { useStore } from '../../store/useStore';

export const ToastNotification: React.FC = () => {
  const { toastMessage, isToastOpen } = useStore();

  return (
    <div
      id="toastNotification"
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
        isToastOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 px-space-lg py-3 rounded-full bg-primary text-on-primary shadow-xl font-label-lg text-label-lg">
        <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
          shopping_bag
        </span>
        <span id="toastMessage">{toastMessage}</span>
      </div>
    </div>
  );
};

export default ToastNotification;

import React from 'react';

export interface CheckoutStepperProps {
  currentStep?: 1 | 2 | 3;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep = 3 }) => {
  const steps = [
    {
      num: 1,
      title: '1. Giỏ hàng & Tuyển chọn',
      sub: '1. Giỏ hàng / Cart Items',
      icon: 'shopping_bag',
    },
    {
      num: 2,
      title: '2. Địa chỉ & Vận chuyển',
      sub: '2. Địa chỉ giao nhận / Destination',
      icon: 'local_shipping',
    },
    {
      num: 3,
      title: '3. Thanh toán & Xác nhận',
      sub: '3. Thanh toán / Settlement',
      icon: 'verified_user',
    },
  ];

  return (
    <div
      id="checkout-stepper"
      data-testid="cart-checkout-stepper"
      className="w-full bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-outline-variant/30 mb-space-lg"
    >
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;

          return (
            <React.Fragment key={step.num}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                />
              )}
              <div
                data-testid={'cart-checkout-stepper-step-' + step.num}
                className="flex items-center gap-space-xs sm:gap-space-sm select-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold transition-all ${
                    isCompleted
                      ? 'bg-primary text-on-primary'
                      : isActive
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : (
                    step.num
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label-md text-label-md ${
                      isActive || isCompleted
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">Bước {step.num}</span>
                  </span>
                  <span className="sr-only">{step.sub}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;

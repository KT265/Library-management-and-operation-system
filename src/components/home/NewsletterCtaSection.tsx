import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

export const NewsletterCtaSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsSubscribed(true);
    showToast('Cảm ơn bạn đã đăng ký nhận bản tin văn hóa đọc của BookVerse!');
  };

  return (
    <section
      id="home-newsletter-cta"
      data-testid="home-newsletter-section"
      className="w-full px-gutter-lg py-space-xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-container p-space-lg lg:p-space-xxl text-on-primary shadow-lg">
        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-on-primary/10 flex items-center justify-center mb-space-sm text-tertiary-fixed">
            <span className="material-symbols-outlined text-[26px]">mark_email_read</span>
          </div>

          <h2
            data-testid="home-newsletter-heading"
            className="font-headline-md text-headline-md font-bold tracking-tight mb-space-xs text-on-primary"
          >
            Đăng ký nhận bản tin BookVerse
          </h2>

          <p
            data-testid="home-newsletter-desc"
            className="font-body-md text-body-md text-on-primary/80 mb-space-lg max-w-xl"
          >
            Nhận thông báo sớm nhất về các ấn bản giới hạn, mã giảm giá độc quyền và các bài tiểu luận phê bình từ ban biên tập.
          </p>

          {isSubscribed ? (
            <div
              data-testid="home-newsletter-success-box"
              className="inline-flex items-center gap-2 px-space-lg py-3 rounded-full bg-on-primary/15 text-on-primary font-label-lg"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Đã đăng ký thành công! Cảm ơn độc giả.</span>
            </div>
          ) : (
            <form
              id="newsletterForm"
              data-testid="home-newsletter-form"
              onSubmit={handleSubscribe}
              className="w-full max-w-md flex flex-col sm:flex-row gap-space-xs"
            >
              <input
                id="newsletterEmailInput"
                data-testid="home-newsletter-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn..."
                className="flex-1 px-space-md py-3 rounded-full bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-tertiary shadow-sm"
              />
              <button
                id="newsletterSubmitBtn"
                data-testid="home-newsletter-btn-subscribe"
                type="submit"
                className="px-space-lg py-3 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold shadow-md hover:bg-tertiary-container transition-all cursor-pointer whitespace-nowrap"
              >
                Đăng ký nhận tin
              </button>
            </form>
          )}

          <span className="font-label-sm text-label-sm text-on-primary/60 mt-space-sm">
            Không spam. Bạn có thể hủy đăng ký bất kỳ lúc nào chỉ với một cú nhấp chuột.
          </span>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EditorialShowcaseBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="catalog-editorial-showcase"
      data-testid="catalog-editorial-showcase-section"
      className="mt-space-xl p-space-lg lg:p-space-xl rounded-3xl bg-surface-container-high relative overflow-hidden shadow-sm"
    >
      <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
        <div className="max-w-xl">
          <span
            data-testid="catalog-editorial-badge"
            className="inline-block px-3 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold mb-space-xs"
          >
            Tuyển chọn từ Ban biên tập
          </span>
          <h3
            data-testid="catalog-editorial-heading"
            className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight"
          >
            Bộ Sưu Tập Ấn Bản Giới Hạn &amp; Sách Chuyên Khảo
          </h3>
          <p
            data-testid="catalog-editorial-desc"
            className="font-body-md text-body-md text-secondary mt-1"
          >
            Những cuốn sách đóng gáy chỉ thủ công, bìa vải dập nhũ vàng và ấn bản tái bản đặc biệt dành cho các học giả và độc giả đam mê lưu trữ.
          </p>
        </div>

        <button
          type="button"
          data-testid="catalog-editorial-btn-explore"
          onClick={() => navigate('/book/book-1')}
          className="shrink-0 px-space-lg py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow hover:bg-primary-container transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Khám phá ấn bản tiêu biểu</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../../utils/currency';

export interface RecommendedBookItem {
  id: string;
  title: string;
  author: string;
  tag: string;
  price: number;
  coverImage: string;
  description: string;
}

const RECOMMENDED_BOOKS: RecommendedBookItem[] = [
  {
    id: 'book-8',
    title: 'Database Internals',
    author: 'Alex Petrov',
    tag: "O'Reilly",
    price: 380000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoaQ72umhvclAxXCXBmasus2nRUktnHzPZIc3cfNy3AhrB8Sq2CGSQejF-Nc0OILh-f_-aKhMWGaOhGqurRvk8V4KTsdvc3YkLJsON5t9xp-Dqc-Si6FQVQujEL_1CIZJX4il-eWPURRu9LMeBrPpLoAPU6DDfpd0nowIyT5b9aw4T_8da6Q3tSzUBH_o4mzYtCxfaNcTH06_JqlNNBZfPkF5wnau5njxikN6N5mId',
    description: 'Chuyên khảo sâu sắc về các công cụ lưu trữ dữ liệu phân tán và quan hệ hiện đại.',
  },
  {
    id: 'book-9',
    title: 'System Design Interview (Vol. 1)',
    author: 'Alex Xu',
    tag: 'Bán chạy nhất',
    price: 290000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6DJ8yIDuRSV6f3J86l5aLnvtorxomeE6p88UK1AkxyBh7mRmWJRqya7kLX4Mh08LHQwn8a5J7P57o7q4apZ-5HYmNBrRpX84nC3GPgo1W8OCKuI0stj2jCXYqLx0Le4mlARXWSCpv_l5UDxihn9SflTqLv3i3qsExcsTblLTDfcLWGkrNscYuaRypuSoDM8kn3KWKP0K6y4vh_1RI9satQ5LEO9ntqGBBSGQVOGD',
    description: 'Bản thiết kế trực quan từng bước cho các bài toán kiến trúc hệ thống quy mô lớn.',
  },
  {
    id: 'book-10',
    title: 'Site Reliability Engineering',
    author: 'Niall Richard Murphy et al.',
    tag: 'Google Press',
    price: 350000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnQMj4z_B6VYPjbAMa-nRU9vUNImOjHrRVM2UyABuLiRBo5Eh08OUqTM0gVN10ab4ZCKfxdcR-YJyKCx5etxDzKjFmoSdYtTiL3qUK-r7AH9Ha2nXiR1Pt60XFUxll6soKK_PaHsHiwSXnKx4IDMYXbFDAdUHVnfsJXLIyk1QUJnmq5nX4HbfyJNRDOE4WaV8OsQYEXIGWYG_h-2c5sP-TYRbq4iNQulZ0sKUnZ6Mf',
    description: 'Cách Google vận hành các hệ thống phân tán quy mô toàn cầu bền bỉ và tin cậy.',
  },
  {
    id: 'book-11',
    title: 'Building Microservices',
    author: 'Sam Newman',
    tag: 'Tái bản lần 2',
    price: 370000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1kBO8fCsjEbHzC_4Wm0bJa1SaNQPmAre5qCF7H4RdFVS17fstYzu4HA9cdMa6Q0KaCdrrQMh6AEG-lFdqMl_1Kq0gCKlGPaMmWmAzQPEzh6D_oZiRW0PhUVtn-8GJ_Xc6WvEhg5jSG8nTOIfvFj-jaVhe3KjV5ZkERTws4TnZcoZAKb9MuImIij9--GCwJqtAovVedy9se1DGCHG7s6ArVf3z8McHX6Xab0sgbsDd',
    description: 'Thiết kế các hệ thống vi dịch vụ độc lập, ranh giới rõ ràng và đường ống sự kiện.',
  },
];

export const RelatedBooksCarousel: React.FC = () => {
  const navigate = useNavigate();
  const recContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="book-related-carousel"
      data-testid="book-details-related-section"
      className="mt-space-xl"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div>
          <h2
            data-testid="book-details-related-heading"
            className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight"
          >
            Những tác phẩm thường được độc giả chọn mua cùng
            <span className="sr-only"> (Readers Also Purchased)</span>
          </h2>
          <p
            data-testid="book-details-related-subtitle"
            className="font-body-md text-body-md text-secondary"
          >
            Tuyển chọn các ấn bản chuyên khảo thường được nghiên cứu đồng thời
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="recScrollLeft"
            data-testid="book-details-related-btn-prev"
            aria-label="Cuộn sang trái"
            onClick={handleScrollLeft}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-secondary-container flex items-center justify-center text-primary transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            type="button"
            id="recScrollRight"
            data-testid="book-details-related-btn-next"
            aria-label="Cuộn sang phải"
            onClick={handleScrollRight}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-secondary-container flex items-center justify-center text-primary transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        id="recContainer"
        data-testid="book-details-related-carousel-track"
        ref={recContainerRef}
        className="flex gap-space-md overflow-x-auto pb-space-sm no-scrollbar scroll-smooth"
      >
        {RECOMMENDED_BOOKS.map((rec) => (
          <div
            key={rec.id}
            data-testid={`book-details-related-card-${rec.id}`}
            onClick={() => navigate(`/book/${rec.id}`)}
            className="w-64 shrink-0 rounded-3xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md border border-outline-variant/30 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container mb-space-sm">
                <img
                  src={rec.coverImage}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-xs text-on-primary font-label-sm text-[11px] font-semibold">
                  {rec.tag}
                </span>
              </div>

              <h4 className="font-title-sm text-title-sm font-bold text-primary group-hover:text-primary-container transition-colors line-clamp-1">
                {rec.title}
              </h4>
              <p className="font-body-xs text-secondary mt-0.5 mb-1">{rec.author}</p>
              <p className="font-body-xs text-on-surface-variant line-clamp-2">
                {rec.description}
              </p>
            </div>

            <div className="mt-space-sm pt-space-xs border-t border-outline-variant/20 flex items-center justify-between">
              <span className="font-title-md text-title-md font-bold text-primary num-tabular">
                {formatVND(rec.price)}
              </span>
              <span className="material-symbols-outlined text-primary text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

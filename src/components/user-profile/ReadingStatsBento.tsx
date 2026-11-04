import React from 'react';

export const ReadingStatsBento: React.FC = () => {
  return (
    <div
      id="reading-stats-bento"
      data-testid="user-profile-stats"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg"
    >
      {/* Bento Card 1: Volumes Read */}
      <div
        id="stat-card-volumes"
        data-testid="user-profile-stats-card-volumes"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Total Volumes Read / Sách đã đọc
          </span>
          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            64
          </span>
          <span className="font-body-xs text-body-xs text-outline mt-0.5 block">
            42 Đã mua • 22 Đã mượn đọc
          </span>
        </div>
      </div>

      {/* Bento Card 2: Current Borrowings */}
      <div
        id="stat-card-borrowings"
        data-testid="user-profile-stats-card-borrowings"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Current Borrowings / Đang mượn
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">library_books</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            3 Titles
          </span>
          <span className="font-body-xs text-body-xs text-primary font-medium mt-0.5 block">
            Hạn trả sau 12 ngày • Không phí trễ hạn
          </span>
        </div>
      </div>

      {/* Bento Card 3: Reading Challenge */}
      <div
        id="stat-card-challenge"
        data-testid="user-profile-stats-card-challenge"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Reading Challenge / Thử thách
          </span>
          <div className="w-8 h-8 rounded-full bg-tertiary-container/50 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[18px]">flag</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-headline-md font-bold text-on-surface num-tabular">
              18/24
            </span>
            <span className="font-label-sm text-label-sm font-bold text-tertiary num-tabular">
              75%
            </span>
          </div>
          {/* Progress bar using pure Tailwind class - ZERO inline styles */}
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden mt-1.5">
            <div className="h-full bg-tertiary rounded-full w-3/4" />
          </div>
        </div>
      </div>

      {/* Bento Card 4: Loyalty Points */}
      <div
        id="stat-card-points"
        data-testid="user-profile-stats-card-points"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Loyalty Points / Điểm thưởng
          </span>
          <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">stars</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            2,450
          </span>
          <span className="font-body-xs text-body-xs text-outline mt-0.5 block">
            Hạng IV • 3 Mã ưu đãi sẵn sàng
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadingStatsBento;

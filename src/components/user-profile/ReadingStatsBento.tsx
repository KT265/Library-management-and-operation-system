import React from 'react';

export const ReadingStatsBento: React.FC = () => {
  return (
    <div
      id="reading-stats-bento"
      data-testid="user-profile-stats"
      className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg"
    >
      {/* Bento Card 1: Đơn đã hoàn thành */}
      <div
        id="stat-card-completed-orders"
        data-testid="user-profile-stats-card-completed-orders"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Đơn đã hoàn thành
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface block num-tabular">
            18
          </span>
          <span className="font-body-xs text-body-xs text-outline mt-0.5 block">
            18 đơn hàng
          </span>
        </div>
      </div>

      {/* Bento Card 2: Sách đã đọc */}
      <div
        id="stat-card-books-read"
        data-testid="user-profile-stats-card-books-read"
        className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Sách đã đọc
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
            64 cuốn đã đọc
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadingStatsBento;

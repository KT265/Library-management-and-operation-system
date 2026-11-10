import React from 'react';
import { Book } from '../../types';
import { OverviewTab } from './OverviewTab';
import { SpecificationsTab } from './SpecificationsTab';
import { ReviewsTab } from './ReviewsTab';
import { AuthorTab } from './AuthorTab';

export type BookTabId = 'tab-overview' | 'tab-specs' | 'tab-reviews' | 'tab-author';

interface BookTabsSectionProps {
  book: Book;
  activeTab: BookTabId;
  onTabChange: (tab: BookTabId) => void;
}

export const BookTabsSection: React.FC<BookTabsSectionProps> = ({
  book,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'tab-overview' as const, label: 'Giới thiệu tổng quan', icon: 'description' },
    { id: 'tab-specs' as const, label: 'Thông số xuất bản', icon: 'list_alt' },
    { id: 'tab-reviews' as const, label: 'Đánh giá độc giả', icon: 'rate_review' },
    { id: 'tab-author' as const, label: 'Tác giả & Tiểu sử', icon: 'person' },
  ];

  return (
    <section
      id="reviews-section"
      data-testid="book-details-tabs-section"
      className="mt-space-xl p-space-lg lg:p-space-xl rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm"
    >
      {/* Tab Navigation Header */}
      <div
        data-testid="book-details-tabs-nav"
        className="flex items-center space-x-2 border-b border-outline-variant/30 pb-space-sm overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={tab.id}
              data-target={tab.id}
              data-testid={`book-details-tab-btn-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-space-md py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="pt-space-lg">
        <div className={activeTab === 'tab-overview' ? 'block' : 'hidden'}>
          <OverviewTab book={book} />
        </div>
        <div className={activeTab === 'tab-specs' ? 'block' : 'hidden'}>
          <SpecificationsTab book={book} />
        </div>
        <div className={activeTab === 'tab-reviews' ? 'block' : 'hidden'}>
          <ReviewsTab book={book} />
        </div>
        <div className={activeTab === 'tab-author' ? 'block' : 'hidden'}>
          <AuthorTab book={book} />
        </div>
      </div>
    </section>
  );
};

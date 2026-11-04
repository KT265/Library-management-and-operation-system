import React from 'react';
import { User } from '../../types';

export interface PatronHeaderCardProps {
  user: User | null;
  onEditProfile: () => void;
}

export const PatronHeaderCard: React.FC<PatronHeaderCardProps> = ({
  user,
  onEditProfile,
}) => {
  const patronName = user?.name || 'Minh Nguyễn';
  const patronEmail = user?.email || 'minh.nguyen@example.com';
  const avatarUrl =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';

  return (
    <div
      id="patron-header-card"
      data-testid="user-profile-header"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        {/* Avatar & Info */}
        <div className="flex items-center gap-space-md">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={patronName}
              data-testid="user-profile-header-avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-secondary-container shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[16px] fill">
                workspace_premium
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                data-testid="user-profile-header-name"
                className="font-headline-sm text-headline-sm font-bold text-on-surface"
              >
                {patronName}
              </h2>
              <span
                data-testid="user-profile-header-badge"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                <span className="material-symbols-outlined text-[14px] fill">
                  workspace_premium
                </span>
                <span>Bibliophile Scholar • Level 4 / Thành viên Tinh hoa</span>
              </span>
            </div>

            <p
              data-testid="user-profile-header-email"
              className="font-body-md text-body-md text-on-surface-variant mt-0.5"
            >
              {patronEmail}
            </p>

            <span className="font-body-xs text-body-xs text-outline mt-1">
              Member since 2021 • Thành viên từ năm 2021
            </span>
          </div>
        </div>

        {/* Edit Profile Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="openEditProfileBtn"
            data-testid="user-profile-header-btn-edit"
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full font-label-md text-label-md font-bold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Chỉnh sửa thông tin</span>
          </button>
          {/* Legacy ID button alias */}
          <button
            id="editProfileBtn"
            type="button"
            onClick={onEditProfile}
            className="sr-only"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatronHeaderCard;

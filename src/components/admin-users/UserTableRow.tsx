import React from 'react';
import { AdminManagedUser } from './types';
import { formatVND } from '../../utils/currency';

interface UserTableRowProps {
  user: AdminManagedUser;
  onEditRole: (user: AdminManagedUser) => void;
  onToggleLock: (user: AdminManagedUser) => void;
  onViewSecurityLog: (user: AdminManagedUser) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEditRole,
  onToggleLock,
  onViewSecurityLog,
}) => {
  const isAdmin = user.role === 'admin';
  const isLocked = user.status === 'locked';

  // Dynamic avatar style based on role and status
  let avatarBg = user.avatarBgColor;
  let avatarText = user.avatarTextColor;
  if (isLocked) {
    avatarBg = 'bg-error-container';
    avatarText = 'text-on-error-container';
  } else if (isAdmin) {
    avatarBg = (avatarBg && avatarBg !== 'bg-error-container') ? avatarBg : 'bg-primary';
    avatarText = (avatarText && avatarText !== 'text-on-error-container') ? avatarText : 'text-on-primary';
  } else {
    avatarBg = (avatarBg && avatarBg !== 'bg-error-container') ? avatarBg : 'bg-surface-container-high';
    avatarText = (avatarText && avatarText !== 'text-on-error-container') ? avatarText : 'text-secondary';
  }

  return (
    <tr
      id={`user-row-${user.uid}`}
      data-testid={`admin-user-row-${user.id}`}
      data-email={user.email}
      data-name={user.name}
      data-role={user.role}
      data-status={user.status}
      data-uid={user.uid}
      className={`user-row user-table-row transition-colors ${
        isLocked ? 'opacity-80 bg-surface-container-low/30' : 'hover:bg-surface-container-low/60'
      }`}
    >
      {/* Col 1: User & Account Info */}
      <td className="py-3.5 px-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="relative shrink-0">
            <div
              data-testid={`admin-user-avatar-${user.id}`}
              className={`w-10 h-10 rounded-full ${avatarBg} ${avatarText} font-bold flex items-center justify-center font-title-sm text-title-sm shadow-xs`}
            >
              {user.initials}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                data-testid={`admin-user-name-${user.id}`}
                className={`font-title-sm text-title-sm font-bold truncate ${
                  isAdmin ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {user.name}
              </span>
              <span
                data-testid={`admin-user-uid-${user.id}`}
                className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-container text-secondary"
              >
                {user.uid}
              </span>
            </div>
            <div
              data-testid={`admin-user-email-${user.id}`}
              className="text-secondary font-body-sm text-body-sm truncate"
            >
              {user.email}
            </div>
          </div>
        </div>
      </td>

      {/* Col 2: Phone Number */}
      <td className="py-3.5 px-space-md">
        <div
          data-testid={`admin-user-phone-${user.id}`}
          className="text-on-surface font-body-sm font-medium font-mono"
        >
          {user.phone}
        </div>
      </td>

      {/* Col 3: Accumulated Spend (VND Standard format R2) */}
      <td className="py-3.5 px-space-md">
        <div
          data-testid={`admin-user-spend-${user.id}`}
          className="text-on-surface font-body-sm font-semibold tabular-nums"
        >
          {formatVND(user.totalSpend)}
        </div>
      </td>

      {/* Col 4: Role Badge */}
      <td className="py-3.5 px-space-md">
        {isAdmin ? (
          <div
            id={`badge-role-admin-${user.uid}`}
            data-testid={`admin-user-role-badge-${user.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span className="font-label-sm text-label-sm font-semibold">
              Quản trị viên (Admin)
            </span>
          </div>
        ) : (
          <div
            id={`badge-role-user-${user.uid}`}
            data-testid={`admin-user-role-badge-${user.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span className="font-label-sm text-label-sm font-medium">
              Người dùng (User)
            </span>
          </div>
        )}
      </td>

      {/* Col 5: Status */}
      <td className="py-3.5 px-space-md">
        {isLocked ? (
          <span
            id={`status-badge-locked-${user.uid}`}
            data-testid={`admin-user-status-badge-${user.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-label-sm font-semibold bg-error-container text-on-error-container"
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Tạm khóa</span>
          </span>
        ) : (
          <span
            id={`status-badge-active-${user.uid}`}
            data-testid={`admin-user-status-badge-${user.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-label-sm font-semibold bg-secondary-container/60 text-primary"
          >
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Hoạt động</span>
          </span>
        )}
      </td>

      {/* Col 6: Action Buttons */}
      <td className="py-3.5 px-space-md text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Change Role Button */}
          <button
            type="button"
            id={`btn-edit-role-${user.uid}`}
            data-testid={`admin-user-btn-edit-role-${user.id}`}
            onClick={() => onEditRole(user)}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors cursor-pointer"
            title={isAdmin ? 'Đổi phân quyền tài khoản' : 'Nâng quyền lên Admin / Tùy chỉnh'}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          </button>

          {/* Toggle Lock / Unlock */}
          <button
            type="button"
            id={`btn-toggle-lock-${user.uid}`}
            data-testid={`admin-user-btn-lock-${user.id}`}
            onClick={() => onToggleLock(user)}
            className={`w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer ${
              isLocked ? 'text-error' : 'text-secondary hover:text-on-surface'
            }`}
            title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLocked ? 'lock_open' : 'lock'}
            </span>
          </button>

          {/* View Security Log */}
          <button
            type="button"
            id={`btn-security-log-${user.uid}`}
            data-testid={`admin-user-btn-log-${user.id}`}
            onClick={() => onViewSecurityLog(user)}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
            title="Truy xuất nhật ký bảo mật"
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

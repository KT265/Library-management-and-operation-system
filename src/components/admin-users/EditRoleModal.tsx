import React, { useState, useEffect } from 'react';
import {
  AdminManagedUser,
  UserRole,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_USER_PERMISSIONS,
  getInitials,
} from './types';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminManagedUser | null;
  isCreateMode?: boolean;
  onSave: (updatedUser: AdminManagedUser) => void;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  isCreateMode = false,
  onSave,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    uid: '',
  });

  // Sync state when editing user opens
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setSelectedPermissions(user.permissions || (user.role === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_USER_PERMISSIONS));
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        uid: user.uid,
      });
    } else if (isCreateMode) {
      setSelectedRole('user');
      setSelectedPermissions([...DEFAULT_USER_PERMISSIONS]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        uid: `BV-USR-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
  }, [user, isCreateMode, isOpen]);

  // Handle Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Role Radio selection
  const handleRoleSelection = (role: UserRole) => {
    if (role === selectedRole) return;
    setSelectedRole(role);

    // If in create mode, auto-tune UID prefix between BV-ADM and BV-USR
    if (isCreateMode && formData.uid) {
      const numPart = formData.uid.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000).toString();
      setFormData((prev) => ({
        ...prev,
        uid: role === 'admin' ? `BV-ADM-${numPart.slice(-3).padStart(3, '0')}` : `BV-USR-${numPart}`,
      }));
    }

    if (role === 'admin') {
      setSelectedPermissions([...DEFAULT_ADMIN_PERMISSIONS]);
    } else {
      setSelectedPermissions([...DEFAULT_USER_PERMISSIONS]);
    }
  };

  // Submit and save
  const handleSave = () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedUid = formData.uid.trim();

    const initials = isCreateMode
      ? getInitials(trimmedName || 'Người dùng mới')
      : (user?.initials || getInitials(trimmedName || user?.name || ''));

    const savedUser: AdminManagedUser = {
      id: user ? user.id : `usr-${Date.now()}`,
      uid: trimmedUid || (user ? user.uid : 'BV-USR-NEW'),
      name: trimmedName || (user ? user.name : 'Người dùng mới'),
      email: trimmedEmail || (user ? user.email : 'account.new@bookverse.io'),
      phone: trimmedPhone || (user ? user.phone : '0900 000 000'),
      role: selectedRole,
      status: user ? user.status : 'active',
      initials,
      avatarBgColor:
        user && user.role === selectedRole && user.avatarBgColor
          ? user.avatarBgColor
          : selectedRole === 'admin'
          ? 'bg-primary'
          : 'bg-surface-container-high',
      avatarTextColor:
        user && user.role === selectedRole && user.avatarTextColor
          ? user.avatarTextColor
          : selectedRole === 'admin'
          ? 'text-on-primary'
          : 'text-secondary',
      permissions: selectedPermissions,
      totalSpend: user ? user.totalSpend : 0,
      createdAt: user ? user.createdAt : 'Hôm nay',
    };

    onSave(savedUser);
  };

  const displayName = isCreateMode ? (formData.name || 'Người dùng mới') : (user?.name || '');
  const displayEmail = isCreateMode ? (formData.email || 'Nhập thông tin sau khi xác nhận') : (user?.email || '');
  const displayPhone = isCreateMode ? (formData.phone || 'Chưa cập nhật') : (user?.phone || '');
  const displayInitials = isCreateMode
    ? (formData.name ? getInitials(formData.name) : '+')
    : (user?.initials || (user?.name ? getInitials(user.name) : 'TT'));

  return (
    <div
      id="roleModal"
      data-testid="admin-role-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 modal-backdrop-fade"
    >
      <div
        id="modalDialog"
        data-testid="admin-edit-role-modal"
        className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-outline-variant/30 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs">
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            </div>
            <div>
              <h3
                id="modalTitle"
                data-testid="admin-modal-title"
                className="font-title-lg text-title-lg text-primary font-bold"
              >
                {isCreateMode ? 'Tạo & Chỉ Định Quyền Tài Khoản Mới' : 'Chỉnh Sửa Quyền Tài Khoản'}
              </h3>
              <p
                id="modalSubhead"
                data-testid="admin-modal-subhead"
                className="font-body-sm text-body-sm text-secondary"
              >
                {isCreateMode ? 'Khởi tạo tài khoản hệ thống' : 'Chỉ định vai trò và phân quyền tài khoản'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-role-modal"
            data-testid="admin-modal-btn-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
            title="Đóng hộp thoại"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* User Preview / Inputs Card */}
          <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3.5 border border-surface-container/60">
            <div
              id="modalUserAvatar"
              data-testid="admin-modal-user-avatar"
              className={`w-12 h-12 rounded-full font-bold flex items-center justify-center font-title-md shrink-0 shadow-xs ${
                selectedRole === 'admin'
                  ? 'bg-primary text-on-primary'
                  : 'bg-secondary text-on-secondary'
              }`}
            >
              {displayInitials}
            </div>
            <div className="min-w-0 flex-1">
              {isCreateMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    id="input-create-user-name"
                    data-testid="admin-modal-input-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Họ và tên người dùng..."
                    className="w-full text-title-sm font-bold text-primary bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      id="input-create-user-email"
                      data-testid="admin-modal-input-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email..."
                      className="text-body-sm text-secondary bg-surface-container-lowest px-2 py-1 rounded-md border border-outline-variant/40 focus:outline-none"
                    />
                    <input
                      type="tel"
                      id="input-create-user-phone"
                      data-testid="admin-modal-input-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Số điện thoại..."
                      className="text-body-sm text-secondary bg-surface-container-lowest px-2 py-1 rounded-md border border-outline-variant/40 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h4
                    id="modalUserName"
                    data-testid="admin-modal-user-name"
                    className="font-title-md text-title-md font-bold text-primary truncate"
                  >
                    {displayName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-secondary font-body-sm text-body-sm mt-0.5">
                    <span id="modalUserEmail" className="truncate font-mono">
                      {displayEmail}
                    </span>
                    <span className="text-outline">•</span>
                    <span id="modalUserPhone" className="font-mono">
                      {displayPhone}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Role Selection Group (Strictly 2 Roles) */}
          <div>
            <label className="block font-label-md text-label-md font-semibold text-primary uppercase tracking-wider mb-2.5">
              Chỉ định vai trò (Chỉ áp dụng 2 vai trò)
            </label>
            <div className="grid grid-cols-1 gap-3">
              {/* Role: User */}
              <label
                id="label-role-user"
                data-testid="admin-modal-role-user"
                onClick={() => handleRoleSelection('user')}
                className={`relative flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'user'
                    ? 'border-outline bg-secondary-container/40 shadow-sm'
                    : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest'
                }`}
              >
                <input
                  type="radio"
                  id="radio-role-user"
                  data-testid="admin-modal-radio-user"
                  name="system_role"
                  value="user"
                  checked={selectedRole === 'user'}
                  onChange={() => handleRoleSelection('user')}
                  className="mt-1 text-primary focus:ring-primary accent-[#002045]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      person
                    </span>
                    <span className="font-title-sm text-title-sm font-bold text-on-surface">
                      Người dùng (User)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Quyền khách hàng: Mua sách, đánh giá, theo dõi đơn hàng, áp dụng voucher.
                  </p>
                </div>
              </label>

              {/* Role: Admin */}
              <label
                id="label-role-admin"
                data-testid="admin-modal-role-admin"
                onClick={() => handleRoleSelection('admin')}
                className={`relative flex items-start gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'admin'
                    ? 'border-tertiary-container bg-[#FFB59C] shadow-sm'
                    : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest'
                }`}
              >
                <input
                  type="radio"
                  id="radio-role-admin"
                  data-testid="admin-modal-radio-admin"
                  name="system_role"
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={() => handleRoleSelection('admin')}
                  className="mt-1 text-tertiary focus:ring-tertiary accent-[#410f00]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        selectedRole === 'admin' ? 'text-[#410f00]' : 'text-secondary'
                      }`}
                    >
                      admin_panel_settings
                    </span>
                    <span
                      className={`font-title-sm text-title-sm font-bold ${
                        selectedRole === 'admin' ? 'text-[#410f00]' : 'text-on-surface'
                      }`}
                    >
                      Quản trị viên (Admin)
                    </span>
                  </div>
                  <p
                    className={`font-body-sm text-body-sm mt-1 ${
                      selectedRole === 'admin'
                        ? 'text-[#390c00] font-medium'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    Quyền quản trị toàn hệ thống: Quản lý sách, đơn hàng, voucher, cấu hình và phân quyền.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Policy Information Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-high/60 text-on-surface-variant border border-outline-variant/40">
            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">
              info
            </span>
            <p className="font-body-sm text-body-sm">
              Lưu ý: Chỉ định quyền{' '}
              <strong className="text-primary font-semibold">Quản trị viên</strong> cho phép tài khoản này truy cập toàn bộ dữ liệu quản trị và quản lý vận hành.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-surface-container-low border-t border-surface-container shrink-0">
          <button
            type="button"
            id="btn-cancel-modal"
            data-testid="admin-modal-btn-cancel"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-md text-label-md text-secondary hover:bg-surface-container font-semibold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            id="btn-save-role-change"
            data-testid="admin-modal-btn-save"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

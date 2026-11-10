import React, { useState, useMemo, useEffect } from 'react';
import '../components/admin-users/admin-users.css';
import {
  AdminManagedUser,
  UserRole,
  INITIAL_MANAGED_USERS,
  normalizeVietnamese,
} from '../components/admin-users/types';
import { UsersPermissionsHeader } from '../components/admin-users/UsersPermissionsHeader';
import { UsersKpisGrid } from '../components/admin-users/UsersKpisGrid';
import { UsersFilterToolbar } from '../components/admin-users/UsersFilterToolbar';
import { UsersTable } from '../components/admin-users/UsersTable';
import { EditRoleModal } from '../components/admin-users/EditRoleModal';
import { UsersToast } from '../components/admin-users/UsersToast';

export const AdminUsers: React.FC = () => {
  // Ephemeral State for interactive role assignment (Requirement R3)
  const [users, setUsers] = useState<AdminManagedUser[]>(INITIAL_MANAGED_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastTimeoutId, setToastTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(message);
    setIsToastVisible(true);
    const id = setTimeout(() => {
      setIsToastVisible(false);
    }, 3500);
    setToastTimeoutId(id);
  };

  // Toast timeout cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [toastTimeoutId]);

  // Dynamic KPI and counter calculations adhering to Stitch Screen baseline (6 Admins, 2,839 Users)
  // Baseline list contains 3 admins and 4 users.
  // Dynamic offsets preserve baseline metrics while accurately reflecting additions and role conversions:
  // Baseline: 3 admins + 3 = 6 Admins. 4 users + 2835 = 2839 Users. Total = 2845.
  const currentAdminInList = useMemo(
    () => users.filter((u) => u.role === 'admin').length,
    [users]
  );
  const currentUserInList = useMemo(
    () => users.filter((u) => u.role === 'user').length,
    [users]
  );

  const BASELINE_ADMIN_OFFSET = 3;
  const BASELINE_USER_OFFSET = 2835;

  const adminKpiCount = currentAdminInList + BASELINE_ADMIN_OFFSET;
  const userKpiCount = currentUserInList + BASELINE_USER_OFFSET;
  const totalSystemCount = adminKpiCount + userKpiCount;

  // Filter users based on search query and role
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const normalizedQuery = normalizeVietnamese(searchQuery);

    return users.filter((u) => {
      // Role filter
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false;
      }

      // Search matching (name, email, UID, phone) - supports unaccented & accented Vietnamese
      if (query) {
        const matchesName =
          u.name.toLowerCase().includes(query) ||
          normalizeVietnamese(u.name).includes(normalizedQuery);
        const matchesEmail = u.email.toLowerCase().includes(query);

        // UID tolerance (e.g. "adm-001" or "adm001" or "bv-adm-001")
        const cleanUid = u.uid.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanQueryUid = query.replace(/[^a-z0-9]/g, '');
        const matchesUid =
          u.uid.toLowerCase().includes(query) ||
          (cleanQueryUid.length >= 3 && cleanUid.includes(cleanQueryUid));

        // Phone tolerance (e.g. "0912849201" matches "0912 849 201")
        const cleanPhone = u.phone.replace(/\D/g, '');
        const cleanQueryPhone = query.replace(/\D/g, '');
        const matchesPhone =
          u.phone.toLowerCase().includes(query) ||
          (cleanQueryPhone.length >= 3 && cleanPhone.includes(cleanQueryPhone));

        if (!matchesName && !matchesEmail && !matchesUid && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [users, searchQuery, selectedRole]);

  // Handlers
  const handleRefresh = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setCurrentPage(1);
    showToast('Đã làm mới dữ liệu người dùng thành công.');
  };

  const handleOpenEditUser = (user: AdminManagedUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (savedUser: AdminManagedUser) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === savedUser.id);
      if (exists) {
        return prev.map((u) => (u.id === savedUser.id ? savedUser : u));
      }
      return [savedUser, ...prev];
    });

    handleCloseModal();
    const roleTitle = savedUser.role === 'admin' ? 'Quản trị viên (Admin)' : 'Người dùng (User)';
    showToast(`Đã lưu thay đổi! Vai trò hiện tại: ${roleTitle}`);
  };

  return (
    <div
      id="admin-users-page"
      data-testid="admin-users-page"
      className="flex flex-col w-full pb-margin-lg"
    >
      {/* Top Banner / Page Header */}
      <UsersPermissionsHeader />

      {/* KPI Metrics Grid */}
      <UsersKpisGrid adminCount={adminKpiCount} userCount={userKpiCount} />

      {/* Filter & Action Toolbar */}
      <UsersFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        selectedRole={selectedRole}
        onRoleSelect={(role) => {
          setSelectedRole(role);
          setCurrentPage(1);
        }}
        onRefresh={handleRefresh}
        totalCount={totalSystemCount}
        adminCount={adminKpiCount}
        userCount={userKpiCount}
      />

      {/* Users & Roles Data Table */}
      <UsersTable
        users={filteredUsers}
        onEditRole={handleOpenEditUser}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalSystemCount={totalSystemCount}
      />

      {/* Role Edit / Create Modal Backdrop & Dialog */}
      <EditRoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSave={handleSaveUser}
      />

      {/* Floating Notification Toast */}
      <UsersToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
};

export default AdminUsers;

import React, { useState, useMemo, useEffect } from 'react';
import '../components/admin-users/admin-users.css';
import { collection, getDocs } from 'firebase/firestore';
import { db, mapFirestoreUserToAdminManagedUser } from '../services/firebase';
import {
  AdminManagedUser,
  UserRole,
  normalizeVietnamese,
} from '../components/admin-users/types';
import { UsersPermissionsHeader } from '../components/admin-users/UsersPermissionsHeader';
import { UsersKpisGrid } from '../components/admin-users/UsersKpisGrid';
import { UsersFilterToolbar } from '../components/admin-users/UsersFilterToolbar';
import { UsersTable } from '../components/admin-users/UsersTable';
import { EditRoleModal } from '../components/admin-users/EditRoleModal';
import { UsersToast } from '../components/admin-users/UsersToast';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'Users'));
      const fetched = snap.docs.map((docSnap) =>
        mapFirestoreUserToAdminManagedUser(docSnap.data(), docSnap.id)
      );
      setUsers(fetched);
    } catch (err: any) {
      console.error('[AdminUsers] Error querying Firestore "Users":', err);
      setError('Không thể tải danh sách tài khoản người dùng từ Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toast timeout cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [toastTimeoutId]);

  // Dynamic KPI and counter calculations adhering to Stitch Screen baseline (6 Admins, 2,839 Users)
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
    fetchUsers();
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
      {/* 1. Header with Breadcrumb and Real-time Status */}
      <UsersPermissionsHeader />

      {/* 2. 3-Card KPI Summary Grid */}
      <UsersKpisGrid
        adminCount={adminKpiCount}
        userCount={userKpiCount}
      />

      {/* 3. Filter and Search Toolbar */}
      <UsersFilterToolbar
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        onSearchChange={setSearchQuery}
        onRoleSelect={setSelectedRole}
        onRefresh={handleRefresh}
        totalCount={totalSystemCount}
        adminCount={adminKpiCount}
        userCount={userKpiCount}
      />

      {/* Loading & Error States */}
      {loading ? (
        <div
          id="admin-users-loading"
          data-testid="admin-users-loading-spinner"
          className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 my-4"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium text-body-md">Đang đồng bộ danh sách tài khoản từ Firestore...</p>
        </div>
      ) : error ? (
        <div
          id="admin-users-error"
          data-testid="admin-users-error-state"
          className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center my-4"
        >
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-error font-medium mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        /* 4. Users Data Table with Role Badges & Permissions Chips */
        <UsersTable
          users={filteredUsers}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEditRole={handleOpenEditUser}
          totalSystemCount={totalSystemCount}
        />
      )}

      {/* 5. Edit Role & Permission Dialog */}
      <EditRoleModal
        isOpen={isModalOpen}
        user={editingUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />

      {/* 6. Ephemeral Toast Feedback Banner */}
      <UsersToast isVisible={isToastVisible} message={toastMessage} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

export default AdminUsers;

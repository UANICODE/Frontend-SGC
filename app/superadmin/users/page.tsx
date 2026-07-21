"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";

import { useListUsers } from "@/hooks/superadmin/users/useListUsers";
import { useListRoles } from "@/hooks/superadmin/users/useListRoles";

import { UsersHeader } from "@/components/superadmin/users/UsersHeader";
import {
  UsersFilters,
  UsersFilterValues,
} from "@/components/superadmin/users/UsersFilters";
import { UsersTable } from "@/components/superadmin/users/UsersTable";
import { UsersPagination } from "@/components/superadmin/users/UsersPagination";
import { UserItemResponse } from "@/types/superadmin/users/listUsers";
import { useToast } from "@/ context/ToastContext";
import { CreateUserModal } from "@/components/superadmin/modal/CreateUserModal";
import { EditUserModal } from "@/components/superadmin/modal/EditUserModal";
import { ChangeUserStatusModal } from "@/components/superadmin/modal/ChangeUserStatusModal";
import { ManageUserRolesModal } from "@/components/superadmin/modal/ManageUserRolesModal";
import { RolesManagementModal } from "@/components/superadmin/modal/RolesManagementModal";

const PAGE_SIZE = 10;

const emptyFilters: UsersFilterValues = {
  search: "",
  active: "",
  roleName: "",
};

export default function UsersManagementPage() {
  useRoleGuard([UserRole.SUPERADMIN]);

  const { showToast } = useToast();

  const {
    data: usersData,
    loading: usersLoading,
    execute: loadUsers,
  } = useListUsers();

  const {
    data: rolesData,
    loading: rolesLoading,
    execute: loadRoles,
  } = useListRoles();

  const [page, setPage] = useState(0);

  const [filterForm, setFilterForm] =
    useState<UsersFilterValues>(emptyFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<UsersFilterValues>(emptyFilters);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [rolesManagementOpen, setRolesManagementOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<UserItemResponse | null>(null);

  const [statusUser, setStatusUser] =
    useState<UserItemResponse | null>(null);

  const [rolesUser, setRolesUser] =
    useState<UserItemResponse | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      await loadUsers({
        page,
        size: PAGE_SIZE,
        search: appliedFilters.search.trim() || null,
        active:
          appliedFilters.active === ""
            ? null
            : appliedFilters.active === "true",
        roleName: appliedFilters.roleName || null,
      });
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível carregar os utilizadores.",
        "error"
      );
    }
  }, [page, appliedFilters, loadUsers, showToast]);

  const fetchRoles = useCallback(async () => {
    try {
      await loadRoles(0, 100);
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível carregar as roles.",
        "error"
      );
    }
  }, [loadRoles, showToast]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const users = usersData?.content || [];
  const roles = rolesData?.content || [];

  const activeUsers = useMemo(
    () => users.filter((user) => user.ativo).length,
    [users]
  );

  function applyFilters() {
    setPage(0);
    setAppliedFilters(filterForm);
  }

  function clearFilters() {
    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  async function refreshAfterUserChange() {
    await fetchUsers();
  }

  async function refreshAfterRoleChange() {
    await fetchRoles();
    await fetchUsers();
  }

  async function refreshAfterUserRoleChange() {
    await fetchUsers();

    const updatedUser = usersData?.content.find(
      (user) => user.uid === rolesUser?.uid
    );

    if (updatedUser) {
      setRolesUser(updatedUser);
    } else {
      setRolesUser(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <UsersHeader
          totalUsers={usersData?.totalElements || 0}
          activeUsers={activeUsers}
          loading={usersLoading}
          onCreateUser={() => setCreateUserOpen(true)}
          onManageRoles={() => setRolesManagementOpen(true)}
          onRefresh={fetchUsers}
        />

        <UsersFilters
          values={filterForm}
          roles={roles}
          loading={usersLoading}
          onChange={setFilterForm}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <UsersTable
          users={users}
          loading={usersLoading}
          onEdit={setEditingUser}
          onManageRoles={setRolesUser}
          onChangeStatus={setStatusUser}
        />

        <UsersPagination
          page={usersData?.page || 0}
          totalPages={usersData?.totalPages || 0}
          totalElements={usersData?.totalElements || 0}
          size={usersData?.size || PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <CreateUserModal
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreated={refreshAfterUserChange}
      />

      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={refreshAfterUserChange}
      />

      <ChangeUserStatusModal
        user={statusUser}
        onClose={() => setStatusUser(null)}
        onChanged={refreshAfterUserChange}
      />

      <ManageUserRolesModal
        user={rolesUser}
        roles={roles}
        onClose={() => setRolesUser(null)}
        onChanged={async () => {
          await refreshAfterUserRoleChange();
          setRolesUser(null);
        }}
      />

      <RolesManagementModal
        open={rolesManagementOpen}
        roles={roles}
        loading={rolesLoading}
        onClose={() => setRolesManagementOpen(false)}
        onRefresh={refreshAfterRoleChange}
      />
    </div>
  );
}
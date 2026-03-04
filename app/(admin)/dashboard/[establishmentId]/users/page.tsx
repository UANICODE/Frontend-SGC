"use client";

import { CreateUserModal } from "@/components/admin/modals/CreateUserModal";
import { ManageRoleModal } from "@/components/admin/modals/ManageRoleModal";
import { ResetPasswordModal } from "@/components/admin/modals/ResetPasswordModal";
import { UserTable } from "@/components/admin/tables/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";
import { useUsers } from "@/hooks/admin /users/useUsers";
import { filterUsers } from "@/service/admin/user";
import { useState } from "react";


export default function UsersPage({ params }: any) {
  const { data, loading, refresh } =
    useUsers(params.establishmentId);

  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedReset, setSelectedReset] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function handleFilter(filters: any) {
    const result = await filterUsers({
      establishmentId: params.establishmentId,
      ...filters,
    });

    setFiltered(result);
  }

  const displayData =
    filtered.length > 0 ? filtered : data;

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Gestão de Usuários
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Novo Usuário
        </button>
      </div>

      <UserFilters onFilter={handleFilter} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <UserTable
          data={displayData}
          onToggle={refresh}
          onResetPassword={setSelectedReset}
          onManageRole={setSelectedRole}
        />
      )}

      {showCreate && (
        <CreateUserModal
          establishmentId={params.establishmentId}
          onClose={() => setShowCreate(false)}
          onSuccess={refresh}
        />
      )}

      {selectedReset && (
        <ResetPasswordModal
          establishmentId={params.establishmentId}
          user={selectedReset}
          onClose={() => setSelectedReset(null)}
          onSuccess={refresh}
        />
      )}

      {selectedRole && (
        <ManageRoleModal
          establishmentId={params.establishmentId}
          user={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
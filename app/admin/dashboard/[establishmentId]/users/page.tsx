"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { CreateUserModal } from "@/components/admin/modals/CreateUserModal";
import { ResetPasswordModal } from "@/components/admin/modals/ResetPasswordModal";
import { UserTable } from "@/components/admin/tables/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";


import { ListUsersByEstablishmentResponse } from "@/types/admin/user";
import { useUsers } from "@/hooks/admin /users/useUsers";

export default function UsersPage() {
  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const { data, loading, refresh } = useUsers(establishmentId);

  const [filters, setFilters] = useState({
    nome: "",
    email: "",
    ativo: "",
  });

  const [selectedReset, setSelectedReset] =
    useState<ListUsersByEstablishmentResponse | null>(null);

  const [showCreate, setShowCreate] = useState(false);

  const filteredUsers = useMemo(() => {
    const usersWithoutSuperAdmin = data.filter(
      (u) => u.role !== "SUPERADMIN"
    );

    return usersWithoutSuperAdmin.filter((user) => {
      const nomeMatch = user.nome
        .toLowerCase()
        .includes(filters.nome.toLowerCase());

      const emailMatch = user.email
        .toLowerCase()
        .includes(filters.email.toLowerCase());

      const statusMatch =
        filters.ativo === ""
          ? true
          : user.ativo === (filters.ativo === "true");

      return nomeMatch && emailMatch && statusMatch;
    });
  }, [data, filters]);

  return (
    <div className="space-y-8 animate-fadeIn">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Usuários
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Novo Usuário
        </button>
      </div>

      <UserFilters onFilter={setFilters} />

      {loading ? (
        <div className="flex flex-col items-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">
            Carregando usuários...
          </p>
        </div>
      ) : (
        <UserTable
          data={filteredUsers}
          establishmentId={establishmentId}
          onResetPassword={setSelectedReset}
          onRefresh={refresh}
        />
      )}

      {showCreate && (
        <CreateUserModal
          establishmentId={establishmentId}
          onClose={() => setShowCreate(false)}
          onSuccess={refresh}
        />
      )}

      {selectedReset && (
        <ResetPasswordModal
          establishmentId={establishmentId}
          user={selectedReset}
          onClose={() => setSelectedReset(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
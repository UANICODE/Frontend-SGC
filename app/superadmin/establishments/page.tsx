"use client";

import { useState } from "react";
import { EstablishmentCard } from "@/components/superadmin/cards/EstablishmentCard";
import { useListEstablishments } from "@/hooks/superadmin/useListEstablishments";
import { CreateEstablishmentModal } from "@/components/superadmin/modal/CreateEstablishmentModal";
import { Plus } from "lucide-react";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

export default function ListEstablishmentsPage() {
    useRoleGuard([UserRole.SUPERADMIN]);
  const { data, loading } = useListEstablishments();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Carregando estabelecimentos...</p>;
  }

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estabelecimentos</h1>
          <p className="text-gray-500 mt-1">Lista de todos os estabelecimentos cadastrados</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          <Plus size={18} />
          Cadastrar estabelecimento
        </button>
      </div>

      {/* Grid de Cards */}
      {data.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center text-gray-400">
          Nenhum estabelecimento encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((establishment) => (
            <EstablishmentCard
              key={establishment.id}
              establishment={establishment}
            />
          ))}
        </div>
      )}

      <CreateEstablishmentModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => window.location.reload()}
      />
    </div>
  );
}
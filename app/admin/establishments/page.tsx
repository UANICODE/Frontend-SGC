"use client";

import { CardEstablishment } from "@/components/admin/cards/CardEstablishment";
import { UserRole } from "@/enum/enum";
import { useAdminEstablishments } from "@/hooks/admin /useAdminEstablishments";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

export default function EstablishmentsPage() {

  // 🔒 Protege a página apenas para ADMIN e SUPERADMIN
  useRoleGuard([UserRole.ADMIN]);

  const { data, loading } = useAdminEstablishments();

  // ⚡ Loader centralizado
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Carregando estabelecimentos...</p>
      </div>
    );
  }

  // ✅ Mensagem caso não haja estabelecimentos
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        Nenhum estabelecimento cadastrado
      </div>
    );
  }

  return (
    <div className="p-8 bg-backgroundLight min-h-screen">
      <h1 className="text-2xl font-bold mb-8">
        Meus Estabelecimentos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((est) => (
          <CardEstablishment key={est.id} establishment={est} />
        ))}
      </div>
    </div>
  );
}
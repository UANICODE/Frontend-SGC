"use client";

import { CardEstablishment } from "@/components/admin/cards/CardEstablishment";
import { UserRole } from "@/enum/enum";
import { useAdminEstablishments } from "@/hooks/admin /useAdminEstablishments";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function EstablishmentsPage() {
  useRoleGuard([UserRole.ADMIN]);

  const router = useRouter();
  const { data, loading } = useAdminEstablishments();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Carregando seus negócios...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        Nenhum estabelecimento cadastrado
      </div>
    );
  }

  return (
    <div className="p-10 bg-gradient-to-br from-backgroundLight to-white min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Seus Estabelecimentos
          </h1>
          <p className="text-gray-500">
            Gerencie todos os seus negócios de forma simples e eficiente
          </p>
        </div>

        {/* CTA SUPER */}
        <button
          onClick={() => router.push("/admin/establishments/superdashboard")}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition"
        >
          <Sparkles className="w-5 h-5" />
          Super Gestão
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((est) => (
          <CardEstablishment key={est.id} establishment={est} />
        ))}
      </div>

    </div>
  );
}
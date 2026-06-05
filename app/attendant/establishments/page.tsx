"use client";

import { useAttendantEstablishments } from "@/hooks/attendant/useAttendantEstablishments";
import { EstablishmentCard } from "@/components/attendant/cards/EstablishmentCard";
import { PageLoader } from "@/components/ui/PageLoader";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";



export default function AttendantEstablishmentsPage() {
  useRoleGuard([UserRole.ATENDENTE]);
  const { data, loading } = useAttendantEstablishments();

  if (loading) return <PageLoader />;

  return (
    <div className="p-8 space-y-10 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Meus Estabelecimentos
        </h1>
        <p className="text-gray-500 mt-2">
          Selecione um estabelecimento para acessar o dashboard.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 text-lg">
            Nenhum estabelecimento encontrado.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {data.map((est) => (
            <EstablishmentCard
              key={est.id}
              establishment={est}
            />
          ))}
        </div>
      )}
    </div>
  );
}
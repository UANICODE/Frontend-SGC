"use client";

import { CardEstablishment } from "@/components/admin/cards/CardEstablishment";
import { useAdminEstablishments } from "@/hooks/admin /useAdminEstablishments";

export default function EstablishmentsPage() {
  const { data, loading } = useAdminEstablishments();

  if (loading) {
    return <div className="p-8">Carregando...</div>;
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
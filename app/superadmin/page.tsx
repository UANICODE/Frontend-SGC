"use client";

import { useSuperAdminDashboard } from "@/hooks/superadmin/useSuperAdminDashboard";

export default function SuperAdminDashboardPage() {
  const {
    loading,
    salesToday,
    activeEstablishments,
    inactiveEstablishments,
    usersByEstablishment,
  } = useSuperAdminDashboard();

  if (loading) return <p>Carregando dashboard...</p>;

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        Dashboard Global
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Card
          title="Estabelecimentos Ativos"
          value={activeEstablishments.length}
        />

        <Card
          title="Estabelecimentos Inativos"
          value={inactiveEstablishments.length}
        />

        <Card
          title="Total Usuários (Todos Estabelecimentos)"
          value={
            usersByEstablishment.reduce(
              (acc: number, item: any) =>
                acc + item.totalUsers,
              0
            )
          }
        />

      </div>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <p className="text-muted-foreground text-sm">
        {title}
      </p>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
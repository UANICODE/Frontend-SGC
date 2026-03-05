export function DashboardStatsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <StatCard
        title="Total Hoje"
        value="--"
      />

      <StatCard
        title="Total Geral"
        value="--"
      />

      <StatCard
        title="Estabelecimentos Ativos"
        value="--"
      />

      <StatCard
        title="Total Usuários"
        value="--"
      />

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
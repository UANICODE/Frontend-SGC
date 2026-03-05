"use client";

import { KpiCard } from "@/components/admin/cards/KpiCard";
import { useInventoryReport } from "@/hooks/admin /useInventoryReport";
import { useSalesReport } from "@/hooks/admin /useSalesReport";
import { formatCurrency } from "@/lib/format";

export default function DashboardHome({ params }: any) {
  const { data: sales } = useSalesReport(params.establishmentId);
  const { data: inventory } = useInventoryReport(params.establishmentId);

  const stockControlPercentage =
    inventory && inventory.totalProducts > 0
      ? Math.round(
          (inventory.totalStockControlledProducts /
            inventory.totalProducts) *
            100
        )
      : 0;

  if (!sales || !inventory) {
    return (
      <div className="p-8">
        <p className="text-textSecondaryLight">
          Carregando relatório...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* CABEÇALHO DO RELATÓRIO */}
      <div className="bg-white border border-borderLight rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-primary">
          Relatório Financeiro
        </h2>

        <p className="text-sm text-textSecondaryLight mt-2">
          Período: {new Date(sales.startDate).toLocaleDateString()} até{" "}
          {new Date(sales.endDate).toLocaleDateString()}
        </p>

        <p className="text-xs text-textSecondaryLight mt-1">
          Gerado em: {new Date(sales.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* KPIs FINANCEIROS */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Performance Financeira
        </h3>

        <div className="grid grid-cols-4 gap-6">
          <KpiCard
            title="Receita Bruta"
            value={formatCurrency(sales.totalSales)}
          />

          <KpiCard
            title="Cancelado"
            value={formatCurrency(sales.totalCancelled)}
          />

          <KpiCard
            title="Receita Líquida"
            value={formatCurrency(sales.netTotal)}
          />

          <KpiCard
            title="Ticket Médio"
            value={formatCurrency(sales.averageTicket)}
          />
        </div>
      </div>

      {/* KPIs OPERACIONAIS */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Indicadores Operacionais
        </h3>

        <div className="grid grid-cols-4 gap-6">
          <KpiCard
            title="Total Transações"
            value={sales.totalTransactions}
          />

          <KpiCard
            title="Total Produtos"
            value={inventory.totalProducts}
          />

          <KpiCard
            title="Quantidade em Estoque"
            value={inventory.totalStockQuantity}
          />

          <KpiCard
            title="Produtos com Controle (%)"
            value={`${stockControlPercentage}%`}
          />
        </div>
      </div>

      {/* INFORMAÇÕES DO ESTABELECIMENTO */}
      <div className="bg-white border border-borderLight rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-primary">
          Informações do Estabelecimento
        </h3>

        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Nome:</strong> {inventory.establishmentName}</p>
          <p><strong>Endereço:</strong> {inventory.address}</p>
          <p><strong>Telefone:</strong> {inventory.phone}</p>
          <p>
            <strong>Relatório de Estoque gerado em:</strong>{" "}
            {new Date(inventory.generatedAt).toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  );
}
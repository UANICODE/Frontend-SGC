"use client";

import { KpiCard } from "@/components/admin/cards/KpiCard";
import { useInventoryReport } from "@/hooks/admin /useInventoryReport";
import { useSalesReport } from "@/hooks/admin /useSalesReport";
import { formatCurrency } from "@/lib/format";
import { useParams } from "next/navigation";

export default function DashboardHome() {
  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const { data: sales, loading: salesLoading } = useSalesReport(establishmentId);
  const { data: inventory, loading: inventoryLoading } = useInventoryReport(params.establishmentId);

  const loading = salesLoading || inventoryLoading;

  if (loading || !sales || !inventory) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-center">Carregando Resumo...</p>
        </div>
      </div>
    );
  }

  const stockControlPercentage =
    inventory.totalProducts > 0
      ? Math.round((inventory.totalStockControlledProducts / inventory.totalProducts) * 100)
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn px-4 sm:px-6 lg:px-10">

      {/* CABEÇALHO DO RELATÓRIO */}
      <div className="bg-white border border-borderLight rounded-xl p-4 sm:p-6 shadow-sm text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary">
          Resumo Financeiro
        </h2>

        <p className="text-sm sm:text-base text-textSecondaryLight mt-1">
          Período: {new Date(sales.startDate).toLocaleDateString()} até{" "}
          {new Date(sales.endDate).toLocaleDateString()}
        </p>

        <p className="text-xs sm:text-sm text-textSecondaryLight mt-1">
          Processado em: {new Date(sales.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* KPIs FINANCEIROS */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
          Performance Financeira
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Receita Bruta" value={formatCurrency(sales.totalSales ?? 0)} />
          <KpiCard title="Cancelado" value={formatCurrency(sales.totalCancelled ?? 0)} />
          <KpiCard title="Receita Líquida" value={formatCurrency(sales.netTotal ?? 0)} />
          <KpiCard title="Ticket Médio" value={formatCurrency(sales.averageTicket ?? 0)} />
        </div>
      </div>

      {/* KPIs OPERACIONAIS */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
          Indicadores Operacionais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Total Transações" value={sales.totalTransactions ?? 0} />
          <KpiCard title="Total Produtos" value={inventory.totalProducts ?? 0} />
          <KpiCard title="Quantidade em Estoque" value={inventory.totalStockQuantity ?? 0} />
          <KpiCard title="Produtos com Controle (%)" value={`${stockControlPercentage}%`} />
        </div>
      </div>

      {/* INFORMAÇÕES DO ESTABELECIMENTO */}
      <div className="bg-white border border-borderLight rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 text-center sm:text-left">
          Estabelecimento
        </h3>

        <div className="mt-2 space-y-2 text-sm sm:text-base">
          <p><strong>Nome:</strong> {inventory.establishmentName ?? "-"}</p>
          <p><strong>Endereço:</strong> {inventory.address ?? "-"}</p>
          <p><strong>Telefone:</strong> {inventory.phone ?? "-"}</p>
          
        </div>
      </div>

    </div>
  );
}
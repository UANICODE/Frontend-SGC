"use client";

import { KpiCard } from "@/components/admin/cards/KpiCard";
import { useSalesReport } from "@/hooks/admin /useSalesReport";
import { useInventoryReport } from "@/hooks/admin /useInventoryReport";
import { formatCurrency } from "@/lib/format";
import { useParams } from "next/navigation";
import { DollarSign, XCircle, TrendingUp, CreditCard, Package, Layers, CheckCircle, Phone, MapPin, Store,BarChart3, Calendar, Clock } from "lucide-react";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";


export default function DashboardHome() {
    useRoleGuard([UserRole.ADMIN]);
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

      {/* CABEÇALHO DO RELATÓRIO (MODERNO) */}
<div className="bg-white border border-borderLight rounded-2xl p-6 shadow-sm">
  
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* Lado esquerdo */}
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        <BarChart3 size={24} />
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-primary">
          Resumo Financeiro
        </h2>
        <p className="text-sm text-gray-500">
          Visão geral do desempenho do negócio
        </p>
      </div>
    </div>

    {/* Badge de período */}
    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-700">
      <Calendar size={16} />
      {new Date(sales.startDate).toLocaleDateString()} →{" "}
      {new Date(sales.endDate).toLocaleDateString()}
    </div>
  </div>

  {/* Linha inferior */}
  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
    
    <div className="flex items-center gap-2">
      <Clock size={14} />
      Gerado em: {new Date(sales.generatedAt).toLocaleString()}
    </div>

    <div className="flex items-center gap-2 text-green-600 font-medium">
      <TrendingUp size={16} />
      Sistema atualizado
    </div>

  </div>
</div>

      {/* KPIs FINANCEIROS */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
          Performance Financeira
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Receita Bruta" value={formatCurrency(sales.totalSales ?? 0)} icon={DollarSign} />
          <KpiCard title="Cancelado" value={formatCurrency(sales.totalCancelled ?? 0)} icon={XCircle} />
          <KpiCard title="Receita Líquida" value={formatCurrency(sales.netTotal ?? 0)} icon={TrendingUp} />
          <KpiCard title="Ticket Médio" value={formatCurrency(sales.averageTicket ?? 0)} icon={CreditCard} />
        </div>
      </div>

      {/* KPIs OPERACIONAIS */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
          Indicadores Operacionais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Total Transações" value={sales.totalTransactions ?? 0} icon={CreditCard} />
          <KpiCard title="Total Produtos" value={inventory.totalProducts ?? 0} icon={Package} />
          <KpiCard title="Quantidade em Estoque" value={inventory.totalStockQuantity ?? 0} icon={Layers} />
          <KpiCard title="Produtos com Controle (%)" value={`${stockControlPercentage}%`} icon={CheckCircle} />
        </div>
      </div>

     {/* INFORMAÇÕES DO ESTABELECIMENTO */}
<div className="bg-white border border-borderLight rounded-2xl p-6 shadow-sm">
  <h3 className="text-lg sm:text-xl font-semibold text-primary mb-6 text-center sm:text-left">
    Informações do Estabelecimento
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

    {/* Nome */}
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Store size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">Nome</p>
        <p className="font-semibold text-gray-800">
          {inventory.establishmentName ?? "-"}
        </p>
      </div>
    </div>

    {/* Endereço */}
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
        <MapPin size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500">Endereço</p>
        <p className="font-semibold text-gray-800">
          {inventory.address ?? "-"}
        </p>
      </div>
    </div>

    {/* Telefone */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
        <div className="p-2 rounded-lg bg-green-100 text-green-600">
          <Phone size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Telefone</p>
          <p className="font-semibold text-gray-800">
            {inventory.phone ?? "-"}
          </p>
        </div>
      </div>

    </div>
  </div>

    </div>
  );
}
"use client";

import { SalesChart } from "@/components/admin/SalesChart";
import { SuperProductSearch } from "@/components/admin/SuperProductSearch";
import { DashboardFooter } from "@/components/ui/DashboardFooter";
import { useSuperDashboard } from "@/hooks/admin /useSuperDashboard";
import { useSuperSales } from "@/hooks/admin /useSuperSales";
import { Package, DollarSign, Store, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperDashboardPage() {
  const { data, loading } = useSuperDashboard();
  const { data: salesData } = useSuperSales();
  const router = useRouter();

if (loading) {
  return (
    <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-center">Carregando Dashboard...</p>
        </div>
      </div>
  );
}
  if (!data) return <p className="p-8">Erro ao carregar</p>;

  return (
    <div className="p-10 space-y-10 bg-gradient-to-br from-white to-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Super Gestão
          </h1>
          <p className="text-gray-500">
            Visão completa e inteligente do seu negócio
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/establishments")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Meus Estabelecimentos
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card icon={<Package />} title="Stock Total" value={data.totalStock} color="bg-blue-100 text-blue-600" />
        <Card icon={<DollarSign />} title="Vendas" value={data.totalSales} color="bg-green-100 text-green-600" />
        <Card icon={<Store />} title="Estabelecimentos" value={data.totalEstablishments} color="bg-purple-100 text-purple-600" />
        <Card icon={<AlertTriangle />} title="Baixo Stock" value={data.lowStockProducts} color="bg-red-100 text-red-600" />

      </div>

      {/* GRÁFICO */}
      <SalesChart data={salesData} />

      {/* PESQUISA */}
      <SuperProductSearch />

    </div>
  );
}

function Card({ icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">

      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>

    </div>
    
  );
  
}
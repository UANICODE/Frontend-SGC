// app/admin/dashboard/[establishmentId]/costs/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Wallet, TrendingUp, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCostDashboard } from "@/hooks/admin/cost/useCostDashboard";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { CostDashboardCards } from "@/components/admin/cards/CostDashboardCards";
import { CostByCategoryChart } from "@/components/admin/CostByCategoryChart";
import { CostByPeriodChart } from "@/components/admin/CostByPeriodChart";
import { MonthlyEvolutionChart } from "@/components/admin/MonthlyEvolutionChart";
import { TopCategoriesList } from "@/components/admin/TopCategoriesList";

export default function CostsPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId;

    const router = useRouter();
    const [period, setPeriod] = useState<{ startDate?: string; endDate?: string }>({});

    const { data, loading } = useCostDashboard(establishmentId ?? "");

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Nenhum dado disponível</p>
                <p className="text-sm text-gray-400 mt-1">
                    Registre alguns custos para ver o dashboard
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative px-8 py-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Wallet className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    Dashboard de Custos
                                </h1>
                                <p className="text-white/80 text-sm mt-1">
                                    Análise completa dos custos do estabelecimento
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push(`/admin/dashboard/${establishmentId}/costs/general`)}
                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Ver Todos os Custos
                            </button>
                            <button
                                onClick={() => router.push(`/admin/dashboard/${establishmentId}/costs/categories`)}
                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Gerenciar Categorias
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30" />
            </div>

            {/* CARDS */}
            <CostDashboardCards
                totalExpenses={data.totalExpenses}
                monthlyAverage={data.monthlyAverage}
                monthlyChange={data.monthlyChange}
                periodStart={data.periodStart}
                periodEnd={data.periodEnd}
            />

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Custos por Categoria */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Custos por Categoria</h3>
                    <CostByCategoryChart data={data.byCategory} />
                </div>

                {/* Custos por Período */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Custos por Periodicidade</h3>
                    <CostByPeriodChart data={data.byPeriod} />
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução Mensal dos Custos</h3>
                <MonthlyEvolutionChart data={data.monthlyEvolution} />
            </div>

            {/* Top Categorias */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Categorias com Maiores Custos</h3>
                <TopCategoriesList categories={data.topCategories} totalExpenses={data.totalExpenses} />
            </div>
        </div>
    );
}
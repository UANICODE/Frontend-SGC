"use client";

import { useEffect, useState } from "react";
import { KpiCard } from "@/components/admin/cards/KpiCard";
import { ProfitabilityCard } from "@/components/admin/cards/ProfitabilityCard";
import { MarginCard } from "@/components/admin/cards/MarginCard";
import { StockValueCard } from "@/components/admin/cards/StockValueCard";
import { formatCurrency } from "@/lib/format";
import { useParams } from "next/navigation";
import {
    DollarSign,
    TrendingUp,
    Package,
    Layers,
    CheckCircle,
    Phone,
    MapPin,
    Store,
    BarChart3,
    TrendingDown,
    Award,
    AlertTriangle
} from "lucide-react";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useStockReport } from "@/hooks/report/useStockReport";
import { useFinancialDashboard } from "@/hooks/report/useFinancialDashboard";
import { ProductRankingList } from "@/components/admin/ProductRankingList";

export default function DashboardHome() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams<{ establishmentId: string }>();
    const establishmentId = params.establishmentId;

    // Hooks
    const { data: inventory, loading: inventoryLoading, generate } = useStockReport();
    const { data: financial, loading: financialLoading, refresh: refreshFinancial } = useFinancialDashboard(establishmentId);

    const [isRefreshing, setIsRefreshing] = useState(false);

    // Carregar dados
    useEffect(() => {
        if (establishmentId) {
            if (!inventory) {
                generate(establishmentId);
            }
        }
    }, [establishmentId, inventory, generate]);

    const loading = inventoryLoading || financialLoading;

    if (loading || !inventory || !financial) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 text-center">Carregando Resumo Financeiro...</p>
                </div>
            </div>
        );
    }

    const stockControlPercentage =
        inventory.totalProducts > 0
            ? Math.round((inventory.totalStockControlledProducts / inventory.totalProducts) * 100)
            : 0;

    return (
        <div className="space-y-8 animate-fadeIn px-4 sm:px-6 lg:px-10 pb-10">
            {/* CABEÇALHO */}
            <div className="bg-white border border-borderLight rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 text-primary">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-primary">
                                Dashboard Financeiro
                            </h2>
                            <p className="text-sm text-gray-500">
                                {financial.currentMonth} • Análise de lucratividade e estoque
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <TrendingUp size={16} />
                            Dados atualizados
                        </div>
                        <button
                            onClick={() => {
                                setIsRefreshing(true);
                                Promise.all([refreshFinancial(), generate(establishmentId)]).finally(() => {
                                    setIsRefreshing(false);
                                });
                            }}
                            disabled={isRefreshing}
                            className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                        >
                            {isRefreshing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Atualizando...
                                </>
                            ) : (
                                "Atualizar"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* CARDS DE LUCRO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProfitabilityCard
                    title="Lucro Bruto Mensal"
                    value={financial.monthlyGrossProfit}
                    previousValue={financial.previousMonthGrossProfit}
                    change={financial.monthlyChange}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="green"
                    subtitle={`${financial.currentMonth}`}
                />
                <MarginCard
                    title="Margem Média"
                    value={financial.averageMargin}
                    subtitle="Média de todos os produtos"
                />
                <StockValueCard
                    purchaseValue={financial.stockValuePurchase}
                    saleValue={financial.stockValueSale}
                />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Lucro que está esperando no stock atual</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {formatCurrency(financial.potentialProfit)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {financial.stockValuePurchase > 0
                                    ? `+${((financial.potentialProfit / financial.stockValuePurchase) * 100).toFixed(1)}% sobre compra`
                                    : "Sem estoque"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIS OPERACIONAIS */}
            <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
                    Indicadores Operacionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <KpiCard
                        title="Total de Produtos no Estabelecimento"
                        value={inventory.totalProducts ?? 0}
                        icon={Package}
                    />
                    <KpiCard
                        title="Stock Geral"
                        value={inventory.totalStockQuantity ?? 0}
                        icon={Layers}
                    />
                    <KpiCard
                        title="Produtos com Controle (%)"
                        value={`${stockControlPercentage}%`}
                        icon={CheckCircle}
                    />
                </div>
            </div>

            {/* RANKINGS DE PRODUTOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductRankingList
                    products={financial.topProfitable}
                    type="top"
                    title="🏆 Produtos Mais Lucrativos"
                />
                <ProductRankingList
                    products={financial.lowestProfitable}
                    type="lowest"
                    title="📉 Produtos Menos Lucrativos"
                />
            </div>

            {/* PRODUTOS COM MARGEM NEGATIVA */}
            {financial.negativeMarginProducts.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-red-600">
                            ⚠️ Produtos com Margem Negativa
                        </h3>
                        <span className="text-xs text-red-400 bg-red-50 px-2 py-1 rounded-full">
                            {financial.negativeMarginProducts.length} produtos
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {financial.negativeMarginProducts.slice(0, 6).map((product) => (
                            <div
                                key={product.productId}
                                className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{product.productName}</p>
                                        <p className="text-xs text-gray-400">{product.categoryName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-600">
                                            -{formatCurrency(Math.abs(product.grossProfit))}
                                        </p>
                                        <p className="text-xs text-red-500">{product.margin.toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                                    <span>Vendidos: {product.quantitySold}</span>
                                    <span>•</span>
                                    <span>Compra: {formatCurrency(product.purchasePrice)}</span>
                                    <span>•</span>
                                    <span>Venda: {formatCurrency(product.salePrice)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {financial.negativeMarginProducts.length > 6 && (
                        <p className="text-center text-sm text-gray-400 mt-2">
                            + {financial.negativeMarginProducts.length - 6} produtos com margem negativa
                        </p>
                    )}
                </div>
            )}

            {/* INFORMAÇÕES DO ESTABELECIMENTO */}
            <div className="bg-white border border-borderLight rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-6 text-center sm:text-left">
                    Informações do Estabelecimento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Store size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Nome</p>
                            <p className="font-semibold text-gray-800">
                                {inventory.establishmentName ?? financial.establishmentName ?? "-"}
                            </p>
                        </div>
                    </div>
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
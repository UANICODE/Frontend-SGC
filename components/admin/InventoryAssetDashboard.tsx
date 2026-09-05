// components/admin/dashboard/InventoryAssetDashboard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
    Package, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle, 
    CheckCircle, 
    Clock, 
    DollarSign,
    Box,
    Tag,
    Wrench,
    Plus,
    Eye,
    ArrowRight,
    FileText,
    List,
    MoreHorizontal,
    ClipboardList,
    Loader2
} from "lucide-react";
import { CombinedInventoryAssetDashboard } from "@/types/admin/dashboard";
import { DropdownMenu } from "@/components/admin/DropdownMenu";
import { useToast } from "@/ context/ToastContext";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useStockReport } from "@/hooks/report/useStockReport";
import { generateStockPDF } from "@/utils/stockReportGenerator";
import { generateInventoryReportPDF } from "@/utils/inventoryReportGenerator";

interface Props {
    data: CombinedInventoryAssetDashboard;
    establishmentId: string;
    primaryColor: string;
    secondaryColor: string;
}

export function InventoryAssetDashboard({ data, establishmentId, primaryColor, secondaryColor }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const { data: establishment } = useEstablishment(establishmentId);
    const { generate, loading: loadingReport } = useStockReport();

    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const isPositive = (value: number) => value >= 0;



const handleInventoryReport = async () => {
    try {
        const reportData = await generate(establishmentId);
        
        if (!reportData) {
            showToast("Erro ao gerar relatório de inventário", "error");
            return;
        }

        // 🔥 Verificar se os dados estão corretos
    //   console.log("📊 Dados do relatório:", reportData);

        const pdfDataUrl = generateStockPDF(reportData, {
            establishmentName: establishment?.tradeName || "Sistema",
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
        });

        // 🔥 Verificar se o PDF foi gerado
        if (!pdfDataUrl) {
            showToast("Erro ao gerar PDF", "error");
            return;
        }

        const link = document.createElement("a");
        link.download = `Relatorio_Stock_${new Date().toISOString().split("T")[0]}.pdf`;
        link.href = pdfDataUrl;
        link.click();

        showToast("Relatório de stock gerado com sucesso!", "success");
    } catch (error) {
       // console.error("Erro ao gerar relatório de stock:", error);
        showToast("Erro ao gerar relatório de stock", "error");
    }
};


    // 🔥 FUNÇÃO PARA GERAR RELATÓRIO DE STOCK
    const handleStockReport = async () => {
        try {
            const reportData = await generate(establishmentId);
            
            if (!reportData) {
                showToast("Erro ao gerar relatório de stock", "error");
                return;
            }

            const pdfDataUrl = generateStockPDF(reportData, {
                establishmentName: establishment?.tradeName || "Sistema",
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
            });

            const link = document.createElement("a");
            link.download = `Relatorio_Stock_${new Date().toISOString().split("T")[0]}.pdf`;
            link.href = pdfDataUrl;
            link.click();

            showToast("Relatório de stock gerado com sucesso!", "success");
        } catch (error) {
           // console.error("Erro ao gerar relatório de stock:", error);
            showToast("Erro ao gerar relatório de stock", "error");
        }
    };

    // 🔥 ITENS DO DROPDOWN DE INVENTÁRIOS
    const inventoryDropdownItems = [
        {
            label: "Novo Inventário",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories?action=create`),
            variant: 'success' as const,
        },
        {
            label: "Ver Inventários",
            icon: <Eye className="w-4 h-4" />,
            onClick: () => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`),
        },
        { 
        label: "Relatório de Stock atual",  // 🔥 NOVO
        icon: <FileText className="w-4 h-4" />,
        onClick: handleInventoryReport,
    },
  
    ];

    // 🔥 ITENS DO DROPDOWN DE ATIVOS
    const assetsDropdownItems = [
        {
            label: "Novo Ativo",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets?action=create`),
            variant: 'success' as const,
        },
        {
            label: "Ver Ativos",
            icon: <Eye className="w-4 h-4" />,
            onClick: () => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets`),
        },
        {
            label: "Categorias de Ativos",
            icon: <Tag className="w-4 h-4" />,
            onClick: () => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets-categories`),
        },

    ];


    return (
        <div className="space-y-6">
            {/* ============================================================
            🔥 AÇÕES RÁPIDAS NO TOPO
            ============================================================ */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <span className="text-sm font-medium text-gray-500 mr-2 flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    Ações Rápidas:
                </span>
                
           
                {/* Dropdown Inventários */}
                <DropdownMenu
                    label="Inventários"
                    icon={<List className="w-4 h-4" />}
                    items={inventoryDropdownItems}
                    variant="primary"
                />

                {/* Dropdown Ativos */}
                <DropdownMenu
                    label="Ativos"
                    icon={<Box className="w-4 h-4" />}
                    items={assetsDropdownItems}
                    variant="secondary"
                />

            </div>

            {/* ============================================================
            CARDS DE RESUMO - INVENTÁRIOS
            ============================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <DashboardCard
                    title="Total"
                    value={data.inventory.totalInventories}
                    icon={<Package className="w-5 h-5" />}
                    color="primary"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                />
                <DashboardCard
                    title="Abertos"
                    value={data.inventory.openInventories}
                    icon={<Clock className="w-5 h-5" />}
                    color="yellow"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                />
                <DashboardCard
                    title="Em Contagem"
                    value={data.inventory.countingInventories}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="blue"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                />
                <DashboardCard
                    title="Revisão"
                    value={data.inventory.reviewInventories}
                    icon={<AlertCircle className="w-5 h-5" />}
                    color="orange"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                />
                <DashboardCard
                    title="Aprovados"
                    value={data.inventory.approvedInventories}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="green"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                />
            </div>

            {/* ============================================================
            ÚLTIMO INVENTÁRIO
            ============================================================ */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-700">Último Inventário</h3>
                        {data.inventory.lastInventory ? (
                            <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">{data.inventory.lastInventory.type}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {data.inventory.lastInventory.status}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    Iniciado em {formatDate(data.inventory.lastInventory.startDate)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {data.inventory.lastInventory.totalItems} itens • {data.inventory.lastInventory.itemsWithDifference} com diferença
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 mt-2">Nenhum inventário realizado</p>
                        )}
                    </div>
                    <button
                        onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        Ver todos <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Perdas */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Perdas Totais</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(data.inventory.totalLossesFromInventory)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Itens Perdidos</p>
                        <p className="text-lg font-bold text-orange-600">{data.inventory.totalLostItems}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Variação Mensal</p>
                        <p className={`text-lg font-bold flex items-center gap-1 ${isPositive(data.inventory.comparison.percentageChange) ? 'text-red-600' : 'text-green-600'}`}>
                            {isPositive(data.inventory.comparison.percentageChange) ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {Math.abs(data.inventory.comparison.percentageChange).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================================
            CARDS DE RESUMO - ATIVOS
            ============================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardCard
                    title="Total Ativos"
                    value={data.assets.totalAssets}
                    icon={<Box className="w-5 h-5" />}
                    color="primary"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets`)}
                />
                <DashboardCard
                    title="Categorias"
                    value={data.assets.totalCategories}
                    icon={<Tag className="w-5 h-5" />}
                    color="purple"
                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets-categories`)}
                />
                <DashboardCard
                    title="Valor Total"
                    value={formatCurrency(data.assets.totalValue)}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="green"
                />
                <DashboardCard
                    title="Manutenções"
                    value={data.assets.totalMaintenances}
                    icon={<Wrench className="w-5 h-5" />}
                    color="blue"
                />
            </div>

            {/* ============================================================
            TOP ATIVOS E STATUS
            ============================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status dos Ativos */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Status dos Ativos</h3>
                    <div className="space-y-3">
                        <StatusBar label="Novos" value={data.assets.newAssets} total={data.assets.totalAssets} color="bg-blue-500" />
                        <StatusBar label="Bom" value={data.assets.goodAssets} total={data.assets.totalAssets} color="bg-green-500" />
                        <StatusBar label="Usado" value={data.assets.usedAssets} total={data.assets.totalAssets} color="bg-yellow-500" />
                        <StatusBar label="Danificado" value={data.assets.damagedAssets} total={data.assets.totalAssets} color="bg-orange-500" />
                        <StatusBar label="Inutilizável" value={data.assets.unusableAssets} total={data.assets.totalAssets} color="bg-red-500" />
                        <StatusBar label="Descartado" value={data.assets.disposedAssets} total={data.assets.totalAssets} color="bg-gray-400" />
                    </div>
                </div>

                {/* Top Ativos por Valor */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Top Ativos por Valor</h3>
                    {data.assets.topAssetsByValue.length > 0 ? (
                        <div className="space-y-3">
                            {data.assets.topAssetsByValue.map((asset, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{asset.name}</p>
                                        <p className="text-xs text-gray-400">{asset.code} • {asset.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-primary">{formatCurrency(asset.value)}</p>
                                        <p className="text-xs text-gray-400">Qtd: {asset.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-8">Nenhum ativo cadastrado</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTES AUXILIARES (mantidos iguais)
// ============================================================

interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: 'primary' | 'green' | 'yellow' | 'orange' | 'blue' | 'purple';
    onClick?: () => void;
}

function DashboardCard({ title, value, icon, color, onClick }: DashboardCardProps) {
    const colors = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
        <div 
            className={`bg-white rounded-2xl shadow-lg border p-5 ${onClick ? 'cursor-pointer hover:shadow-xl transition-all hover:-translate-y-0.5' : ''}`}
            onClick={onClick}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{value}</p>
            <p className="text-xs text-gray-400">{title}</p>
        </div>
    );
}

interface StatusBarProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

function StatusBar({ label, value, total, color }: StatusBarProps) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
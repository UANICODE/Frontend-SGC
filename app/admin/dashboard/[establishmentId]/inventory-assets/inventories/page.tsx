// app/admin/dashboard/[establishmentId]/inventory-assets/inventories/page.tsx
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus, RefreshCw, Package, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useInventories } from "@/hooks/admin/inventory/useInventories";
import { useCreateInventory } from "@/hooks/admin/inventory/useCreateInventory";
import { useToast } from "@/ context/ToastContext";
import { CreateInventoryModal } from "@/components/admin/modals/CreateInventoryModal";
import { ReportButton } from "@/components/admin/ReportButton";
import { useInventoriesReport } from "@/hooks/report/useInventoriesReport";
import { generateInventoriesPDF } from "@/utils/pdfGenerator";


export default function InventoriesPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();

    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0] ?? ""
        : params.establishmentId ?? "";

    const { data: establishment } = useEstablishment(establishmentId);
    const { data, loading, totalElements, totalPages, page, goToPage, refresh } = useInventories(establishmentId);
    const { execute: createInventory, loading: creating } = useCreateInventory();

    const [showCreateModal, setShowCreateModal] = useState(searchParams.get('action') === 'create');

    const primaryColor = establishment?.primaryColor || "#4F46E5";
    const secondaryColor = establishment?.secondaryColor || "#7C3AED";
    const { fetch: fetchInventoriesReport, loading: reportLoading } = useInventoriesReport(establishmentId);

const handleGenerateReport = async () => {
    try {
        const reportData = (await fetchInventoriesReport()) ?? [];

        const pdfDataUrl = generateInventoriesPDF(reportData, {
            title: "Relatório de Inventários",
            subtitle: "Histórico completo de inventários realizados",
            establishmentName: establishment?.tradeName || "Sistema",
            primaryColor: establishment?.primaryColor || "#4F46E5",
            secondaryColor: establishment?.secondaryColor || "#7C3AED",
        });

        const link = document.createElement("a");
        link.download = `Relatorio_Inventarios_${new Date().toISOString().split("T")[0]}.pdf`;
        link.href = pdfDataUrl;
        link.click();

        showToast("Relatório gerado com sucesso!", "success");
    } catch (error) {
        // Error handled by hook
    }
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

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'ABERTO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'CONTAGEM': 'bg-blue-100 text-blue-700 border-blue-200',
            'REVISAO': 'bg-orange-100 text-orange-700 border-orange-200',
            'APROVADO': 'bg-green-100 text-green-700 border-green-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventários</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie os inventários do estabelecimento</p>
                </div>
                <div className="flex gap-3">
                    <ReportButton
                        onClick={handleGenerateReport}
                        loading={reportLoading}
                        label="Relatório de Inventários"
                        variant="primary"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={refresh}
                            className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Novo Inventário
                        </button>
                    </div>
                </div>
            </div>

            {/* TABELA */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500">Carregando inventários...</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum inventário encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">Clique em "Novo Inventário" para começar</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-left font-semibold text-gray-600">ID</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Tipo</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Data Início</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Responsável</th>
                                        <th className="p-4 text-center font-semibold text-gray-600">Itens</th>
                                        <th className="p-4 text-center font-semibold text-gray-600">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((inventory) => (
                                        <tr key={inventory.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <span className="font-mono text-xs text-gray-500">
                                                    {inventory.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                                    {inventory.typeName}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(inventory.statusName)}`}>
                                                    {inventory.statusName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">{formatDate(inventory.startDate)}</td>
                                            <td className="p-4 text-gray-600">{inventory.responsibleUserName}</td>
                                            <td className="p-4 text-center text-gray-600">{inventory.items?.length || 0}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories/${inventory.id}`)}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 border-t border-gray-100">
                                <span className="text-sm text-gray-400">
                                    Total: {totalElements} inventários
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => goToPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-3 py-1 bg-primary/10 rounded-lg text-sm font-medium">
                                        {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => goToPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* MODAL CRIAR */}
            {showCreateModal && (
                <CreateInventoryModal
                    establishmentId={establishmentId}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Inventário criado com sucesso!", "success");
                    }}
                />
            )}
        </div>
    );
}
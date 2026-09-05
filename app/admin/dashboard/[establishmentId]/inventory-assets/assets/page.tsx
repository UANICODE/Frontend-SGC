// app/admin/dashboard/[establishmentId]/inventory-assets/assets/page.tsx
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus, RefreshCw, Box, Edit, Trash2, Wrench, AlertTriangle, Filter } from "lucide-react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useAssets } from "@/hooks/admin/asset/useAssets";
import { useAssetCategories } from "@/hooks/admin/asset/useAssetCategories";
import { useCreateAsset } from "@/hooks/admin/asset/useCreateAsset";
import { useToast } from "@/ context/ToastContext";
import { CreateAssetModal } from "@/components/admin/modals/CreateAssetModal";
import { EditAssetModal } from "@/components/admin/modals/EditAssetModal";;
import { RegisterMaintenanceModal } from "@/components/admin/modals/RegisterMaintenanceModal";
import { DisposeAssetModal } from "@/components/admin/modals/DisposeAssetModal";
import { useAssetsReport } from "@/hooks/report/useAssetsReport";
import { ReportButton } from "@/components/admin/ReportButton";
import { generateAssetsPDF } from "@/utils/pdfGenerator";

export default function AssetsPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();

    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId;

    if (!establishmentId) return null;

    const { data: establishment } = useEstablishment(establishmentId);
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const { data, loading, totalElements, totalPages, page, goToPage, refresh } = useAssets(establishmentId, categoryFilter || undefined);
    const { data: categories } = useAssetCategories(establishmentId, true);

    const [showCreateModal, setShowCreateModal] = useState(searchParams.get('action') === 'create');
    const [editingAsset, setEditingAsset] = useState<any>(null);
    const [maintenanceAsset, setMaintenanceAsset] = useState<any>(null);
    const [disposingAsset, setDisposingAsset] = useState<any>(null);

    const primaryColor = establishment?.primaryColor || "#4F46E5";
    const secondaryColor = establishment?.secondaryColor || "#7C3AED";
    const { fetch: fetchAssetsReport, loading: reportLoading } = useAssetsReport(establishmentId);

const handleGenerateReport = async () => {
    try {
        const data = await fetchAssetsReport();

        const pdfDataUrl = generateAssetsPDF(data ?? [], {
            title: "Relatório de Ativos",
            subtitle: "Lista completa de todos os ativos do estabelecimento",
            establishmentName: establishment?.tradeName || "Sistema",
            primaryColor: establishment?.primaryColor || "#4F46E5",
            secondaryColor: establishment?.secondaryColor || "#7C3AED",
        });

        const link = document.createElement("a");
        link.download = `Relatorio_Ativos_${new Date().toISOString().split("T")[0]}.pdf`;
        link.href = pdfDataUrl;
        link.click();

        showToast("Relatório gerado com sucesso!", "success");
    } catch (error) {
        // Error handled by hook
    }
};


    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'NOVO': 'bg-blue-100 text-blue-700 border-blue-200',
            'BOM': 'bg-green-100 text-green-700 border-green-200',
            'USADO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'DANIFICADO': 'bg-orange-100 text-orange-700 border-orange-200',
            'INUTILIZÁVEL': 'bg-red-100 text-red-700 border-red-200',
            'VENDIDO': 'bg-gray-100 text-gray-600 border-gray-200',
            'DESCARTADO': 'bg-gray-100 text-gray-600 border-gray-200',
            'PERDIDO': 'bg-red-100 text-red-600 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Ativos</h1>
                    <p className="text-sm text-gray-400 mt-1">Gerencie o patrimônio do estabelecimento</p>
                </div>
                <div className="flex gap-3">
                    <ReportButton
                        onClick={handleGenerateReport}
                        loading={reportLoading}
                        label="Relatório de Ativos"
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
                            onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets-categories`)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Categorias
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Novo Ativo
                        </button>
                    </div>
                </div>
            </div>

            {/* FILTRO POR CATEGORIA */}
            {categories.length > 0 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Filtrar por categoria:</span>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                    >
                        <option value="">Todas</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* TABELA */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500">Carregando ativos...</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum ativo encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">Clique em "Novo Ativo" para começar</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-left font-semibold text-gray-600">Código</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Nome</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Categoria</th>
                                        <th className="p-4 text-center font-semibold text-gray-600">Qtd</th>
                                        <th className="p-4 text-right font-semibold text-gray-600">Valor</th>
                                        <th className="p-4 text-left font-semibold text-gray-600">Localização</th>
                                        <th className="p-4 text-center font-semibold text-gray-600">Status</th>
                                        <th className="p-4 text-center font-semibold text-gray-600">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((asset) => (
                                        <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono text-xs text-gray-500">{asset.code}</td>
                                            <td className="p-4 font-medium text-gray-800">{asset.name}</td>
                                            <td className="p-4">
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                    {asset.categoryName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">{asset.quantity}</td>
                                            <td className="p-4 text-right font-medium text-primary">
                                                {formatCurrency(asset.purchaseValue)}
                                            </td>
                                            <td className="p-4 text-gray-600">{asset.location}</td>
                                            <td className="p-4 text-center">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(asset.status)}`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => setEditingAsset(asset)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setMaintenanceAsset(asset)}
                                                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                                                        title="Manutenção"
                                                    >
                                                        <Wrench className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDisposingAsset(asset)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                        title="Baixa"
                                                    >
                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
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
                                    Total: {totalElements} ativos
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

            {/* MODAIS */}
            {showCreateModal && (
                <CreateAssetModal
                    establishmentId={establishmentId}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Ativo criado com sucesso!", "success");
                    }}
                />
            )}

            {editingAsset && (
                <EditAssetModal
                    asset={editingAsset}
                    establishmentId={establishmentId}
                    onClose={() => setEditingAsset(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Ativo atualizado com sucesso!", "success");
                    }}
                />
            )}

            {maintenanceAsset && (
                <RegisterMaintenanceModal
                    asset={maintenanceAsset}
                    onClose={() => setMaintenanceAsset(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Manutenção registrada com sucesso!", "success");
                    }}
                />
            )}

            {disposingAsset && (
                <DisposeAssetModal
                    asset={disposingAsset}
                    onClose={() => setDisposingAsset(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Baixa realizada com sucesso!", "success");
                    }}
                />
            )}
        </div>
    );
}
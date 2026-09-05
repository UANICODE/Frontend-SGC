// app/admin/dashboard/[establishmentId]/costs/general/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { List, Plus, ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGeneralExpensesFilter } from "@/hooks/admin/cost/useGeneralExpensesFilter";
import { useDeleteGeneralExpense } from "@/hooks/admin/cost/useDeleteGeneralExpense";
import { useExportData } from "@/hooks/admin/cost/useExportData";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { GeneralExpensesTable } from "@/components/admin/tables/GeneralExpensesTable";
import { CreateGeneralExpenseModal } from "@/components/admin/modals/CreateGeneralExpenseModal";
import { EditGeneralExpenseModal } from "@/components/admin/modals/EditGeneralExpenseModal";
import { GeneralExpenseFilters } from "@/components/admin/GeneralExpenseFilters";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useToast } from "@/ context/ToastContext";
import { ExportDataResponse } from "@/types/admin/cost";
import { generateCostsPDF } from "@/utils/pdfGenerator";

export default function GeneralExpensesPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0] ?? ""
        : params.establishmentId ?? "";

    const router = useRouter();
    const { showToast } = useToast();

    const { data, loading, refresh, filters, applyFilters, clearFilters, goToPage } = useGeneralExpensesFilter(establishmentId);
    const { execute: deleteExpense } = useDeleteGeneralExpense();
    const { fetch: fetchExportData, loading: exporting } = useExportData();
    const { data: establishment } = useEstablishment(establishmentId);

    const [openCreate, setOpenCreate] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);

    const handleDelete = async (expenseId: string) => {
        if (!confirm("Tem certeza que deseja remover este custo?")) return;
        if (!establishmentId) {
            showToast("Estabelecimento inválido.", "error");
            return;
        }
        try {
            await deleteExpense(expenseId, establishmentId);
            await refresh();
            showToast("Custo removido com sucesso!", "success");
        } catch (error) {
            // Error already handled by hook
        }
    };
const handleExportPDF = async () => {
    try {
        const exportData: ExportDataResponse = await fetchExportData({
            establishmentId,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        });

        // Mapear para o formato CostsReportItem com todos os campos obrigatórios
        const allExpenses = exportData.groupedExpenses.flatMap(group => 
            group.expenses.map(expense => ({
                id: expense.id,
                description: expense.description,
                categoryName: expense.categoryName,
                period: expense.period,
                referenceDate: expense.referenceDate,
                amount: expense.amount,
                registeredByName: expense.registeredByName || "N/A",
                notes: expense.notes || "", // Convertendo null para string vazia
            }))
        );

        const pdfOptions = {
            title: "Relatório de despesas gerais",
            subtitle: "Lista detalhada de todos as despesas registradas",
            establishmentName: establishment?.tradeName || "Sistema",
            primaryColor: establishment?.primaryColor || "#4F46E5",
            secondaryColor: establishment?.secondaryColor || "#7C3AED",
            periodStart: exportData.periodStart,
            periodEnd: exportData.periodEnd,
        };

        const pdfDataUrl = generateCostsPDF(allExpenses, pdfOptions);

        const link = document.createElement("a");
        link.download = `relatorio_custos_${new Date().toISOString().split("T")[0]}.pdf`;
        link.href = pdfDataUrl;
        link.click();

        showToast("PDF gerado com sucesso!", "success");
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        showToast("Erro ao gerar PDF. Tente novamente.", "error");
    }
};
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/admin/dashboard/${establishmentId}/costs`)}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <List className="w-7 h-7" /> Custos Gerais
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Registre custos fixos como aluguel, salários, etc
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {exporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Exportar PDF
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Custo
                    </button>
                </div>
            </div>

            {/* FILTROS */}
            <GeneralExpenseFilters
                establishmentId={establishmentId}
                filters={filters}
                onApply={applyFilters}
                onClear={clearFilters}
            />

            {/* TABELA */}
            <GeneralExpensesTable
                data={data?.content || []}
                loading={loading}
                onEdit={setEditingExpense}
                onDelete={handleDelete}
                totalAmount={data?.totalAmount}
                averageAmount={data?.averageAmount}
            />

            {/* Paginação */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Mostrando {data.page * data.size + 1} a {Math.min((data.page + 1) * data.size, data.totalElements)} de {data.totalElements} registros
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => goToPage(data.page - 1)}
                            disabled={data.page === 0}
                            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 bg-primary/10 rounded-xl font-medium">
                            {data.page + 1} / {data.totalPages}
                        </span>
                        <button
                            onClick={() => goToPage(data.page + 1)}
                            disabled={data.page >= data.totalPages - 1}
                            className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}

            {/* MODAIS */}
            {openCreate && (
                <CreateGeneralExpenseModal
                    establishmentId={establishmentId}
                    onClose={() => setOpenCreate(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Custo geral criado com sucesso!", "success");
                    }}
                />
            )}

            {editingExpense && (
                <EditGeneralExpenseModal
                    expense={editingExpense}
                    establishmentId={establishmentId}
                    onClose={() => setEditingExpense(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Custo geral atualizado com sucesso!", "success");
                    }}
                />
            )}
        </div>
    );
}
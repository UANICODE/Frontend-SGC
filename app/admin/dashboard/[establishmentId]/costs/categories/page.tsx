// app/admin/dashboard/[establishmentId]/costs/categories/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Tag, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCostCategories } from "@/hooks/admin/cost/useCostCategories";
import { useDeleteCostCategory } from "@/hooks/admin/cost/useDeleteCostCategory";
import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";
import { CreateCostCategoryModal } from "@/components/admin/modals/CreateCostCategoryModal";
import { EditCostCategoryModal } from "@/components/admin/modals/EditCostCategoryModal";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useToast } from "@/ context/ToastContext";
import { useActivateCostCategory } from "@/hooks/admin/cost/useActivateCostCategory";

export default function CostCategoriesPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId;
    const estId = establishmentId as string;

    const router = useRouter();
    const { showToast } = useToast();

    const { data, loading, refresh } = useCostCategories(estId, false);
    const { execute: deleteCategory } = useDeleteCostCategory();

    const [openCreate, setOpenCreate] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const { execute: activateCategory, loading: togglingStatus } = useActivateCostCategory();
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleStatus = async (categoryId: string) => {
        setTogglingId(categoryId);
        try {
            await activateCategory(categoryId, estId);
            await refresh();
            showToast("Status da categoria atualizado com sucesso!", "success");
        } catch (error) {
            // Error already handled by hook
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (categoryId: string) => {
        const category = data?.find(c => c.id === categoryId);
        if (category?.active !== false) {
            showToast("Desative a categoria antes de excluí-la", "error");
            return;
        }
        
        if (!confirm("Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            await deleteCategory(categoryId, estId);
            await refresh();
            showToast("Categoria excluída com sucesso!", "success");
        } catch (error) {
            // Error already handled by hook
        }
    };

    // Ensure the data matches the shape expected by CategoriesTable
    const mappedData = data?.map((c: any) => ({
        ...c,
        isKitchen: c.isKitchen ?? false,
        createdAt: c.createdAt ?? new Date().toISOString(),
    }));

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/admin/dashboard/${estId}/costs`)}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <Tag className="w-7 h-7" /> Categorias de Custos
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Gerencie as categorias para classificar seus custos
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setOpenCreate(true)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nova Categoria
                </button>
            </div>

            {/* TABELA */}
            <CategoriesTable
                establishmentId={estId}
                data={mappedData}
                loading={loading}
                onEdit={setEditingCategory}
                onRefresh={refresh}
                currentPage={0}
                totalPages={1}
                totalItems={data?.length || 0}
                onPageChange={() => {}}
                onToggleStatus={handleToggleStatus}
                togglingStatusId={togglingId}  // 🔥 Passar ID que está sendo alterado
            />

            {/* MODAIS */}
            {openCreate && (
                <CreateCostCategoryModal
                    establishmentId={estId}
                    onClose={() => setOpenCreate(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Categoria criada com sucesso!", "success");
                    }}
                />
            )}

            {editingCategory && (
                <EditCostCategoryModal
                    category={editingCategory}
                    establishmentId={estId}
                    onClose={() => setEditingCategory(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Categoria atualizada com sucesso!", "success");
                    }}
                />
            )}
        </div>
    );
}
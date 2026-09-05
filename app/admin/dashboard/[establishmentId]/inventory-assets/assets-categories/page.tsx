// app/admin/dashboard/[establishmentId]/inventory-assets/assets-categories/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, RefreshCw, Tag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useAssetCategories } from "@/hooks/admin/asset/useAssetCategories";
import { useCreateAssetCategory } from "@/hooks/admin/asset/useCreateAssetCategory";
import { useUpdateAssetCategory } from "@/hooks/admin/asset/useUpdateAssetCategory";
import { useDeleteAssetCategory } from "@/hooks/admin/asset/useDeleteAssetCategory";
import { useToast } from "@/ context/ToastContext";
import { CreateAssetCategoryModal } from "@/components/admin/modals/CreateAssetCategoryModal";
import { EditAssetCategoryModal } from "@/components/admin/modals/EditAssetCategoryModal";

export default function AssetCategoriesPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0] ?? ""
        : params.establishmentId ?? "";

    const { data: establishment } = useEstablishment(establishmentId);
    const { data, loading, refresh } = useAssetCategories(establishmentId, false);
    const { execute: createCategory, loading: creating } = useCreateAssetCategory();
    const { execute: updateCategory, loading: updating } = useUpdateAssetCategory();
    const { execute: deleteCategory, loading: deleting } = useDeleteAssetCategory();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const primaryColor = establishment?.primaryColor || "#4F46E5";

    const handleDelete = async (categoryId: string) => {
        if (!confirm("Tem certeza que deseja remover esta categoria?")) return;
        try {
            await deleteCategory(categoryId, establishmentId);
            await refresh();
            showToast("Categoria removida com sucesso!", "success");
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/assets`)}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Categorias de Ativos</h1>
                        <p className="text-sm text-gray-400 mt-1">Gerencie as categorias do patrimônio</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={refresh}
                        className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Categoria
                    </button>
                </div>
            </div>

            {/* TABELA */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500">Carregando categorias...</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Nenhuma categoria encontrada</p>
                    <p className="text-sm text-gray-400 mt-1">Clique em "Nova Categoria" para começar</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-left font-semibold text-gray-600">Nome</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Descrição</th>
                                    <th className="p-4 text-center font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-center font-semibold text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((category) => (
                                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">{category.name}</td>
                                        <td className="p-4 text-gray-500">{category.description || "-"}</td>
                                        <td className="p-4 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-full ${category.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {category.active ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => setEditingCategory(category)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                                                    disabled={deleting}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAIS */}
            {showCreateModal && (
                <CreateAssetCategoryModal
                    establishmentId={establishmentId}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Categoria criada com sucesso!", "success");
                    }}
                />
            )}

            {editingCategory && (
                <EditAssetCategoryModal
                    category={editingCategory}
                    establishmentId={establishmentId}
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
// components/admin/asset/EditAssetModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, Package, Tag, DollarSign, MapPin, Calendar } from "lucide-react";
import { useUpdateAsset } from "@/hooks/admin/asset/useUpdateAsset";
import { useAssetCategories } from "@/hooks/admin/asset/useAssetCategories";
import { Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

interface Props {
    asset: Asset;
    establishmentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const STATUS_OPTIONS = ["NOVO", "BOM", "USADO", "DANIFICADO", "INUTILIZÁVEL"];

type AssetWithCategory = Asset & { categoryId?: string | null };

export function EditAssetModal({ asset, establishmentId, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useUpdateAsset();
    const { data: categories, loading: loadingCategories } = useAssetCategories(establishmentId, true);
    const assetWithCategory = asset as AssetWithCategory;

    const [form, setForm] = useState({
        categoryId: "",
        name: "",
        quantity: 1,
        purchaseValue: 0,
        acquisitionDate: "",
        location: "",
        status: "BOM",
        notes: "",
    });

    useEffect(() => {
        setForm({
            categoryId: assetWithCategory.categoryId || "",
            name: asset.name,
            quantity: asset.quantity,
            purchaseValue: asset.purchaseValue,
            acquisitionDate: asset.acquisitionDate?.split("T")[0] || "",
            location: asset.location,
            status: asset.status || "BOM",
            notes: asset.notes || "",
        });
    }, [asset, assetWithCategory.categoryId]);

    const handleSubmit = async () => {
        if (!form.categoryId) {
            showToast("Selecione uma categoria", "error");
            return;
        }
        if (!form.name) {
            showToast("Informe o nome do ativo", "error");
            return;
        }
        if (form.purchaseValue <= 0) {
            showToast("Informe um valor válido", "error");
            return;
        }

        try {
            await execute(asset.id, {
                establishmentId,
                categoryId: form.categoryId,
                name: form.name,
                quantity: form.quantity,
                purchaseValue: form.purchaseValue,
                acquisitionDate: form.acquisitionDate,
                location: form.location,
                status: form.status,
                notes: form.notes || undefined,
            });
            onSuccess();
            onClose();
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Editar Ativo</h2>
                                <p className="text-white/80 text-sm">{asset.code} - {asset.name}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Tag className="w-4 h-4 text-primary" /> Categoria *
                        </label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            disabled={loadingCategories}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-primary" /> Nome *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Frigorífico Industrial"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Quantidade *</label>
                            <input
                                type="number"
                                min={1}
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-primary" /> Valor *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={form.purchaseValue}
                                onChange={(e) => setForm({ ...form, purchaseValue: parseFloat(e.target.value) || 0 })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-primary" /> Data Aquisição
                            </label>
                            <input
                                type="date"
                                value={form.acquisitionDate}
                                onChange={(e) => setForm({ ...form, acquisitionDate: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-primary" /> Localização *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Cozinha, Sala 1, Armazém..."
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Observações</label>
                        <textarea
                            placeholder="Informações adicionais..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={2}
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-6 bg-gray-50 border-t flex-shrink-0">
                    <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Atualizando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Atualizar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
// components/admin/asset/CreateAssetCategoryModal.tsx
"use client";

import { useState } from "react";
import { X, Save, Tag, FileText } from "lucide-react";
import { useCreateAssetCategory } from "@/hooks/admin/asset/useCreateAssetCategory";
import { useToast } from "@/ context/ToastContext";

interface Props {
    establishmentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateAssetCategoryModal({ establishmentId, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useCreateAssetCategory();

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            showToast("Informe o nome da categoria", "error");
            return;
        }

        try {
            await execute({
                establishmentId,
                name: form.name.trim(),
                description: form.description.trim() || undefined,
            });
            onSuccess();
            onClose();
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Nova Categoria</h2>
                                <p className="text-white/80 text-sm">Crie uma nova categoria de ativos</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Tag className="w-4 h-4 text-primary" /> Nome *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Equipamentos, Mobiliário, Tecnologia..."
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" /> Descrição
                        </label>
                        <textarea
                            placeholder="Descrição da categoria..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={2}
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Criar Categoria
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
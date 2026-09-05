// components/admin/inventory/CreateInventoryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, Package, AlertCircle } from "lucide-react";
import { useCreateInventory } from "@/hooks/admin/inventory/useCreateInventory";
import { useInventoryTypes } from "@/hooks/admin/inventory/useInventoryTypes";
import { useToast } from "@/ context/ToastContext";

interface Props {
    establishmentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateInventoryModal({ establishmentId, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useCreateInventory();
    const { data: types, loading: loadingTypes } = useInventoryTypes();

    const [form, setForm] = useState({
        typeId: "",
        notes: "",
    });

    const handleSubmit = async () => {
        if (!form.typeId) {
            showToast("Selecione o tipo de inventário", "error");
            return;
        }

        try {
            await execute({
                establishmentId,
                typeId: form.typeId, // 🔥 AGORA É UM UUID
                notes: form.notes || undefined,
            });
            onSuccess();
            onClose();
        } catch (error) {
            // Error already handled by hook
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Novo Inventário</h2>
                                <p className="text-white/80 text-sm">Inicie um novo inventário</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Tipo de Inventário *
                        </label>
                        <select
                            value={form.typeId}
                            onChange={(e) => setForm({ ...form, typeId: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            disabled={loadingTypes}
                        >
                            <option value="">Selecione um tipo</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {loadingTypes && (
                            <p className="text-xs text-gray-400 mt-1">Carregando tipos...</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Produtos: apenas stock • Ativos: apenas patrimônio • Completo: ambos
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Observações</label>
                        <textarea
                            placeholder="Informações adicionais..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-600">
                            Ao iniciar um inventário, o sistema irá listar todos os itens com suas quantidades atuais.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.typeId}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Criar Inventário
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
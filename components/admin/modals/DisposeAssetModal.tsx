// components/admin/asset/DisposeAssetModal.tsx
"use client";

import { useState } from "react";
import { X, Save, AlertTriangle, Calendar, DollarSign, FileText } from "lucide-react";
import { useDisposeAsset } from "@/hooks/admin/asset/useDisposeAsset";
import { Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

interface Props {
    asset: Asset;
    onClose: () => void;
    onSuccess: () => void;
}

const DISPOSAL_TYPES = [
    { value: "VENDA", label: "Venda" },
    { value: "DESCARTE", label: "Descarte" },
    { value: "PERDA", label: "Perda" },
];

export function DisposeAssetModal({ asset, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useDisposeAsset();

    const [form, setForm] = useState({
        disposalType: "VENDA",
        disposalDate: new Date().toISOString().split("T")[0],
        saleValue: 0,
        reason: "",
    });

    const handleSubmit = async () => {
        if (!form.disposalType) {
            showToast("Selecione o tipo de baixa", "error");
            return;
        }

        try {
            await execute({
                assetId: asset.id,
                disposalType: form.disposalType as any,
                disposalDate: form.disposalDate,
                saleValue: form.saleValue || undefined,
                reason: form.reason || undefined,
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
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Dar Baixa no Ativo</h2>
                                <p className="text-white/80 text-sm">{asset.code} - {asset.name}</p>
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
                            <AlertTriangle className="w-4 h-4 text-primary" /> Tipo de Baixa *
                        </label>
                        <select
                            value={form.disposalType}
                            onChange={(e) => setForm({ ...form, disposalType: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                            {DISPOSAL_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-primary" /> Data *
                        </label>
                        <input
                            type="date"
                            value={form.disposalDate}
                            onChange={(e) => setForm({ ...form, disposalDate: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    {form.disposalType === "VENDA" && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-primary" /> Valor de Venda
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={form.saleValue}
                                onChange={(e) => setForm({ ...form, saleValue: parseFloat(e.target.value) || 0 })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" /> Motivo
                        </label>
                        <textarea
                            placeholder="Informe o motivo da baixa..."
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="bg-red-50 rounded-xl p-3 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600">
                            Esta ação é irreversível. O ativo será removido do inventário ativo.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Confirmar Baixa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
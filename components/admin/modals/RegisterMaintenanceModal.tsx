// components/admin/asset/RegisterMaintenanceModal.tsx
"use client";

import { useState } from "react";
import { X, Save, Wrench, Calendar, DollarSign, FileText } from "lucide-react";
import { useRegisterMaintenance } from "@/hooks/admin/asset/useRegisterMaintenance";
import { Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

interface Props {
    asset: Asset;
    onClose: () => void;
    onSuccess: () => void;
}

export function RegisterMaintenanceModal({ asset, onClose, onSuccess }: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useRegisterMaintenance();

    const [form, setForm] = useState({
        maintenanceDate: new Date().toISOString().split("T")[0],
        cost: 0,
        description: "",
    });

    const handleSubmit = async () => {
        if (!form.description) {
            showToast("Descreva a manutenção realizada", "error");
            return;
        }

        try {
            await execute({
                assetId: asset.id,
                maintenanceDate: form.maintenanceDate,
                cost: form.cost || undefined,
                description: form.description,
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
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Wrench className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Registrar Manutenção</h2>
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
                            <Calendar className="w-4 h-4 text-primary" />
                            Data *
                        </label>
                        <input
                            type="date"
                            value={form.maintenanceDate}
                            onChange={(e) => setForm({ ...form, maintenanceDate: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Custo
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.cost}
                            onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" />
                            Descrição *
                        </label>
                        <textarea
                            placeholder="Descreva a manutenção realizada..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={3}
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
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Registrar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
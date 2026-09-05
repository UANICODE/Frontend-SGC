// components/admin/modals/ReportFilterModal.tsx
"use client";

import { useState } from "react";
import { X, Calendar, Filter } from "lucide-react";

interface ReportFilterModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    title: string;
    showStatus?: boolean;
    showCategory?: boolean;
    showSupplier?: boolean;
    suppliers?: Array<{ id: string; name: string }>;
}

export function ReportFilterModal({
    open,
    onClose,
    onApply,
    title,
    showStatus = false,
    showCategory = false,
    showSupplier = false,
    suppliers = [],
}: ReportFilterModalProps) {
    const [filters, setFilters] = useState({
        status: "",
        categoryId: "",
        startDate: "",
        endDate: "",
        supplierId: "",
    });

    if (!open) return null;

    const statusOptions = ["ABERTO", "CONTAGEM", "REVISAO", "APROVADO"];

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Filter className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Data Início
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Data Fim
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>


                        {showSupplier && (
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Fornecedor</label>
                                <select
                                    value={filters.supplierId || ""}
                                    onChange={(e) => setFilters({ ...filters, supplierId: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                >
                                    <option value="">Todos</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                    {showStatus && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="">Todos</option>
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
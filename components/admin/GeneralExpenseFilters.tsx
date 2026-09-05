// components/admin/filters/GeneralExpenseFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { Filter, X, Calendar, DollarSign, Tag } from "lucide-react";
import { useCostCategories } from "@/hooks/admin/cost/useCostCategories";

interface Props {
    establishmentId: string;
    filters: {
        categoryId?: string;
        period?: string;
        startDate?: string;
        endDate?: string;
        minAmount?: number;
        maxAmount?: number;
    };
    onApply: (filters: any) => void;
    onClear: () => void;
}

export function GeneralExpenseFilters({ establishmentId, filters, onApply, onClear }: Props) {
    const { data: categories } = useCostCategories(establishmentId);
    const [localFilters, setLocalFilters] = useState(filters);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const periodOptions = [
        { value: "MONTHLY", label: "Mensal" },
        { value: "YEARLY", label: "Anual" },
        { value: "ONCE", label: "Único" },
    ];

    const hasActiveFilters = () => {
        const { categoryId, period, startDate, endDate, minAmount, maxAmount } = localFilters;
        return !!(categoryId || period || startDate || endDate || minAmount || maxAmount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApply(localFilters);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header do Filtro */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-700">Filtros</span>
                    {hasActiveFilters() && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            Filtros ativos
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {hasActiveFilters() && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Limpar
                        </button>
                    )}
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Conteúdo do Filtro */}
            {isExpanded && (
                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Categoria */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <Tag className="w-4 h-4 text-primary" />
                                Categoria
                            </label>
                            <select
                                value={localFilters.categoryId || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, categoryId: e.target.value || undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="">Todas</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Período */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                Periodicidade
                            </label>
                            <select
                                value={localFilters.period || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, period: e.target.value || undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="">Todos</option>
                                {periodOptions.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Data Início */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                Data Início
                            </label>
                            <input
                                type="date"
                                value={localFilters.startDate || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value || undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Data Fim */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                Data Fim
                            </label>
                            <input
                                type="date"
                                value={localFilters.endDate || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value || undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Valor Mínimo */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Valor Mínimo
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={localFilters.minAmount || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Valor Máximo */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Valor Máximo
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={localFilters.maxAmount || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Aplicar Filtros
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLocalFilters({
                                    categoryId: undefined,
                                    period: undefined,
                                    startDate: undefined,
                                    endDate: undefined,
                                    minAmount: undefined,
                                    maxAmount: undefined,
                                });
                            }}
                            className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                        >
                            Limpar Campos
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
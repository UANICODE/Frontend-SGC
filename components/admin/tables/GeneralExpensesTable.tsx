// components/admin/tables/GeneralExpensesTable.tsx
"use client";

import { Pencil, Trash2, Calendar, User } from "lucide-react";
import { GeneralExpense } from "@/types/admin/cost";

interface Props {
    data: GeneralExpense[];
    loading: boolean;
    onEdit: (expense: GeneralExpense) => void;
    onDelete: (expenseId: string) => void;
    totalAmount?: number;
    averageAmount?: number;
}

export function GeneralExpensesTable({ data, loading, onEdit, onDelete, totalAmount, averageAmount }: Props) {
    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getPeriodLabel = (period: string) => {
        const map: Record<string, string> = {
            MONTHLY: "Mensal",
            YEARLY: "Anual",
            ONCE: "Único",
        };
        return map[period] || period;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-500 font-medium">Nenhum custo geral encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Ajuste os filtros ou crie um novo custo</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Resumo do Total */}
            {(totalAmount !== undefined || averageAmount !== undefined) && (
                <div className="px-6 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-6">
                        {totalAmount !== undefined && (
                            <span className="text-sm">
                                Total: <strong className="text-primary">{formatCurrency(totalAmount)}</strong>
                            </span>
                        )}
                        {averageAmount !== undefined && data.length > 0 && (
                            <span className="text-sm text-gray-500">
                                Média: {formatCurrency(averageAmount)}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400">
                        {data.length} {data.length === 1 ? 'registro' : 'registros'}
                    </span>
                </div>
            )}

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                            <th className="p-4 text-left rounded-tl-2xl">Descrição</th>
                            <th className="p-4 text-left">Categoria</th>
                            <th className="p-4 text-center">Período</th>
                            <th className="p-4 text-center">Data</th>
                            <th className="p-4 text-right">Valor</th>
                            <th className="p-4 text-center rounded-tr-2xl">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((expense) => (
                            <tr key={expense.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">{expense.description}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <User className="w-3 h-3" />
                                            {expense.registeredByName}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                        {expense.categoryName}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                        {getPeriodLabel(expense.period)}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-gray-500">
                                    <span className="flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(expense.referenceDate)}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-primary">
                                    {formatCurrency(expense.amount)}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(expense)}
                                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(expense.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remover"
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
    );
}
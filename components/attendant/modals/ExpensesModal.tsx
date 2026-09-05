// components/attendant/modals/ExpensesModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
    X,
    Plus,
    Pencil,
    Trash2,
    DollarSign,
    AlertCircle,
    Calendar,
    User,
} from "lucide-react";

import { useCashRegisterExpenses } from "@/hooks/attendant/useCashRegisterExpenses";
import { useDeleteCashRegisterExpense } from "@/hooks/attendant/useDeleteCashRegisterExpense";
import { useToast } from "@/ context/ToastContext";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { CreateExpenseModal } from "./CreateExpenseModal";
import { EditExpenseModal } from "./EditExpenseModal";

interface Props {
    open: boolean;
    cashRegisterId: string;
    cashRegisterStatus: string;
    establishmentId: string; // 🆕 ADICIONAR
    onClose: () => void;
    onSuccess?: () => void;
}

export function ExpensesModal({
    open,
    cashRegisterId,
    cashRegisterStatus,
    establishmentId, // 🆕 RECEBER
    onClose,
    onSuccess,
}: Props) {
    const { showToast } = useToast();
    const { data: expenses, loading, fetch } = useCashRegisterExpenses();
    const { execute: deleteExpense, loading: deleting } = useDeleteCashRegisterExpense();

    const [openCreate, setOpenCreate] = useState(false);
    const [editingExpense, setEditingExpense] = useState<CashRegisterExpense | null>(null);

    const isOpen = cashRegisterStatus === "ABERTO";

    useEffect(() => {
        if (open && cashRegisterId) {
            fetch(cashRegisterId);
        }
    }, [open, cashRegisterId, fetch]);

    const handleDelete = async (expenseId: string) => {
        if (!confirm("Tem certeza que deseja remover este custo?")) return;
        try {
            await deleteExpense(expenseId);
            await fetch(cashRegisterId);
            onSuccess?.();
        } catch (error) {
            // Error already handled by hook
        }
    };

    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[95vh] flex flex-col">
                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 flex-shrink-0 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Saídas do Caixa
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        {expenses.length} registro(s) de saída
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Botão Registrar Saída (só se caixa aberto) */}
                        {isOpen && (
                            <button
                                onClick={() => setOpenCreate(true)}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Registrar Nova Saída
                            </button>
                        )}

                        {!isOpen && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <p className="text-sm text-amber-700">
                                    Este caixa está fechado. Não é possível adicionar, editar ou remover saídas.
                                </p>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-500">Carregando saídas...</p>
                            </div>
                        )}

                        {/* Lista de Saídas */}
                        {!loading && expenses.length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                    <DollarSign className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Nenhuma saída registrada</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {isOpen
                                        ? "Clique em 'Registrar Nova Saída' para começar"
                                        : "Este caixa não tem saídas registradas"}
                                </p>
                            </div>
                        )}

                        {/* Lista */}
                        {!loading && expenses.length > 0 && (
                            <div className="space-y-3">
                                {expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/20 transition-all"
                                    >
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {expense.description}
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                                    {expense.categoryName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(expense.expenseDate)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {expense.registeredByName}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Valor e Ações */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-primary">
                                                {formatCurrency(expense.amount)}
                                            </span>

                                            {expense.canEdit && isOpen && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setEditingExpense(expense)}
                                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        disabled={deleting}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex gap-3 p-6 bg-gray-50 border-t flex-shrink-0 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Criar Saída - PASSAR establishmentId */}
            {openCreate && (
                <CreateExpenseModal
                    cashRegisterId={cashRegisterId}
                    establishmentId={establishmentId} // 🆕 PASSAR
                    onClose={() => setOpenCreate(false)}
                    onSuccess={() => {
                        fetch(cashRegisterId);
                        onSuccess?.();
                    }}
                />
            )}

            {/* Modal Editar Saída */}
            {editingExpense && (
                <EditExpenseModal
                    expense={editingExpense}
                    establishmentId={establishmentId} // 🆕 PASSAR
                    onClose={() => setEditingExpense(null)}
                    onSuccess={() => {
                        fetch(cashRegisterId);
                        onSuccess?.();
                    }}
                />
            )}
        </>
    );
}
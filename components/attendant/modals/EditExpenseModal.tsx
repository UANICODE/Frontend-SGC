// components/attendant/modals/EditExpenseModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, DollarSign, Tag, FileText } from "lucide-react";

import { useUpdateCashRegisterExpense } from "@/hooks/attendant/useUpdateCashRegisterExpense";
import { useCostCategories } from "@/hooks/attendant/useCostCategories";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

interface Props {
    expense: CashRegisterExpense;
    establishmentId: string;  // 🔥 RECEBE
    onClose: () => void;
    onSuccess: () => void;
}

export function EditExpenseModal({ 
    expense, 
    establishmentId,  // 🔥 EXTRAIR
    onClose, 
    onSuccess 
}: Props) {
    const { showToast } = useToast();
    const { execute, loading } = useUpdateCashRegisterExpense();
    
    // 🔥 USAR establishmentId recebido como prop
    const { data: categories, loading: loadingCategories } = useCostCategories(establishmentId);

    const [form, setForm] = useState({
        categoryId: expense.categoryId,
        description: expense.description,
        amount: expense.amount,
        notes: expense.notes || "",
    });

    // 🔥 LOG para debug
    useEffect(() => {
        console.log("🔍 EditExpenseModal - establishmentId recebido:", establishmentId);
        console.log("📦 Categorias carregadas:", categories);
    }, [establishmentId, categories]);

    useEffect(() => {
        setForm({
            categoryId: expense.categoryId,
            description: expense.description,
            amount: expense.amount,
            notes: expense.notes || "",
        });
    }, [expense]);

    const handleSubmit = async () => {
        if (!form.categoryId) {
            showToast("Selecione uma categoria", "error");
            return;
        }
        if (!form.description) {
            showToast("Informe uma descrição", "error");
            return;
        }
        if (form.amount <= 0) {
            showToast("Informe um valor válido", "error");
            return;
        }

        try {
            await execute({
                expenseId: expense.id,
                costCategoryId: form.categoryId,
                description: form.description,
                amount: form.amount,
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
                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Editar Saída</h2>
                                <p className="text-white/80 text-sm">Altere os dados do custo</p>
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

                {/* BODY - resto igual */}
                <div className="p-6 space-y-4">
                    {/* Categoria */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Tag className="w-4 h-4 text-primary" />
                            Categoria *
                        </label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            disabled={loadingCategories}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" />
                            Descrição *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Almoço equipe, Material limpeza..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Valor (MZN) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            Observações
                        </label>
                        <textarea
                            placeholder="Informações adicionais..."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows={2}
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex gap-3 p-6 bg-gray-50 border-t">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Salvando...
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